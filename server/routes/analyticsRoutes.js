const express = require('express');
const router = express.Router();
const {
  getStudentAnalytics,
  getExamAnalytics,
  getAdminAnalytics,
  getLeaderboard,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { requireAdmin, requireFacultyOrAdmin } = require('../middleware/role');

// Leaderboard can be accessed with protect
router.get('/leaderboard', protect, getLeaderboard);

// Student analytics
router.get('/student/:id?', protect, getStudentAnalytics);

// Exam analytics
router.get('/exam/:id', protect, requireFacultyOrAdmin, getExamAnalytics);

// Admin system analytics
router.get('/admin', protect, requireAdmin, getAdminAnalytics);

module.exports = router;
