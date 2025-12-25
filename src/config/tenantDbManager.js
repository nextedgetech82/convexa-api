const { Pool } = require('pg');
require('dotenv').config();

const pools = {};

exports.getTenantPool = (dbName) => {
  if (!pools[dbName]) {
    pools[dbName] = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: dbName,
    });
  }
  return pools[dbName];
};
