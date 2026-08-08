const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getStats,
  listUsers,
  updateUser,
  listTeamsAdmin,
  setTeamStatus,
  createAnnouncement,
  updateContent,
  exportCsv,
} = require('../controllers/adminController');

const router = express.Router();
router.use(protect, adminOnly);

router.get('/stats', asyncHandler(getStats));
router.get('/users', asyncHandler(listUsers));
router.put('/users/:id', asyncHandler(updateUser));
router.get('/teams', asyncHandler(listTeamsAdmin));
router.put('/teams/:id/status', asyncHandler(setTeamStatus));
router.post('/announcements', asyncHandler(createAnnouncement));
router.put('/content', asyncHandler(updateContent));
router.get('/export', asyncHandler(exportCsv));

module.exports = router;
