const Topic = require('../models/Topic');
const Question = require('../models/Question');

// @desc    Get all DSA topics with dynamic question count
// @route   GET /api/topics
// @access  Public
const getTopics = async (req, res, next) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });

    // Aggregate real question counts per topic
    const counts = await Question.aggregate([
      { $group: { _id: '$topicName', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const topicsWithCount = topics.map((t) => {
      const obj = t.toObject();
      obj.questionsCount = countMap[t.name] || obj.questionsCount || 0;
      return obj;
    });

    res.status(200).json({
      success: true,
      count: topicsWithCount.length,
      topics: topicsWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single topic by slug or ID
// @route   GET /api/topics/:id
// @access  Public
const getTopicById = async (req, res, next) => {
  try {
    let topic;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      topic = await Topic.findById(req.params.id);
    } else {
      topic = await Topic.findOne({ slug: req.params.id.toLowerCase() });
    }

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const questionCount = await Question.countDocuments({ topicName: topic.name });
    const topicObj = topic.toObject();
    topicObj.questionsCount = questionCount;

    res.status(200).json({
      success: true,
      topic: topicObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create topic
// @route   POST /api/topics
// @access  Private/Admin
const createTopic = async (req, res, next) => {
  try {
    const { name, slug, description, category, difficulty, icon, keyConcepts, order } = req.body;

    const topic = await Topic.create({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      category,
      difficulty,
      icon,
      keyConcepts,
      order: order || 1,
    });

    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      topic,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private/Admin
const updateTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Topic updated successfully',
      topic,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private/Admin
const deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Topic deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
};
