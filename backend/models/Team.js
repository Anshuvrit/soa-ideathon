const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 140 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    dueDate: { type: Date, default: null },
  },
  { _id: true, timestamps: true }
);

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    college: { type: String, required: true, trim: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JoinRequest' }],
    requiredSkills: [{ type: String, trim: true, maxlength: 30 }],
    themes: [{ type: String, trim: true, maxlength: 60 }],
    shortDesc: { type: String, trim: true, maxlength: 240 },
    ideaBrief: { type: String, trim: true, maxlength: 4000, default: '' },
    tasks: [TaskSchema],
    status: {
      type: String,
      enum: ['open', 'full', 'submitted', 'shortlisted', 'waitlisted', 'rejected', 'pending'],
      default: 'open',
    },
    isLocked: { type: Boolean, default: false },
    submittedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

TeamSchema.index({ college: 1 });
TeamSchema.index({ status: 1 });
TeamSchema.index({ requiredSkills: 1 });
TeamSchema.index({ themes: 1 });

TeamSchema.virtual('seatsLeft').get(function () {
  return Math.max(0, 6 - this.members.length);
});

TeamSchema.set('toJSON', { virtuals: true });
TeamSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Team || mongoose.model('Team', TeamSchema);
