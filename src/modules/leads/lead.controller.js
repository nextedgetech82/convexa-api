const service = require('./lead.service');

exports.create = async (req, res) => {
  const lead = await service.createLead(req.user, req.body);
  res.status(201).json(lead);
};

exports.createFollowup = async (req, res) => {
  const followup = await service.createFollowup(req.user, req.body);
  res.status(201).json(followup);
};

exports.removeFollowup = async (req, res) => {
  await service.deleteFollowup(req.user, req.params.id);
  res.json({ message: 'Followup deleted' });
};

exports.list = async (req, res) => {
  const leads = await service.getLeads(req.user);
  res.json(leads);
};

exports.update = async (req, res) => {
  const lead = await service.updateLead(req.user, req.params.id, req.body);
  res.json(lead);
};

exports.remove = async (req, res) => {
  await service.deleteLead(req.user, req.params.id);
  res.json({ message: 'Lead deleted' });
};
