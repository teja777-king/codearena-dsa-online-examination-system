const Question = require('../models/Question');
const Topic = require('../models/Topic');

// @desc    Get questions with search, filter & pagination (For Admin / Faculty)
// @route   GET /api/questions
// @access  Private/FacultyOrAdmin
const getQuestions = async (req, res, next) => {
  try {
    const { topic, difficulty, questionType, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (topic && topic !== 'All') {
      query.topicName = topic;
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty.toLowerCase();
    }
    if (questionType && questionType !== 'All') {
      query.questionType = questionType;
    }
    if (search) {
      query.$or = [
        { questionText: { $regex: search, $options: 'i' } },
        { subTopic: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Private/FacultyOrAdmin
const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate('createdBy', 'name email');
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/FacultyOrAdmin
const createQuestion = async (req, res, next) => {
  try {
    const {
      questionText,
      codeSnippet,
      codeLanguage,
      questionType,
      topicName,
      subTopic,
      difficulty,
      options,
      correctAnswer,
      explanation,
      marks,
      negativeMarks,
      timeLimit,
      tags,
    } = req.body;

    // Validate options for MCQ
    if (questionType === 'mcq' || questionType === 'multiple_select') {
      if (!options || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'At least 2 options are required for multiple choice questions.',
        });
      }
    }

    const question = await Question.create({
      questionText,
      codeSnippet: codeSnippet || '',
      codeLanguage: codeLanguage || 'cpp',
      questionType: questionType || 'mcq',
      topicName,
      subTopic: subTopic || '',
      difficulty: difficulty ? difficulty.toLowerCase() : 'medium',
      options: options || [],
      correctAnswer,
      explanation,
      marks: marks !== undefined ? Number(marks) : 1,
      negativeMarks: negativeMarks !== undefined ? Number(negativeMarks) : 0.25,
      timeLimit: timeLimit ? Number(timeLimit) : 60,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
      createdBy: req.user.id,
    });

    // Update topic count
    await Topic.findOneAndUpdate(
      { name: topicName },
      { $inc: { questionsCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/FacultyOrAdmin
const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Only creator or admin can edit
    if (question.createdBy && question.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this question.',
      });
    }

    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/FacultyOrAdmin
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (question.createdBy && question.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question.',
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    // Decrement topic count
    await Topic.findOneAndUpdate(
      { name: question.topicName },
      { $inc: { questionsCount: -1 } }
    );

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Practice Questions for Student (Topic & Difficulty based)
// @route   GET /api/questions/practice
// @access  Private/Student
const getPracticeQuestions = async (req, res, next) => {
  try {
    const { topic, difficulty, limit = 10 } = req.query;
    const query = {};

    if (topic && topic !== 'All') {
      query.topicName = topic;
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty.toLowerCase();
    }

    const limitNum = Math.min(parseInt(limit, 10) || 10, 50);

    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: limitNum } },
    ]);

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getPracticeQuestions,
};
