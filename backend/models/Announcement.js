const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 140 },
    body: { type: String, required: true, maxlength: 4000 },
    isOfficial: { type: Boolean, default: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
