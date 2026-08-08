const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const { listMentors, requestMentorReview } = require('../controllers/mentorController');

const router = express.Router();
router.get('/', protect, asyncHandler(listMentors));
router.post('/:id/request', protect, asyncHandler(requestMentorReview));
module.exports = router;
