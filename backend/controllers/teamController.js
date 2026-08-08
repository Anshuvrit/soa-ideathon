const Team = require('../models/Team');
const User = require('../models/User');
const JoinRequest = require('../models/JoinRequest');
const AuditLog = require('../models/AuditLog');
const { sanitizeText } = require('../utils/sanitize');
const { THEMES } = require('../utils/constants');
const { canJoinTeam, canSubmitTeam, MAX_TEAM_SIZE } = require('../utils/validation');

// GET /api/teams
async function listTeams(req, res) {
  const user = req.user;
  const { skill, theme, status, sameCollege, q } = req.query;

  const filter = {};
  if (skill) filter.requiredSkills = skill;
  if (theme) filter.themes = theme;
  if (status) filter.status = status;
  else filter.status = { $in: ['open', 'full'] };
  if (sameCollege === 'true') filter.college = user.college;
  if (q) filter.name = { $regex: sanitizeText(q, 60), $options: 'i' };

  const teams = await Team.find(filter)
    .populate('leaderId', 'name')
    .populate('members', 'name')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json({ teams });
}

// POST /api/teams
async function createTeam(req, res) {
  const user = req.user;
  const body = req.body;

  if (!user.profileComplete) {
    return res.status(400).json({ error: 'Please complete your profile before creating a team.' });
  }
  if (user.teamId) {
    return res.status(400).json({ error: 'You are already in a team. Leave your current team first.' });
  }

  const name = sanitizeText(body.name, 80);
  const shortDesc = sanitizeText(body.shortDesc, 240);
  const requiredSkills = Array.isArray(body.requiredSkills)
    ? body.requiredSkills.map((s) => sanitizeText(s, 30)).filter(Boolean).slice(0, 15)
    : [];
  const themes = Array.isArray(body.themes) ? body.themes.filter((t) => THEMES.includes(t)).slice(0, 5) : [];

  if (!name) return res.status(400).json({ error: 'Team name is required.' });

  const team = await Team.create({
    name,
    leaderId: user._id,
    college: user.college,
    members: [user._id],
    requiredSkills,
    themes,
    shortDesc,
    status: 'open',
  });

  user.teamId = team._id;
  user.status = 'has-team';
  await user.save();

  res.status(201).json({ team });
}

// GET /api/teams/:id
async function getTeam(req, res) {
  const team = await Team.findById(req.params.id)
    .populate('leaderId', 'name email')
    .populate('members', 'name skills year branch socials isFemale')
    .populate({ path: 'pendingRequests', populate: { path: 'fromUser', select: 'name skills year branch' } });
  if (!team) return res.status(404).json({ error: 'Team not found.' });
  res.json({ team });
}

// PUT /api/teams/:id
async function updateTeam(req, res) {
  const user = req.user;
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found.' });
  if (String(team.leaderId) !== String(user._id)) {
    return res.status(403).json({ error: 'Only the team leader can edit this team.' });
  }
  if (team.isLocked) return res.status(400).json({ error: 'Team is locked and cannot be edited.' });

  const body = req.body;
  if (body.name !== undefined) team.name = sanitizeText(body.name, 80);
  if (body.shortDesc !== undefined) team.shortDesc = sanitizeText(body.shortDesc, 240);
  if (body.ideaBrief !== undefined) team.ideaBrief = sanitizeText(body.ideaBrief, 4000);
  if (Array.isArray(body.requiredSkills)) {
    team.requiredSkills = body.requiredSkills.map((s) => sanitizeText(s, 30)).filter(Boolean).slice(0, 15);
  }
  if (Array.isArray(body.themes)) {
    team.themes = body.themes.filter((t) => THEMES.includes(t)).slice(0, 5);
  }
  if (Array.isArray(body.tasks)) {
    team.tasks = body.tasks.map((t) => ({
      title: sanitizeText(t.title, 140),
      owner: t.owner || null,
      status: ['todo', 'in-progress', 'done'].includes(t.status) ? t.status : 'todo',
      dueDate: t.dueDate ? new Date(t.dueDate) : null,
    }));
  }

  await team.save();
  res.json({ team });
}

// POST /api/teams/:id/request
async function requestJoin(req, res) {
  const user = req.user;
  if (!user.profileComplete) {
    return res.status(400).json({ error: 'Please complete your profile before requesting to join a team.' });
  }

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found.' });

  const existingPendingRequest = await JoinRequest.findOne({
    fromUser: user._id,
    toTeam: team._id,
    status: 'pending',
  });

  const check = canJoinTeam({ student: user, team, existingPendingRequest });
  if (!check.ok) return res.status(400).json({ error: check.message });

  const message = sanitizeText(req.body?.message, 500);
  const request = await JoinRequest.create({ fromUser: user._id, toTeam: team._id, message, status: 'pending' });

  team.pendingRequests.push(request._id);
  await team.save();

  res.status(201).json({ request });
}

