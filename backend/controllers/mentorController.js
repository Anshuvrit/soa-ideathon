const Mentor = require('../models/Mentor');
const MentorRequest = require('../models/MentorRequest');
const { sanitizeText } = require('../utils/sanitize');

// GET /api/mentors
async function listMentors(req, res) {
  const mentors = await Mentor.find().sort({ name: 1 });
  res.json({ mentors });
}

// POST /api/mentors/:id/request
async function requestMentorReview(req, res) {
  const user = req.user;
  const mentor = await Mentor.findById(req.params.id);
  if (!mentor) return res.status(404).json({ error: 'Mentor not found.' });

  const message = sanitizeText(req.body?.message, 500);
  const request = await MentorRequest.create({
    mentorId: mentor._id,
    userId: user._id,
    teamId: user.teamId || null,
    message,
  });

  res.status(201).json({ request });
}

module.exports = { listMentors, requestMentorReview };
