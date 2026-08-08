const mongoose = require('mongoose');

const MentorRequestSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    message: { type: String, default: '', maxlength: 500 },
    status: { type: String, enum: ['pending', 'acknowledged'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.MentorRequest || mongoose.model('MentorRequest', MentorRequestSchema);
