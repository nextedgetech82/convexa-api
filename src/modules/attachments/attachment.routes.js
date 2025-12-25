const router = require('express').Router();
const auth = require('../../middlewares/auth.middleware');
const controller = require('./attachment.controller');

router.use(auth);

/**
 * Upload attachment
 * POST /attachments/upload?leadId=UUID&fileType=image
 * form-data: file=<file>
 */
router.post('/upload', controller.upload);

/**
 * List attachments
 * GET /attachments/:leadId
 */
router.get('/:leadId', controller.list);

module.exports = router;
