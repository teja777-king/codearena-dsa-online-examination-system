const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Foundations', 'Linear Data Structures', 'Non-Linear Data Structures', 'Algorithms', 'Advanced Techniques'],
      default: 'Foundations',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    icon: {
      type: String,
      default: 'Code',
    },
    questionsCount: {
      type: Number,
      default: 0,
    },
    keyConcepts: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Topic', topicSchema);
