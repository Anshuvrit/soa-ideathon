const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const { getContent } = require('../controllers/contentController');

const router = express.Router();
router.get('/', protect, asyncHandler(getContent));
module.exports = router;
