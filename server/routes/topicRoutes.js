const express = require('express');
const router = express.Router();
const {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.route('/')
  .get(getTopics)
  .post(protect, requireAdmin, createTopic);

router.route('/:id')
  .get(getTopicById)
  .put(protect, requireAdmin, updateTopic)
  .delete(protect, requireAdmin, deleteTopic);

module.exports = router;
