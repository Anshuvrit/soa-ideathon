const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { protect } = require('../middleware/auth');
const {
  listTeams,
  createTeam,
  getTeam,
  updateTeam,
  requestJoin,
  respondToRequest,
  submitTeam,
  leaveTeam,
  removeMember,
} = require('../controllers/teamController');

const router = express.Router();

router.get('/', protect, asyncHandler(listTeams));
router.post('/', protect, asyncHandler(createTeam));
router.get('/:id', protect, asyncHandler(getTeam));
router.put('/:id', protect, asyncHandler(updateTeam));
router.post('/:id/request', protect, asyncHandler(requestJoin));
router.put('/:id/request/:rid', protect, asyncHandler(respondToRequest));
router.post('/:id/submit', protect, asyncHandler(submitTeam));
router.post('/:id/leave', protect, asyncHandler(leaveTeam));
router.delete('/:id/members/:uid', protect, asyncHandler(removeMember));

module.exports = router;
