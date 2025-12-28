const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const controller = require('./lead.controller');

router.use(auth);

router.post('/', controller.create);
router.post('/followups', controller.createFollowup);
router.post('/calls', controller.createCallLog);
router.get('/calls/:leadId', controller.getCallLogs);
router.get('/followups/:leadId', controller.getFollowups);
router.get('/', controller.list);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.delete('/followups/:id', controller.removeFollowup);

module.exports = router;
