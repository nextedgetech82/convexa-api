const express = require('express');
const app = express();

app.use(express.json());
app.use('/auth', require('./modules/auth/auth.routes'));
app.use('/users', require('./modules/users/user.routes'));
app.use('/leads', require('./modules/leads/lead.routes'));
app.use('/attachments', require('./modules/attachments/attachment.routes'));

module.exports = app;
