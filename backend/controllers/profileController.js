const { sanitizeText } = require('../utils/sanitize');
const { THEMES } = require('../utils/constants');

// GET /api/profile
async function getProfile(req, res) {
  res.json({ user: req.user });
}

// PUT /api/profile
async function updateProfile(req, res) {
  const user = req.user;
  const body = req.body;

  const name = sanitizeText(body.name, 80);
  const college = sanitizeText(body.college, 120);
  const branch = sanitizeText(body.branch, 80);
  const year = Number(body.year);
  const skills = Array.isArray(body.skills)
    ? body.skills.map((s) => sanitizeText(s, 30)).filter(Boolean).slice(0, 15)
    : [];
  const themes = Array.isArray(body.themes) ? body.themes.filter((t) => THEMES.includes(t)).slice(0, 5) : [];
  const contactPreference = ['in-app', 'whatsapp', 'email'].includes(body.contactPreference)
    ? body.contactPreference
    : 'in-app';
  const isFemale = Boolean(body.isFemale);
  const socials = {
    github: sanitizeText(body?.socials?.github, 200),
    linkedin: sanitizeText(body?.socials?.linkedin, 200),
    portfolio: sanitizeText(body?.socials?.portfolio, 200),
  };

  if (!name || !college) {
    return res.status(400).json({ error: 'Name and college are required.' });
  }
  if (year && (year < 1 || year > 4)) {
    return res.status(400).json({ error: 'Year must be between 1 and 4.' });
  }

  user.name = name;
  user.college = college;
  user.branch = branch;
  user.year = year || undefined;
  user.skills = skills;
  user.themes = themes;
  user.contactPreference = contactPreference;
  user.isFemale = isFemale;
  user.socials = socials;
  user.profileComplete = true;

  await user.save();
  res.json({ user });
}

module.exports = { getProfile, updateProfile };
