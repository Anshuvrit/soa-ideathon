const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OtpToken = require('../models/OtpToken');
const { sendOtpEmail } = require('../utils/email');
const { isEmailValid } = require('../utils/validation');
const { signToken } = require('../utils/jwt');

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// POST /api/auth/send-otp
async function sendOtp(req, res) {
  const email = String(req.body.email || '').toLowerCase().trim();

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const existing = await User.findOne({ email });
  if (existing?.isSuspended) {
    return res.status(403).json({ error: 'This account has been suspended.' });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 10);

  await OtpToken.deleteMany({ email });
  await OtpToken.create({
    email,
    codeHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(email, code);

  res.json({ ok: true });
}

// POST /api/auth/verify-otp
async function verifyOtp(req, res) {
  const email = String(req.body.email || '').toLowerCase().trim();
  const otp = String(req.body.otp || '').trim();
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required.' });

  const token = await OtpToken.findOne({ email }).sort({ _id: -1 });
  if (!token) return res.status(400).json({ error: 'No OTP found. Please request a new code.' });
  if (token.expiresAt < new Date()) {
    await OtpToken.deleteMany({ email });
    return res.status(400).json({ error: 'OTP expired. Please request a new code.' });
  }
  if (token.attempts >= 5) {
    await OtpToken.deleteMany({ email });
    return res.status(400).json({ error: 'Too many attempts. Please request a new code.' });
  }

  const valid = await bcrypt.compare(otp, token.codeHash);
  if (!valid) {
    token.attempts += 1;
    await token.save();
    return res.status(400).json({ error: 'Incorrect code.' });
  }

  await OtpToken.deleteMany({ email });

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: email.split('@')[0],
      email,
      college: '',
      emailVerified: new Date(),
      isAdmin: ADMIN_EMAILS.includes(email),
    });
  } else if (!user.emailVerified) {
    user.emailVerified = new Date();
    await user.save();
  }

  if (user.isSuspended) {
    return res.status(403).json({ error: 'Your account has been suspended. Contact an admin.' });
  }

  const jwtToken = signToken(user._id.toString());
  res.json({ token: jwtToken, user });
}

// GET /api/auth/me
async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { sendOtp, verifyOtp, me };
