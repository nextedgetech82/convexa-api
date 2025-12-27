const { getTenantPool } = require('../../config/tenantDbManager');

/* ---------------- PRODUCT GROUPS ---------------- */

exports.createProductGroup = async (user, data) => {
  const db = getTenantPool(user.db);

  const result = await db.query(
    `
    INSERT INTO productgroups (name)
    VALUES ($1)
    RETURNING *
    `,
    [data.name]
  );

  return result.rows[0];
};

exports.getProductGroups = async (user) => {
  const db = getTenantPool(user.db);

  const result = await db.query(
    `SELECT * FROM productgroups WHERE is_active = true ORDER BY name`
  );

  return result.rows;
};

exports.deleteProductGroup = async (user, id) => {
  const db = getTenantPool(user.db);

  await db.query(
    `UPDATE productgroups SET is_active = false WHERE id = $1`,
    [id]
  );
};

/* ---------------- CUSTOMER GROUPS ---------------- */

exports.createCustomerGroup = async (user, data) => {
  const db = getTenantPool(user.db);

  const result = await db.query(
    `
    INSERT INTO customergroups (name)
    VALUES ($1)
    RETURNING *
    `,
    [data.name]
  );

  return result.rows[0];
};

exports.getCustomerGroups = async (user) => {
  const db = getTenantPool(user.db);

  const result = await db.query(
    `SELECT * FROM customergroups WHERE is_active = true ORDER BY name`
  );

  return result.rows;
};

exports.deleteCustomerGroup = async (user, id) => {
  const db = getTenantPool(user.db);

  await db.query(
    `UPDATE customergroups SET is_active = false WHERE id = $1`,
    [id]
  );
};
