const express = require('express');
const router = express.Router();
const {
  getAttempts,
  getAttemptById,
  getStudentAttempts,
  saveProgress,
  logCheatingEvent,
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');
const { requireFacultyOrAdmin } = require('../middleware/role');

router.use(protect);

router.get('/', requireFacultyOrAdmin, getAttempts);
router.get('/my-attempts', getStudentAttempts);
router.get('/:id', getAttemptById);
router.post('/:id/progress', saveProgress);
router.post('/:id/cheating-event', logCheatingEvent);

module.exports = router;
