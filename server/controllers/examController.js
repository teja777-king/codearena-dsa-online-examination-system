const Exam = require('../models/Exam');
const Question = require('../models/Question');
const ExamAttempt = require('../models/ExamAttempt');
const { prepareExamSession } = require('../services/randomizationService');
const { evaluateAttempt } = require('../services/evaluationService');

// @desc    Get all exams (Filterable by status, role)
// @route   GET /api/exams
// @access  Public / Authenticated
const getExams = async (req, res, next) => {
  try {
    const query = {};

    // If user is a student, only show live, scheduled, or completed exams
    if (req.user && req.user.role === 'student') {
      query.status = { $in: ['live', 'scheduled', 'completed'] };
    }

    const exams = await Exam.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email role');

    // If student, attach attempt status
    let examsWithStudentData = exams;
    if (req.user && req.user.role === 'student') {
      const attempts = await ExamAttempt.find({ student: req.user.id });
      const attemptMap = {};
      attempts.forEach((att) => {
        if (!attemptMap[att.exam.toString()]) {
          attemptMap[att.exam.toString()] = [];
        }
        attemptMap[att.exam.toString()].push(att);
      });

      examsWithStudentData = exams.map((exam) => {
        const examObj = exam.toObject();
        const studentAttempts = attemptMap[exam._id.toString()] || [];
        examObj.userAttemptsCount = studentAttempts.length;
        examObj.hasActiveAttempt = studentAttempts.some((a) => a.status === 'in_progress');
        examObj.bestScore = studentAttempts.reduce((max, a) => Math.max(max, a.percentage || 0), 0);
        examObj.latestAttempt = studentAttempts[studentAttempts.length - 1] || null;
        return examObj;
      });
    }

    res.status(200).json({
      success: true,
      count: examsWithStudentData.length,
      exams: examsWithStudentData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exam by ID
// @route   GET /api/exams/:id
// @access  Authenticated
const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('createdBy', 'name email');
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const examObj = exam.toObject();

    // If student, include their attempts for this exam
    if (req.user && req.user.role === 'student') {
      const userAttempts = await ExamAttempt.find({
        exam: exam._id,
        student: req.user.id,
      }).sort({ createdAt: -1 });

      examObj.userAttempts = userAttempts;
      examObj.userAttemptsCount = userAttempts.length;
      examObj.canAttempt = userAttempts.length < exam.maxAttempts;
    }

    // For faculty/admin, also populate question details
    if (req.user && (req.user.role === 'admin' || req.user.role === 'faculty')) {
      const populatedQuestions = await Question.find({ _id: { $in: exam.questions } });
      examObj.questionDetails = populatedQuestions;
    }

    res.status(200).json({
      success: true,
      exam: examObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Private/FacultyOrAdmin
const createExam = async (req, res, next) => {
  try {
    const {
      title,
      description,
      subject,
      duration,
      totalMarks,
      passingMarks,
      passingPercentage,
      questions,
      randomizeQuestions,
      randomizeOptions,
      negativeMarking,
      negativeMarkValue,
      startDate,
      endDate,
      maxAttempts,
      status,
      targetCourse,
      targetYear,
      difficultyLevel,
      instructions,
    } = req.body;

    if (!title || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Exam title and duration are required.',
      });
    }

    const exam = await Exam.create({
      title,
      description: description || '',
      subject: subject || 'Data Structures and Algorithms',
      duration: Number(duration),
      totalMarks: totalMarks ? Number(totalMarks) : (questions ? questions.length : 30),
      passingMarks: passingMarks ? Number(passingMarks) : 12,
      passingPercentage: passingPercentage ? Number(passingPercentage) : 40,
      questions: questions || [],
      questionCount: questions ? questions.length : 0,
      randomizeQuestions: randomizeQuestions !== undefined ? randomizeQuestions : true,
      randomizeOptions: randomizeOptions !== undefined ? randomizeOptions : true,
      negativeMarking: negativeMarking !== undefined ? negativeMarking : true,
      negativeMarkValue: negativeMarkValue !== undefined ? Number(negativeMarkValue) : 0.25,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      maxAttempts: maxAttempts ? Number(maxAttempts) : 3,
      status: status || 'live',
      targetCourse: targetCourse || 'All Courses',
      targetYear: targetYear || 'All Years',
      difficultyLevel: difficultyLevel || 'Comprehensive',
      instructions: instructions || [
        'Each question has a specific time allotment, but you can navigate freely.',
        'Negative marking is enabled for incorrect answers.',
        'Anti-cheating protocols are active: tab switching and exiting fullscreen are recorded.',
        'The examination will automatically submit when the countdown reaches zero.',
      ],
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      exam,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/FacultyOrAdmin
const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (exam.createdBy && exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this exam.',
      });
    }

    if (req.body.questions) {
      req.body.questionCount = req.body.questions.length;
    }

    const updated = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      exam: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/FacultyOrAdmin
const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (exam.createdBy && exam.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this exam.',
      });
    }

    await Exam.findByIdAndDelete(req.params.id);
    await ExamAttempt.deleteMany({ exam: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Exam and its attempts deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start / Resume Exam Attempt
// @route   POST /api/exams/:id/start
// @access  Private/Student
const startExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (exam.status !== 'live' && req.user.role === 'student') {
      return res.status(400).json({
        success: false,
        message: 'This examination is currently not available for taking.',
      });
    }

    // Check existing attempts
    const previousAttempts = await ExamAttempt.find({
      student: req.user.id,
      exam: exam._id,
    });

    // Check if there is an in-progress attempt
    const activeAttempt = previousAttempts.find((a) => a.status === 'in_progress');

    if (activeAttempt) {
      const now = new Date();
      if (now > new Date(activeAttempt.endTime)) {
        // Auto-close expired attempt
        activeAttempt.status = 'timed_out';
        await activeAttempt.save();
      } else {
        // Resume active attempt
        // Load questions according to stored question order
        const qIds = activeAttempt.questionOrder.map((q) => q.questionId);
        const questionsList = await Question.find({ _id: { $in: qIds } });
        const questionMap = {};
        questionsList.forEach((q) => {
          questionMap[q._id.toString()] = q;
        });

        // Strip correct answer and explanation for security!
        const sanitizedQuestions = activeAttempt.questionOrder.map((orderItem) => {
          const rawQ = questionMap[orderItem.questionId.toString()];
          if (!rawQ) return null;
          const qObj = rawQ.toObject();
          delete qObj.correctAnswer;
          delete qObj.explanation;

          // Reorder options according to session optionOrder
          if (orderItem.optionOrder && orderItem.optionOrder.length > 0) {
            const optMap = {};
            qObj.options.forEach((opt) => (optMap[opt.id] = opt));
            qObj.options = orderItem.optionOrder.map((id) => optMap[id]).filter(Boolean);
          }
          return qObj;
        }).filter(Boolean);

        return res.status(200).json({
          success: true,
          message: 'Resuming active exam session',
          attemptId: activeAttempt._id,
          startTime: activeAttempt.startTime,
          endTime: activeAttempt.endTime,
          remainingSeconds: Math.max(0, Math.floor((new Date(activeAttempt.endTime) - now) / 1000)),
          exam: {
            _id: exam._id,
            title: exam.title,
            duration: exam.duration,
            totalMarks: exam.totalMarks,
            negativeMarking: exam.negativeMarking,
            negativeMarkValue: exam.negativeMarkValue,
            instructions: exam.instructions,
          },
          questions: sanitizedQuestions,
          savedAnswers: activeAttempt.answers,
          antiCheatingLogs: activeAttempt.antiCheatingLogs,
        });
      }
    }

    // Check max attempts
    const completedAttemptsCount = previousAttempts.filter((a) => a.status !== 'in_progress').length;
    if (completedAttemptsCount >= exam.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `You have reached the maximum allowed attempts (${exam.maxAttempts}) for this exam.`,
      });
    }

    // Prepare fresh questions
    let questionDocs = await Question.find({ _id: { $in: exam.questions } });
    if (!questionDocs || questionDocs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'This examination does not have any questions assigned yet.',
      });
    }

    const { orderedQuestions, questionOrder } = prepareExamSession(
      questionDocs,
      exam.randomizeQuestions,
      exam.randomizeOptions
    );

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + exam.duration * 60 * 1000);

    const initialAnswers = orderedQuestions.map((q) => ({
      question: q._id,
      selectedAnswer: null,
      status: 'not_visited',
      timeSpentSeconds: 0,
    }));

    const newAttempt = await ExamAttempt.create({
      student: req.user.id,
      exam: exam._id,
      startTime,
      endTime,
      status: 'in_progress',
      questionOrder,
      answers: initialAnswers,
      totalQuestions: orderedQuestions.length,
      totalMarks: exam.totalMarks,
    });

    // Sanitize questions (Remove correct answer & explanation)
    const sanitizedQuestions = orderedQuestions.map((q, idx) => {
      const qObj = q.toObject ? q.toObject() : { ...q };
      delete qObj.correctAnswer;
      delete qObj.explanation;

      const orderItem = questionOrder[idx];
      if (orderItem && orderItem.optionOrder && orderItem.optionOrder.length > 0) {
        const optMap = {};
        qObj.options.forEach((opt) => (optMap[opt.id] = opt));
        qObj.options = orderItem.optionOrder.map((id) => optMap[id]).filter(Boolean);
      }
      return qObj;
    });

    res.status(201).json({
      success: true,
      message: 'Examination started successfully',
      attemptId: newAttempt._id,
      startTime,
      endTime,
      remainingSeconds: exam.duration * 60,
      exam: {
        _id: exam._id,
        title: exam.title,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        negativeMarking: exam.negativeMarking,
        negativeMarkValue: exam.negativeMarkValue,
        instructions: exam.instructions,
      },
      questions: sanitizedQuestions,
      savedAnswers: initialAnswers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Exam and Execute Server-Side Evaluation
// @route   POST /api/exams/:id/submit
// @access  Private/Student
const submitExam = async (req, res, next) => {
  try {
    const { attemptId, answers, antiCheatingLogs, timeTakenSeconds } = req.body;

    const attempt = await ExamAttempt.findOne({
      _id: attemptId,
      student: req.user.id,
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Exam attempt not found' });
    }

    if (attempt.status === 'evaluated' || attempt.status === 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'This attempt has already been submitted and evaluated.',
        attemptId: attempt._id,
      });
    }

    const exam = await Exam.findById(attempt.exam);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Associated exam not found' });
    }

    // Merge latest submitted answers into attempt answers
    if (answers && Array.isArray(answers)) {
      const ansMap = {};
      answers.forEach((ans) => {
        const qId = ans.question ? (ans.question._id || ans.question).toString() : ans.questionId;
        if (qId) ansMap[qId] = ans;
      });

      attempt.answers = attempt.answers.map((currentAns) => {
        const qIdStr = currentAns.question.toString();
        if (ansMap[qIdStr]) {
          return {
            question: currentAns.question,
            selectedAnswer: ansMap[qIdStr].selectedAnswer,
            status: ansMap[qIdStr].status || 'answered',
            timeSpentSeconds: ansMap[qIdStr].timeSpentSeconds || currentAns.timeSpentSeconds || 0,
          };
        }
        return currentAns;
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

    // Fetch actual questions from database for secure server-side evaluation
    const questionIds = attempt.answers.map((a) => a.question);
    const questionsList = await Question.find({ _id: { $in: questionIds } });
    const questionsMap = {};
    questionsList.forEach((q) => {
      questionsMap[q._id.toString()] = q;
    });

    const evaluatedResult = await evaluateAttempt({
      attempt,
      exam,
      questionsMap,
      studentId: req.user.id,
    });

    // Update attempt with final evaluation results
    attempt.answers = evaluatedResult.evaluatedAnswers;
    attempt.totalQuestions = evaluatedResult.totalQuestions;
    attempt.attemptedQuestions = evaluatedResult.attemptedQuestions;
    attempt.correctAnswers = evaluatedResult.correctAnswers;
    attempt.wrongAnswers = evaluatedResult.wrongAnswers;
    attempt.unansweredQuestions = evaluatedResult.unansweredQuestions;
    attempt.totalMarks = evaluatedResult.totalMarks;
    attempt.obtainedMarks = evaluatedResult.obtainedMarks;
    attempt.percentage = evaluatedResult.percentage;
    attempt.accuracy = evaluatedResult.accuracy;
    attempt.grade = evaluatedResult.grade;
    attempt.isPassed = evaluatedResult.isPassed;
    attempt.topicBreakdown = evaluatedResult.topicBreakdown;
    attempt.timeTakenSeconds = timeTakenSeconds || Math.floor((Date.now() - new Date(attempt.startTime).getTime()) / 1000);
    attempt.submittedAt = new Date();
    attempt.status = 'evaluated';

    await attempt.save();

    res.status(200).json({
      success: true,
      message: 'Examination submitted and evaluated successfully!',
      result: {
        attemptId: attempt._id,
        examId: exam._id,
        examTitle: exam.title,
        totalQuestions: attempt.totalQuestions,
        attemptedQuestions: attempt.attemptedQuestions,
        correctAnswers: attempt.correctAnswers,
        wrongAnswers: attempt.wrongAnswers,
        unansweredQuestions: attempt.unansweredQuestions,
        totalMarks: attempt.totalMarks,
        obtainedMarks: attempt.obtainedMarks,
        percentage: attempt.percentage,
        accuracy: attempt.accuracy,
        grade: attempt.grade,
        isPassed: attempt.isPassed,
        timeTakenSeconds: attempt.timeTakenSeconds,
        topicBreakdown: attempt.topicBreakdown,
        submittedAt: attempt.submittedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Exam Leaderboard
// @route   GET /api/exams/:id/leaderboard
// @access  Authenticated
const getExamLeaderboard = async (req, res, next) => {
  try {
    const attempts = await ExamAttempt.find({
      exam: req.params.id,
      status: 'evaluated',
    })
      .sort({ obtainedMarks: -1, timeTakenSeconds: 1 })
      .limit(50)
      .populate('student', 'name college course year avatar');

    const leaderboard = attempts.map((att, idx) => ({
      rank: idx + 1,
      attemptId: att._id,
      studentName: att.student ? att.student.name : 'Anonymous',
      studentCollege: att.student ? att.student.college : '',
      studentCourse: att.student ? att.student.course : '',
      avatar: att.student ? att.student.avatar : '',
      score: att.obtainedMarks,
      totalMarks: att.totalMarks,
      percentage: att.percentage,
      accuracy: att.accuracy,
      grade: att.grade,
      timeTakenSeconds: att.timeTakenSeconds,
      submittedAt: att.submittedAt,
    }));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  startExam,
  submitExam,
  getExamLeaderboard,
};
