const mongoose = require('mongoose');

const SocialsSchema = new mongoose.Schema(
  {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    emailVerified: { type: Date, default: null },
    college: { type: String, default: '', trim: true, maxlength: 120 },
    year: { type: Number, min: 1, max: 4 },
    branch: { type: String, trim: true, maxlength: 80 },
    skills: [{ type: String, trim: true, maxlength: 30 }],
    themes: [{ type: String, trim: true, maxlength: 60 }],
    status: { type: String, enum: ['looking', 'has-team', 'full'], default: 'looking' },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    // Private field, never exposed on public profile endpoints
    isFemale: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    contactPreference: { type: String, enum: ['in-app', 'whatsapp', 'email'], default: 'in-app' },
    socials: { type: SocialsSchema, default: () => ({}) },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index({ skills: 1 });
UserSchema.index({ college: 1 });
UserSchema.index({ status: 1 });

// Strip private fields for public consumption
UserSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    college: this.college,
    year: this.year,
    branch: this.branch,
    skills: this.skills,
    themes: this.themes,
    status: this.status,
    socials: this.socials,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
