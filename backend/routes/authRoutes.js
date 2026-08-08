const express = require('express');
const rateLimit = require('express-rate-limit');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const { sendOtp, verifyOtp, me } = require('../controllers/authController');

const router = express.Router();

// 3 OTP requests per 10 minutes per IP (paired with per-email checks in controller logic)
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many code requests. Please wait a few minutes and try again.' },
});

router.post('/send-otp', otpLimiter, asyncHandler(sendOtp));
router.post('/verify-otp', asyncHandler(verifyOtp));
router.get('/me', protect, asyncHandler(me));

module.exports = router;
