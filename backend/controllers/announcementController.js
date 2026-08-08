const Announcement = require('../models/Announcement');

// GET /api/announcements
async function listAnnouncements(req, res) {
  const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(50);
  res.json({ announcements });
}

module.exports = { listAnnouncements };
