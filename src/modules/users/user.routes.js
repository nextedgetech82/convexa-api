const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const rbac = require('../../middlewares/rbac.middleware');
const controller = require('./user.controller');

router.post('/', auth, rbac('admin'), controller.createUser);

module.exports = router;
