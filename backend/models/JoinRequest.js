const mongoose = require('mongoose');

const JoinRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    message: { type: String, trim: true, maxlength: 500, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

JoinRequestSchema.index({ toTeam: 1, status: 1 });

module.exports = mongoose.models.JoinRequest || mongoose.model('JoinRequest', JoinRequestSchema);
