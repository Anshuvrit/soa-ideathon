const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const { listAnnouncements } = require('../controllers/announcementController');

const router = express.Router();
router.get('/', protect, asyncHandler(listAnnouncements));
module.exports = router;
