const service = require('./master.service');

/* -------- PRODUCT GROUPS -------- */

exports.createProductGroup = async (req, res) => {
  const group = await service.createProductGroup(req.user, req.body);
  res.status(201).json(group);
};

exports.listProductGroups = async (req, res) => {
  const groups = await service.getProductGroups(req.user);
  res.json(groups);
};

exports.removeProductGroup = async (req, res) => {
  await service.deleteProductGroup(req.user, req.params.id);
  res.json({ message: 'Product group removed' });
};

/* -------- CUSTOMER GROUPS -------- */

exports.createCustomerGroup = async (req, res) => {
  const group = await service.createCustomerGroup(req.user, req.body);
  res.status(201).json(group);
};

exports.listCustomerGroups = async (req, res) => {
  const groups = await service.getCustomerGroups(req.user);
  res.json(groups);
};

exports.removeCustomerGroup = async (req, res) => {
  await service.deleteCustomerGroup(req.user, req.params.id);
  res.json({ message: 'Customer group removed' });
};
