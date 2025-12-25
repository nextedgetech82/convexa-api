const service = require('./auth.service');

exports.register = async (req, res) => {
  try {
    const token = await service.register(req.body);
    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const data = await service.login({ email, password });
    res.json(data);
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};
