const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
