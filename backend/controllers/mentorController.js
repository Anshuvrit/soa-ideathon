const Mentor = require('../models/Mentor');
const MentorRequest = require('../models/MentorRequest');
const { sanitizeText } = require('../utils/sanitize');
const { sendEmail } = require('../utils/email');

async function listMentors(req, res) {
  const mentors = await Mentor.find().sort({ name: 1 });
  res.json({ mentors });
}

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

  if (mentor.email) {
    await sendEmail({
      to: mentor.email,
      subject: `New mentor review request from ${user.name}`,
      html: `<div style="font-family:sans-serif">
        <h2>New review request</h2>
        <p><b>${user.name}</b> (${user.email}) from <b>${user.college}</b> requested your feedback.</p>
        <p><b>Message:</b> ${message || '(no message)'}</p>
      </div>`,
    });
  }

  res.status(201).json({ request });
}

module.exports = { listMentors, requestMentorReview };