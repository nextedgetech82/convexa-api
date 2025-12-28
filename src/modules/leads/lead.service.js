const { getTenantPool } = require('../../config/tenantDbManager');

exports.createLead = async (user, data) => {
  const db = getTenantPool(user.db);

  const result = await db.query(
    `
    INSERT INTO leads (
      lead_source, first_name, last_name, designation, organization,
      email, mobile, telephone, fax,
      address1, address2, country, zipcode,
      product_group, customer_group,
      deal_size, potential, lead_stage,
      assigned_to, created_by
    )
    VALUES (
      $1,$2,$3,$4,$5,
      $6,$7,$8,$9,
      $10,$11,$12,$13,
      $14,$15,
      $16,$17,$18,
      $19,$20
    )
    RETURNING *
    `,
    [
      data.lead_source,
      data.first_name,
      data.last_name,
      data.designation,
      data.organization,
      data.email,
      data.mobile,
      data.telephone,
      data.fax,
      data.address1,
      data.address2,
      data.country,
      data.zipcode,
      data.product_group,
      data.customer_group,
      data.deal_size,
      data.potential,
      data.lead_stage || 'new',
      data.assigned_to,
      user.name 
    ]
  );

  return result.rows[0];
};

exports.getLeads = async (user) => {
  const db = getTenantPool(user.db);

  let query = `SELECT * FROM leads`;
  let params = [];

  if (user.role !== 'admin') {
    query += ` WHERE assigned_to = $1`;
    params.push(user.name);
  }

  query += ` ORDER BY created_at DESC`;

  const result = await db.query(query, params);
  return result.rows;
};


exports.updateLead = async (user, leadId, data) => {
  const db = getTenantPool(user.db);

  const result = await db.query(
    `
    UPDATE leads SET
      first_name=$1,
      last_name=$2,
      designation=$3,
      organization=$4,
      email=$5,
      mobile=$6,
      lead_stage=$7,
      assigned_to=$8,
      updated_at=now()
    WHERE id=$9
    RETURNING *
    `,
    [
      data.first_name,
      data.last_name,
      data.designation,
      data.organization,
      data.email,
      data.mobile,
      data.lead_stage,
      data.assigned_to,
      leadId
    ]
  );

  return result.rows[0];
};

exports.deleteLead = async (user, leadId) => {
  const db = getTenantPool(user.db);
  await db.query(`DELETE FROM leads WHERE id=$1`, [leadId]);
};


exports.createFollowup = async (user, data) => {
  const db = getTenantPool(user.db);

  const result = await db.query(
    `
    INSERT INTO lead_followups
    (lead_id, assigned_to, next_followup_date, repeat_followup, repeat_followup_type, do_not_followup, disposition, note, created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
    [
      data.lead_id,
      data.assigned_to,
      data.next_followup_date,
      data.repeat_followup,
      data.repeat_followup_type,
      data.do_not_followup,
      data.disposition,
      data.note,
      user.name
    ]
  );

  return result.rows[0];
};

exports.deleteFollowup = async (user, followupId) => {
  const db = getTenantPool(user.db);
  await db.query(`DELETE FROM lead_followups WHERE id = $1`, [followupId]);
};

exports.createCallLog = async (user, data) => {
  const db = getTenantPool(user.db);

  const result = await db.query(
    `
    INSERT INTO lead_calls
    (lead_id, phone, call_type, duration_seconds, called_at)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      data.lead_id,
      data.phone,
      data.call_type,
      data.duration_seconds,
      data.called_at,
    ]
  );

  return result.rows[0];
};

exports.getCallLogs = async (user, leadId) => {
  const db = getTenantPool(user.db);

  let query = `SELECT * FROM lead_calls`;
  let params = [];
  params.push(leadId);

  query += ` WHERE lead_id = $1`;  
  query += ` ORDER BY called_at DESC`;

  const result = await db.query(query, params);
  return result.rows;
};


exports.getFollowups   = async (user, leadId) => {
  const db = getTenantPool(user.db);

  let query = `SELECT * FROM lead_followups`;
  let params = [];
  params.push(leadId);

  query += ` WHERE lead_id = $1`;  
  query += ` ORDER BY created_at DESC`;

  const result = await db.query(query, params);
  return result.rows;
};
