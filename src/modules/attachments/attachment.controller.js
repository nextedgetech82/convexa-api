const { getUploader } = require('./multer.config');
const service = require('./attachment.service');

exports.upload = async (req, res) => {
  const { leadId, fileType } = req.query;

  if (!leadId || !fileType) {
    return res
      .status(400)
      .json({ message: 'leadId and fileType required' });
  }

  const upload = getUploader(req.user.db, leadId).single('file');

  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    const attachment = await service.saveAttachment(
      req.user,
      leadId,
      req.file,
      fileType
    );

    res.status(201).json(attachment);
  });
};

exports.list = async (req, res) => {
  const attachments = await service.getAttachments(
    req.user,
    req.params.leadId
  );
  res.json(attachments);
};
