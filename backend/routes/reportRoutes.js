const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const { createReport } = require('../controllers/reportController');

const router = express.Router();
router.post('/', protect, asyncHandler(createReport));
module.exports = router;
