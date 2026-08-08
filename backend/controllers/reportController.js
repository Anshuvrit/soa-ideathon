const Report = require('../models/Report');
const User = require('../models/User');
const { sanitizeText } = require('../utils/sanitize');

// POST /api/report
async function createReport(req, res) {
  const user = req.user;
  const reportedUser = await User.findById(req.body.userId);
  if (!reportedUser) return res.status(404).json({ error: 'User not found.' });

  const reason = sanitizeText(req.body.reason, 500);
  if (!reason) return res.status(400).json({ error: 'Please describe the issue.' });

  const report = await Report.create({ reporter: user._id, reportedUser: reportedUser._id, reason });
  res.status(201).json({ report });
}

module.exports = { createReport };
