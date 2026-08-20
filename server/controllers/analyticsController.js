const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const ExamAttempt = require('../models/ExamAttempt');
const { getStudentDetailedAnalytics } = require('../services/analyticsService');

// @desc    Get student analytics
// @route   GET /api/analytics/student/:id
// @access  Authenticated
const getStudentAnalytics = async (req, res, next) => {
  try {
    const studentId = req.params.id || req.user.id;

    // Permissions
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view analytics of other students.' });
    }

    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const detailed = await getStudentDetailedAnalytics(studentId);

    res.status(200).json({
      success: true,
      stats: user.stats,
      streakCount: user.streakCount,
      badges: user.badges,
      analytics: detailed,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get exam analytics
// @route   GET /api/analytics/exam/:id
// @access  Private/FacultyOrAdmin
const getExamAnalytics = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const attempts = await ExamAttempt.find({
      exam: exam._id,
      status: 'evaluated',
    }).populate('student', 'name email college');

    const totalAttempts = attempts.length;
    let totalScore = 0;
    let passedCount = 0;
    let perfectScoreCount = 0;

    const scoreDistribution = [
      { range: '90-100% (A+)', count: 0 },
      { range: '80-89% (A)', count: 0 },
      { range: '70-79% (B+)', count: 0 },
      { range: '60-69% (B)', count: 0 },
      { range: '50-59% (C)', count: 0 },
      { range: '40-49% (D)', count: 0 },
      { range: '< 40% (F)', count: 0 },
    ];

    let totalAntiCheatingIncidents = 0;

    attempts.forEach((att) => {
      totalScore += att.percentage || 0;
      if (att.isPassed) passedCount++;
      if (att.percentage === 100) perfectScoreCount++;

      const p = att.percentage || 0;
      if (p >= 90) scoreDistribution[0].count++;
      else if (p >= 80) scoreDistribution[1].count++;
      else if (p >= 70) scoreDistribution[2].count++;
      else if (p >= 60) scoreDistribution[3].count++;
      else if (p >= 50) scoreDistribution[4].count++;
      else if (p >= 40) scoreDistribution[5].count++;
      else scoreDistribution[6].count++;

      const logs = att.antiCheatingLogs || {};
      totalAntiCheatingIncidents +=
        (logs.tabSwitchCount || 0) +
        (logs.fullscreenExitCount || 0) +
        (logs.copyAttemptCount || 0);
    });

    const averagePercentage = totalAttempts > 0 ? parseFloat((totalScore / totalAttempts).toFixed(2)) : 0;
    const passRate = totalAttempts > 0 ? parseFloat(((passedCount / totalAttempts) * 100).toFixed(1)) : 0;

    res.status(200).json({
      success: true,
      examTitle: exam.title,
      totalAttempts,
      averagePercentage,
      passRate,
      perfectScoreCount,
      totalAntiCheatingIncidents,
      scoreDistribution,
      recentAttempts: attempts.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin high-level analytics
// @route   GET /api/analytics/admin
// @access  Private/Admin
const getAdminAnalytics = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalExams,
      totalQuestions,
      activeExams,
      allAttempts,
      recentUsers,
      recentAttempts,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'faculty' }),
      Exam.countDocuments(),
      Question.countDocuments(),
      Exam.countDocuments({ status: 'live' }),
      ExamAttempt.find({ status: 'evaluated' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
      ExamAttempt.find({ status: 'evaluated' })
        .sort({ submittedAt: -1 })
        .limit(6)
        .populate('student', 'name email college')
        .populate('exam', 'title duration totalMarks'),
    ]);

    const totalEvaluated = allAttempts.length;
    let sumScore = 0;
    allAttempts.forEach((att) => {
      sumScore += att.percentage || 0;
    });
    const systemAverageScore = totalEvaluated > 0 ? parseFloat((sumScore / totalEvaluated).toFixed(2)) : 0;

    // Aggregate topic performance
    const topicStats = {};
    allAttempts.forEach((att) => {
      (att.topicBreakdown || []).forEach((t) => {
        if (!topicStats[t.topicName]) {
          topicStats[t.topicName] = { total: 0, correct: 0 };
        }
        topicStats[t.topicName].total += t.total || 0;
        topicStats[t.topicName].correct += t.correct || 0;
      });
    });

    const topicPerformance = Object.keys(topicStats).map((name) => {
      const item = topicStats[name];
      return {
        topic: name,
        total: item.total,
        accuracy: item.total > 0 ? parseFloat(((item.correct / item.total) * 100).toFixed(1)) : 0,
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        totalExams,
        totalQuestions,
        activeExams,
        totalEvaluated,
        systemAverageScore,
      },
      topicPerformance,
      recentUsers,
      recentAttempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Global & Filtered Leaderboards
// @route   GET /api/analytics/leaderboard
// @access  Public / Authenticated
const getLeaderboard = async (req, res, next) => {
  try {
    const { timeframe = 'global', course } = req.query;

    const query = { role: 'student', isActive: true };
    if (course && course !== 'All') {
      query.course = course;
    }

    let dateFilter = null;
    if (timeframe === 'weekly') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (timeframe === 'monthly') {
      dateFilter = new Date();
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    let students;
    if (dateFilter) {
      // Find top students from recent attempts
      const recentAttempts = await ExamAttempt.aggregate([
        { $match: { submittedAt: { $gte: dateFilter }, status: 'evaluated' } },
        {
          $group: {
            _id: '$student',
            totalScore: { $sum: '$obtainedMarks' },
            attemptsCount: { $sum: 1 },
            avgAccuracy: { $avg: '$accuracy' },
          },
        },
        { $sort: { totalScore: -1 } },
        { $limit: 50 },
      ]);

      const studentIds = recentAttempts.map((r) => r._id);
      const studentDocs = await User.find({ _id: { $in: studentIds }, ...query }).select('-password');
      const studentMap = {};
      studentDocs.forEach((s) => (studentMap[s._id.toString()] = s));

      students = recentAttempts
        .filter((r) => studentMap[r._id.toString()])
        .map((r, idx) => {
          const user = studentMap[r._id.toString()];
          return {
            rank: idx + 1,
            id: user._id,
            name: user.name,
            college: user.college,
            course: user.course,
            year: user.year,
            avatar: user.avatar,
            score: parseFloat(r.totalScore.toFixed(1)),
            accuracy: parseFloat(r.avgAccuracy.toFixed(1)),
            examsAttempted: r.attemptsCount,
            badgesCount: (user.badges || []).length,
          };
        });
    } else {
      // Global All-Time Leaderboard
      const users = await User.find(query)
        .sort({ 'stats.totalScore': -1, 'stats.accuracy': -1 })
        .limit(50)
        .select('-password');

      students = users.map((u, idx) => ({
        rank: idx + 1,
        id: u._id,
        name: u.name,
        college: u.college,
        course: u.course,
        year: u.year,
        avatar: u.avatar,
        score: u.stats ? u.stats.totalScore : 0,
        accuracy: u.stats ? u.stats.accuracy : 0,
        averageScore: u.stats ? u.stats.averageScore : 0,
        examsAttempted: u.stats ? u.stats.examsAttempted : 0,
        badgesCount: (u.badges || []).length,
      }));
    }

    res.status(200).json({
      success: true,
      timeframe,
      count: students.length,
      leaderboard: students,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentAnalytics,
  getExamAnalytics,
  getAdminAnalytics,
  getLeaderboard,
};
