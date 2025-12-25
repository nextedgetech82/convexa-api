const masterDb = require('../../config/masterDb');
const fs = require('fs');
const path = require('path');
const bcrypt = require('../../utils/password');
const jwt = require('../../utils/jwt');
const { v4: uuid } = require('uuid');
const { Pool } = require('pg');


exports.register = async ({ companyName, name, email, password, mobile }) => {
  const client = await masterDb.connect();
  let tenantPool;
  let createdDbName;
  let transactionStarted = false;

  try {
    const orgId = uuid();
    //const dbName = `crm_org_${orgId.replace(/-/g, '')}`;
    const dbName = `crm_${mobile.replace(/-/g, '')}`;

    // CREATE DATABASE cannot run inside a transaction, so perform setup first.
    await client.query(`CREATE DATABASE ${dbName}`);
    createdDbName = dbName;

    tenantPool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
    });

    const schema = fs.readFileSync(
      path.join(__dirname, '../../migrations/tenant.schema.sql'),
      'utf8'
    );
    await tenantPool.query(schema);

    const hash = await bcrypt.hash(password);

    await client.query('BEGIN');
    transactionStarted = true;

    await client.query(
      `INSERT INTO organizations (id, name, db_name) VALUES ($1,$2,$3)`,
      [orgId, companyName, dbName]
    );

    const user = await client.query(
      `INSERT INTO users (organization_id, role, name, email, password_hash, mobile)
       VALUES ($1, 'admin', $2, $3, $4, $5) RETURNING id`,
      [orgId, name, email, hash, mobile]
    );

    await client.query('COMMIT');
    transactionStarted = false;

    return jwt.sign({
      userId: user.rows[0].id,
      orgId,
      db: dbName,
      role: 'admin',
      name,
    });
  } catch (e) {
    if (transactionStarted) {
      await client.query('ROLLBACK');
    }
    if (createdDbName) {
      try {
        await client.query(`DROP DATABASE IF EXISTS ${createdDbName}`);
      } catch (_) {
        /* ignore cleanup error */
      }
    }
    throw e;
  } finally {
    if (tenantPool) {
      await tenantPool.end().catch(() => {});
    }
    client.release();
  }
};



exports.login = async ({ email, password: plainPassword }) => {
  const result = await masterDb.query(
    `
    SELECT 
      u.id AS user_id,
      u.password_hash,
      u.is_active,
      u.role,
      u.name AS user_name,
      o.id AS org_id,
      o.db_name,
      o.status AS org_status, o.name as org_name
    FROM users u
    JOIN organizations o ON o.id = u.organization_id
    WHERE u.email = $1
    `,
    [email]
  );

  if (result.rowCount === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw new Error('User account is disabled');
  }

  if (user.org_status !== 'active') {
    throw new Error('Organization is suspended');
  }

  const match = await bcrypt.compare(plainPassword, user.password_hash);
  if (!match) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({
    userId: user.user_id,
    orgId: user.org_id,
    db: user.db_name,
    role: user.role,
    name: user.user_name,
  });

  return {
    token,
    user: {
      id: user.user_id,
      role: user.role,
      db: user.db_name,
      name: user.user_name,
      organizationName: user.org_name,
      organizationId: user.org_id,
    },
  };
};