// PUT /api/teams/:id/request/:rid
async function respondToRequest(req, res) {
  const user = req.user;
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found.' });
  if (String(team.leaderId) !== String(user._id)) {
    return res.status(403).json({ error: 'Only the team leader can respond to requests.' });
  }

  const request = await JoinRequest.findById(req.params.rid);
  if (!request || String(request.toTeam) !== String(team._id)) {
    return res.status(404).json({ error: 'Join request not found.' });
  }
  if (request.status !== 'pending') {
    return res.status(400).json({ error: 'This request has already been handled.' });
  }

  const action = req.body.action;
  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action.' });
  }

  if (action === 'reject') {
    request.status = 'rejected';
    await request.save();
    team.pendingRequests = team.pendingRequests.filter((id) => String(id) !== String(request._id));
    await team.save();
    return res.json({ request });
  }

  const applicant = await User.findById(request.fromUser);
  if (!applicant) return res.status(404).json({ error: 'Applicant no longer exists.' });

  const check = canJoinTeam({ student: applicant, team, existingPendingRequest: null });
  if (!check.ok) return res.status(400).json({ error: check.message });

  request.status = 'accepted';
  await request.save();

  team.members.push(applicant._id);
  team.pendingRequests = team.pendingRequests.filter((id) => String(id) !== String(request._id));
  if (team.members.length >= MAX_TEAM_SIZE) team.status = 'full';
  await team.save();

  applicant.teamId = team._id;
  applicant.status = team.members.length >= MAX_TEAM_SIZE ? 'full' : 'has-team';
  await applicant.save();

  await JoinRequest.updateMany(
    { fromUser: applicant._id, status: 'pending', _id: { $ne: request._id } },
    { $set: { status: 'rejected' } }
  );

  res.json({ request, team });
}

// POST /api/teams/:id/submit
async function submitTeam(req, res) {
  const user = req.user;
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found.' });
  if (String(team.leaderId) !== String(user._id)) {
    return res.status(403).json({ error: 'Only the team leader can submit the team.' });
  }

  const members = await User.find({ _id: { $in: team.members } });
  const check = canSubmitTeam({ team, members });
  if (!check.ok) return res.status(400).json({ error: check.message });

  team.status = 'submitted';
  team.isLocked = true;
  team.submittedAt = new Date();
  await team.save();

  await AuditLog.create({
    action: 'team.submit',
    performedBy: user._id,
    targetId: team._id,
    targetType: 'Team',
    meta: { teamName: team.name, memberCount: team.members.length },
  });

  res.json({ team });
}

// POST /api/teams/:id/leave
async function leaveTeam(req, res) {
  const user = req.user;
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found.' });
  if (team.isLocked) return res.status(400).json({ error: 'This team has been submitted and is locked.' });
  if (String(team.leaderId) === String(user._id)) {
    return res.status(400).json({ error: 'Team leader cannot leave. Transfer leadership or delete the team from support.' });
  }

  team.members = team.members.filter((id) => String(id) !== String(user._id));
  team.status = team.members.length >= MAX_TEAM_SIZE ? 'full' : 'open';
  await team.save();

  user.teamId = null;
  user.status = 'looking';
  await user.save();

  res.json({ ok: true });
}

// DELETE /api/teams/:id/members/:uid
async function removeMember(req, res) {
  const user = req.user;
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found.' });
  if (String(team.leaderId) !== String(user._id)) {
    return res.status(403).json({ error: 'Only the team leader can remove members.' });
  }
  if (team.isLocked) return res.status(400).json({ error: 'This team has been submitted and is locked.' });
  if (String(req.params.uid) === String(team.leaderId)) {
    return res.status(400).json({ error: 'Team leader cannot remove themselves.' });
  }

  team.members = team.members.filter((id) => String(id) !== String(req.params.uid));
  team.status = team.members.length >= MAX_TEAM_SIZE ? 'full' : 'open';
  await team.save();

  const member = await User.findById(req.params.uid);
  if (member) {
    member.teamId = null;
    member.status = 'looking';
    await member.save();
  }

  res.json({ ok: true });
}

module.exports = {
  listTeams,
  createTeam,
  getTeam,
  updateTeam,
  requestJoin,
  respondToRequest,
  submitTeam,
  leaveTeam,
  removeMember,
};
