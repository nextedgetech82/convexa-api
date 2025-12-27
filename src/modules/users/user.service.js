const masterDb = require('../../config/masterDb');
const passwordUtil = require('../../utils/password');

exports.createUser = async ({ orgId, name, email, password, role, mobile }) => {
  if (!['salesman', 'staff'].includes(role)) {
    throw new Error('Invalid role');
  }

//   const roleRes = await masterDb.query(
//     'SELECT id FROM roles WHERE name = $1',
//     [role]
//   );

//   if (roleRes.rowCount === 0) {
//     throw new Error('Role not found');
//   }

  const passwordHash = await passwordUtil.hash(password);

  try {
    const result = await masterDb.query(
      `
      INSERT INTO users (organization_id, role, name, email, password_hash, mobile)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email
      `,
      [orgId, role, name, email, passwordHash, mobile]
    );

    return result.rows[0];
  } catch (e) {
    if (e.code === '23505') {
      throw new Error('Email already exists');
    }
    throw e;
  }
};

exports.getAssignableUsers = async (user) => {
  //const db = getTenantPool(user.db);

  const result = await masterDb.query(`
    SELECT id, name, email
    FROM users
    WHERE role IN ('admin','salesman')
    ORDER BY name
  `);

  return result.rows;
};


