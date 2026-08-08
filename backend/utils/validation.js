// Centralized server-side validation for team join / submission rules.
// Every mutation route must run these checks -- never trust the client.

const MAX_TEAM_SIZE = 6;

function canJoinTeam({ student, team, existingPendingRequest }) {
  if (student.teamId) {
    return { ok: false, message: 'You are already in a team. Leave your current team first.' };
  }
  if (team.members.length >= MAX_TEAM_SIZE) {
    return { ok: false, message: 'This team is full.' };
  }
  if (team.isLocked || team.status === 'submitted') {
    return { ok: false, message: 'This team has been submitted and is no longer accepting members.' };
  }
  if (student.college?.trim().toLowerCase() !== team.college?.trim().toLowerCase()) {
    return { ok: false, message: 'You must be from the same college to join this team.' };
  }
  if (existingPendingRequest) {
    return { ok: false, message: 'You already have a pending request for this team.' };
  }
  return { ok: true };
}

function canSubmitTeam({ team, members }) {
  if (['submitted', 'shortlisted', 'waitlisted'].includes(team.status)) {
    return { ok: false, message: 'Team is already submitted.' };
  }
  if (members.length !== MAX_TEAM_SIZE) {
    return { ok: false, message: 'Team must have exactly 6 members before submitting.' };
  }
  if (!members.some((m) => m.isFemale === true)) {
    return { ok: false, message: 'At least one female member is required.' };
  }
  if (!team.ideaBrief || team.ideaBrief.trim().length === 0) {
    return { ok: false, message: 'Please add an idea brief before submitting.' };
  }
  return { ok: true };
}

function isEmailValid(email) {
  return /^\S+@\S+\.\S+$/.test(String(email || '').trim());
}

function complianceStatus(team, members) {
  const sizeOk = team.members.length === MAX_TEAM_SIZE;
  const femaleOk = members.some((m) => m.isFemale === true);
  const collegeOk = members.every(
    (m) => m.college?.trim().toLowerCase() === team.college?.trim().toLowerCase()
  );
  return { sizeOk, femaleOk, collegeOk, allOk: sizeOk && femaleOk && collegeOk };
}

module.exports = { MAX_TEAM_SIZE, canJoinTeam, canSubmitTeam, isEmailValid, complianceStatus };
