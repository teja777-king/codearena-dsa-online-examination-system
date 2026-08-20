const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getPracticeQuestions,
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');
const { requireFacultyOrAdmin } = require('../middleware/role');

// Practice questions route for students
router.get('/practice', protect, getPracticeQuestions);

// Question bank management (Admin & Faculty)
router.route('/')
  .get(protect, requireFacultyOrAdmin, getQuestions)
  .post(protect, requireFacultyOrAdmin, createQuestion);

router.route('/:id')
  .get(protect, requireFacultyOrAdmin, getQuestionById)
  .put(protect, requireFacultyOrAdmin, updateQuestion)
  .delete(protect, requireFacultyOrAdmin, deleteQuestion);

module.exports = router;
