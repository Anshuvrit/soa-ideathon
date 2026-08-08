const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const { getPublicUser } = require('../controllers/publicController');

const router = express.Router();

// Public profile view -- still requires sign-in (college-restricted platform),
// but never returns private fields (see User.toPublicJSON).
router.get('/users/:id', protect, asyncHandler(getPublicUser));

module.exports = router;
