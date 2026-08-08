const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/profileController');

const router = express.Router();

router.get('/', protect, asyncHandler(getProfile));
router.put('/', protect, asyncHandler(updateProfile));

module.exports = router;
