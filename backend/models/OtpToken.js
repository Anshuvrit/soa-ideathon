const mongoose = require('mongoose');

// One-time-password tokens for passwordless email sign-in
const OtpTokenSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
});

// Auto-delete expired OTPs
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.OtpToken || mongoose.model('OtpToken', OtpTokenSchema);
