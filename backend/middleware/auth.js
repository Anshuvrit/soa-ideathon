const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

// Verifies the JWT from the Authorization header and attaches the full
// User document to req.user. Use `protect` on any route that requires sign-in.
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Not authenticated.' });

    const payload = verifyToken(token);
    const user = await User.findById(payload.uid);
    if (!user) return res.status(401).json({ error: 'Not authenticated.' });
    if (user.isSuspended) return res.status(403).json({ error: 'Account suspended.' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

// Use after `protect` on admin-only routes.
function adminOnly(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

module.exports = { protect, adminOnly };
