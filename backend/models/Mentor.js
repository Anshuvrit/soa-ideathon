const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, default: '' },
    expertise: [{ type: String }],
    bio: { type: String, default: '' },
    contactLink: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Mentor || mongoose.model('Mentor', MentorSchema);
