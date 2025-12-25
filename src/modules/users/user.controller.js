const service = require('./user.service');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, mobile } = req.body;

    if (!name || !email || !password || !role || !mobile) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const user = await service.createUser({
      orgId: req.user.orgId,
      name,
      email,
      password,
      role,
      mobile,
    });

    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
