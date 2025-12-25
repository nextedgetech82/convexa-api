const { getTenantPool } = require('../../config/tenantDbManager');

exports.saveAttachment = async (
  user,
  leadId,
  file,
  fileType
) => {
  const db = getTenantPool(user.db);

  const result = await db.query(
    `
    INSERT INTO lead_attachments
    (lead_id, file_type, file_name, file_path, uploaded_by)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      leadId,
      fileType,
      file.originalname,
      file.path,
      user.name,
    ]
  );

  return result.rows[0];
};

exports.getAttachments = async (user, leadId) => {
  const db = getTenantPool(user.db);
  const result = await db.query(
    `SELECT * FROM lead_attachments WHERE lead_id=$1 ORDER BY uploaded_at DESC`,
    [leadId]
  );
  return result.rows;
};
