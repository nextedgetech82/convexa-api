const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const controller = require('./master.controller');

router.use(auth);

/* PRODUCT GROUPS */
router.post('/product-groups', controller.createProductGroup);
router.get('/product-groups', controller.listProductGroups);
router.delete('/product-groups/:id', controller.removeProductGroup);

/* CUSTOMER GROUPS */
router.post('/customer-groups', controller.createCustomerGroup);
router.get('/customer-groups', controller.listCustomerGroups);
router.delete('/customer-groups/:id', controller.removeCustomerGroup);

module.exports = router;
