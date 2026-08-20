const express = require('express');
const router = express.Router();
const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  startExam,
  submitExam,
  getExamLeaderboard,
} = require('../controllers/examController');
const { protect } = require('../middleware/auth');
const { requireFacultyOrAdmin, requireStudent } = require('../middleware/role');

// Public/Authenticated exams list & details
router.route('/')
  .get(protect, getExams)
  .post(protect, requireFacultyOrAdmin, createExam);

router.route('/:id')
  .get(protect, getExamById)
  .put(protect, requireFacultyOrAdmin, updateExam)
  .delete(protect, requireFacultyOrAdmin, deleteExam);

// Exam taking & submission
router.post('/:id/start', protect, startExam);
router.post('/:id/submit', protect, submitExam);
router.get('/:id/leaderboard', protect, getExamLeaderboard);

module.exports = router;
