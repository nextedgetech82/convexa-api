const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.getUploader = (tenantDb, leadId) => {
  const basePath = path.join(
    __dirname,
    '../../../uploads',
    tenantDb,
    'leads',
    leadId
  );

  fs.mkdirSync(basePath, { recursive: true });

  
  const storage = multer.diskStorage({
    destination: basePath,
    filename: (req, file, cb) => {
      console.log(file.originalname);

      const uniqueName =
        Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
      cb(null, uniqueName);
    },
  });

  return multer({ storage });
};
