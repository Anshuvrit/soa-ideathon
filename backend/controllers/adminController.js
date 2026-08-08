const User = require('../models/User');
const Team = require('../models/Team');
const Announcement = require('../models/Announcement');
const SiteContent = require('../models/SiteContent');
const AuditLog = require('../models/AuditLog');
const { sanitizeText } = require('../utils/sanitize');
const { complianceStatus } = require('../utils/validation');

// GET /api/admin/stats
async function getStats(req, res) {
  const [totalUsers, totalTeams, submitted, shortlisted, waitlisted, rejected, openTeams] = await Promise.all([
    User.countDocuments(),
    Team.countDocuments(),
    Team.countDocuments({ status: 'submitted' }),
    Team.countDocuments({ status: 'shortlisted' }),
    Team.countDocuments({ status: 'waitlisted' }),
    Team.countDocuments({ status: 'rejected' }),
    Team.countDocuments({ status: { $in: ['open', 'full'] } }),
  ]);
  res.json({ totalUsers, totalTeams, submitted, shortlisted, waitlisted, rejected, openTeams });
}

// GET /api/admin/users
async function listUsers(req, res) {
  const { q } = req.query;
  const filter = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { college: { $regex: q, $options: 'i' } },
    ];
  }
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(300);
  res.json({ users });
}

// PUT /api/admin/users/:id
async function updateUser(req, res) {
  const admin = req.user;
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ error: 'User not found.' });

  const changes = {};
  if (typeof req.body.isVerified === 'boolean') {
    target.isVerified = req.body.isVerified;
    changes.isVerified = req.body.isVerified;
  }
  if (typeof req.body.isSuspended === 'boolean') {
    target.isSuspended = req.body.isSuspended;
    changes.isSuspended = req.body.isSuspended;
  }
  await target.save();

  await AuditLog.create({
    action: 'admin.user.update',
    performedBy: admin._id,
    targetId: target._id,
    targetType: 'User',
    meta: changes,
  });

  res.json({ user: target });
}

// GET /api/admin/teams
async function listTeamsAdmin(req, res) {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const teams = await Team.find(filter)
    .populate('leaderId', 'name email')
    .populate('members', 'name email isFemale college')
    .sort({ createdAt: -1 })
    .limit(300);

  const withCompliance = teams.map((t) => ({
    ...t.toObject(),
    compliance: complianceStatus(t, t.members),
  }));

  res.json({ teams: withCompliance });
}

// PUT /api/admin/teams/:id/status
const ALLOWED_STATUSES = ['shortlisted', 'waitlisted', 'rejected', 'submitted', 'open'];
async function setTeamStatus(req, res) {
  const admin = req.user;
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  if (!ALLOWED_STATUSES.includes(req.body.status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  team.status = req.body.status;
  if (req.body.status === 'open') team.isLocked = false;
  await team.save();

  await AuditLog.create({
    action: 'admin.team.status',
    performedBy: admin._id,
    targetId: team._id,
    targetType: 'Team',
    meta: { status: req.body.status },
  });

  res.json({ team });
}

// POST /api/admin/announcements
async function createAnnouncement(req, res) {
  const admin = req.user;
  const title = sanitizeText(req.body.title, 140);
  const body = sanitizeText(req.body.body, 4000);
  if (!title || !body) return res.status(400).json({ error: 'Title and body are required.' });

  const announcement = await Announcement.create({
    title,
    body,
    isOfficial: req.body.isOfficial !== false,
    postedBy: admin._id,
  });

  await AuditLog.create({
    action: 'admin.announcement.create',
    performedBy: admin._id,
    targetId: announcement._id,
    targetType: 'Announcement',
    meta: { title },
  });

  res.status(201).json({ announcement });
}

// PUT /api/admin/content
async function updateContent(req, res) {
  const admin = req.user;
  const body = req.body;

  let content = await SiteContent.findOne({ key: 'main' });
  if (!content) content = new SiteContent({ key: 'main' });

  if (body.eventName !== undefined) content.eventName = sanitizeText(body.eventName, 140);
  if (body.eventDate !== undefined) content.eventDate = new Date(body.eventDate);
  if (body.rulesMarkdown !== undefined) content.rulesMarkdown = sanitizeText(body.rulesMarkdown, 8000);
  if (Array.isArray(body.themes)) content.themes = body.themes.map((t) => sanitizeText(t, 60));
  if (Array.isArray(body.resources)) {
    content.resources = body.resources.map((r) => ({
      title: sanitizeText(r.title, 140),
      description: sanitizeText(r.description, 300),
      link: sanitizeText(r.link, 300),
    }));
  }
  if (Array.isArray(body.checklist)) content.checklist = body.checklist.map((c) => sanitizeText(c, 200));

  await content.save();

  await AuditLog.create({
    action: 'admin.content.update',
    performedBy: admin._id,
    targetId: content._id,
    targetType: 'SiteContent',
    meta: {},
  });

  res.json({ content });
}

function csvEscape(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// GET /api/admin/export
async function exportCsv(req, res) {
  const admin = req.user;
  const teams = await Team.find().populate('leaderId', 'name email').populate('members', 'name email');

  const header = ['teamName', 'leader', 'members', 'college', 'status', 'submittedAt'];
  const rows = teams.map((t) => [
    t.name,
    `${t.leaderId?.name || ''} <${t.leaderId?.email || ''}>`,
    t.members.map((m) => `${m.name} <${m.email}>`).join('; '),
    t.college,
    t.status,
    t.submittedAt ? new Date(t.submittedAt).toISOString() : '',
  ]);

  const csv = [header, ...rows].map((r) => r.map(csvEscape).join(',')).join('\n');

  await AuditLog.create({
    action: 'admin.export.csv',
    performedBy: admin._id,
    targetType: 'Team',
    meta: { count: teams.length },
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="teams-export.csv"');
  res.send(csv);
}

module.exports = {
  getStats,
  listUsers,
  updateUser,
  listTeamsAdmin,
  setTeamStatus,
  createAnnouncement,
  updateContent,
  exportCsv,
};
