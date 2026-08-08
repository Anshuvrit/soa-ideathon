const User = require('../models/User');

// GET /api/public/users/:id  (public read-only profile view)
async function getPublicUser(req, res) {
  const user = await User.findById(req.params.id).catch(() => null);
  if (!user) return res.status(404).json({ error: 'This profile could not be found.' });
  res.json({ user: user.toPublicJSON() });
}

module.exports = { getPublicUser };
