const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: {
    type: String, // e.g. "A", "B", "C", "D"
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    default: '',
  },
});

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    codeLanguage: {
      type: String,
      default: 'cpp',
    },
    questionType: {
      type: String,
      enum: ['mcq', 'multiple_select', 'true_false', 'code_output', 'algorithm_analysis'],
      default: 'mcq',
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
    topicName: {
      type: String,
      required: [true, 'Topic name is required'],
      index: true,
    },
    subTopic: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      index: true,
    },
    options: [optionSchema],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed, // e.g. "A", or ["A", "C"], or "true"
      required: [true, 'Correct answer is required'],
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
    },
    marks: {
      type: Number,
      default: 1,
      min: 0.5,
    },
    negativeMarks: {
      type: Number,
      default: 0.25,
      min: 0,
    },
    timeLimit: {
      type: Number,
      default: 60, // in seconds
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

questionSchema.index({ topicName: 1, difficulty: 1 });
questionSchema.index({ tags: 1 });

module.exports = mongoose.model('Question', questionSchema);
