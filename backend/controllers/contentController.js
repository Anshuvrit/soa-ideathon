const SiteContent = require('../models/SiteContent');

// GET /api/content
async function getContent(req, res) {
  let content = await SiteContent.findOne({ key: 'main' });
  if (!content) content = await SiteContent.create({ key: 'main' });
  res.json({ content });
}

module.exports = { getContent };
