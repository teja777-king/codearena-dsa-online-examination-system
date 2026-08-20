const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    badgeKey: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'Award',
    },
    category: {
      type: String,
      enum: ['Exams', 'Accuracy', 'Streak', 'Topic_Mastery', 'Speed'],
      default: 'Exams',
    },
    criteria: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
