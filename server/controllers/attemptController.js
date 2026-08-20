const ExamAttempt = require('../models/ExamAttempt');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// @desc    Get all exam attempts (For Admin/Faculty)
// @route   GET /api/attempts
// @access  Private/FacultyOrAdmin
const getAttempts = async (req, res, next) => {
  try {
    const { examId, studentId, status, page = 1, limit = 15 } = req.query;
    const query = {};

    if (examId) query.exam = examId;
    if (studentId) query.student = studentId;
    if (status) query.status = status;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await ExamAttempt.countDocuments(query);
    const attempts = await ExamAttempt.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('student', 'name email college studentId course year')
      .populate('exam', 'title duration totalMarks passingMarks');

    res.status(200).json({
      success: true,
      count: attempts.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single attempt details & Question-by-Question Review
// @route   GET /api/attempts/:id
// @access  Authenticated
const getAttemptById = async (req, res, next) => {
  try {
    const attempt = await ExamAttempt.findById(req.params.id)
      .populate('student', 'name email college studentId course year')
      .populate('exam', 'title description duration totalMarks passingMarks passingPercentage negativeMarking negativeMarkValue');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Exam attempt not found' });
    }

    // Check permissions: Only student who took it, or faculty/admin
    const isOwner = attempt.student._id.toString() === req.user.id;
    const isStaff = req.user.role === 'admin' || req.user.role === 'faculty';

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this attempt result.',
      });
    }

    // If evaluated or submitted, populate questions with correct answers & explanations for review!
    let detailedReview = [];
    if (attempt.status === 'evaluated' || attempt.status === 'submitted' || attempt.status === 'timed_out') {
      const qIds = attempt.answers.map((a) => a.question);
      const questionsList = await Question.find({ _id: { $in: qIds } });
      const qMap = {};
      questionsList.forEach((q) => {
        qMap[q._id.toString()] = q;
      });

      detailedReview = attempt.answers.map((ans, idx) => {
        const questionDoc = qMap[ans.question.toString()];
        return {
          index: idx + 1,
          questionId: ans.question,
          questionText: questionDoc ? questionDoc.questionText : 'Question details unavailable',
          codeSnippet: questionDoc ? questionDoc.codeSnippet : '',
          codeLanguage: questionDoc ? questionDoc.codeLanguage : 'cpp',
          questionType: questionDoc ? questionDoc.questionType : 'mcq',
          topicName: questionDoc ? questionDoc.topicName : 'General DSA',
          difficulty: questionDoc ? questionDoc.difficulty : 'medium',
          options: questionDoc ? questionDoc.options : [],
          selectedAnswer: ans.selectedAnswer,
          correctAnswer: questionDoc ? questionDoc.correctAnswer : null,
          explanation: questionDoc ? questionDoc.explanation : '',
          isCorrect: ans.isCorrect,
          marksAwarded: ans.marksAwarded,
          maxMarks: questionDoc ? questionDoc.marks : 1,
          status: ans.status,
          timeSpentSeconds: ans.timeSpentSeconds || 0,
        };
      });
    }

    res.status(200).json({
      success: true,
      attempt,
      review: detailedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's own attempts
// @route   GET /api/attempts/my-attempts
// @access  Private/Student
const getStudentAttempts = async (req, res, next) => {
  try {
    const attempts = await ExamAttempt.find({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate('exam', 'title duration totalMarks passingMarks difficultyLevel');

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save In-Progress Exam State (Auto-save / Next Question)
// @route   POST /api/attempts/:id/progress
// @access  Private/Student
const saveProgress = async (req, res, next) => {
  try {
    const { answers, antiCheatingLogs } = req.body;
    const attempt = await ExamAttempt.findOne({
      _id: req.params.id,
      student: req.user.id,
      status: 'in_progress',
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Active exam attempt not found.' });
    }

    if (answers && Array.isArray(answers)) {
      const ansMap = {};
      answers.forEach((ans) => {
        const qId = ans.question ? (ans.question._id || ans.question).toString() : ans.questionId;
        if (qId) ansMap[qId] = ans;
      });

      attempt.answers = attempt.answers.map((curr) => {
        const qIdStr = curr.question.toString();
        if (ansMap[qIdStr]) {
          return {
            question: curr.question,
            selectedAnswer: ansMap[qIdStr].selectedAnswer,
            status: ansMap[qIdStr].status || curr.status,
            timeSpentSeconds: ansMap[qIdStr].timeSpentSeconds || curr.timeSpentSeconds,
          };
        }
        return curr;
      });
    }

    if (antiCheatingLogs) {
      attempt.antiCheatingLogs = {
        tabSwitchCount: antiCheatingLogs.tabSwitchCount || attempt.antiCheatingLogs.tabSwitchCount || 0,
        fullscreenExitCount: antiCheatingLogs.fullscreenExitCount || attempt.antiCheatingLogs.fullscreenExitCount || 0,
        copyAttemptCount: antiCheatingLogs.copyAttemptCount || attempt.antiCheatingLogs.copyAttemptCount || 0,
        pasteAttemptCount: antiCheatingLogs.pasteAttemptCount || attempt.antiCheatingLogs.pasteAttemptCount || 0,
        rightClickCount: antiCheatingLogs.rightClickCount || attempt.antiCheatingLogs.rightClickCount || 0,
        events: antiCheatingLogs.events || attempt.antiCheatingLogs.events || [],
      };
    }

    await attempt.save();

    res.status(200).json({
      success: true,
      message: 'Progress saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log Anti-Cheating Event
// @route   POST /api/attempts/:id/cheating-event
// @access  Private/Student
const logCheatingEvent = async (req, res, next) => {
  try {
    const { eventType, details } = req.body;
    const attempt = await ExamAttempt.findOne({
      _id: req.params.id,
      student: req.user.id,
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    if (!attempt.antiCheatingLogs) {
      attempt.antiCheatingLogs = {
        tabSwitchCount: 0,
        fullscreenExitCount: 0,
        copyAttemptCount: 0,
        pasteAttemptCount: 0,
        rightClickCount: 0,
        events: [],
      };
    }

    if (eventType === 'tab_switch') attempt.antiCheatingLogs.tabSwitchCount++;
    if (eventType === 'fullscreen_exit') attempt.antiCheatingLogs.fullscreenExitCount++;
    if (eventType === 'copy_attempt') attempt.antiCheatingLogs.copyAttemptCount++;
    if (eventType === 'paste_attempt') attempt.antiCheatingLogs.pasteAttemptCount++;
    if (eventType === 'right_click') attempt.antiCheatingLogs.rightClickCount++;

    attempt.antiCheatingLogs.events.push({
      eventType,
      details: details || '',
      timestamp: new Date(),
    });

    await attempt.save();

    res.status(200).json({
      success: true,
      message: 'Event logged',
      counts: {
        tabSwitches: attempt.antiCheatingLogs.tabSwitchCount,
        fullscreenExits: attempt.antiCheatingLogs.fullscreenExitCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttempts,
  getAttemptById,
  getStudentAttempts,
  saveProgress,
  logCheatingEvent,
};
