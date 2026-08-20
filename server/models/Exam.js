const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Exam title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: 'Data Structures and Algorithms',
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [5, 'Duration must be at least 5 minutes'],
      default: 30,
    },
    totalMarks: {
      type: Number,
      default: 30,
    },
    passingMarks: {
      type: Number,
      default: 12,
    },
    passingPercentage: {
      type: Number,
      default: 40,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    questionCount: {
      type: Number,
      default: function () {
        return this.questions ? this.questions.length : 0;
      },
    },
    randomizeQuestions: {
      type: Boolean,
      default: true,
    },
    randomizeOptions: {
      type: Boolean,
      default: true,
    },
    negativeMarking: {
      type: Boolean,
      default: true,
    },
    negativeMarkValue: {
      type: Number,
      default: 0.25,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: function () {
        const d = new Date();
        d.setDate(d.getDate() + 90); // default available for 90 days
        return d;
      },
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'live', 'completed', 'archived'],
      default: 'live',
    },
    targetCourse: {
      type: String,
      default: 'All Courses',
    },
    targetYear: {
      type: String,
      default: 'All Years',
    },
    difficultyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Comprehensive'],
      default: 'Comprehensive',
    },
    instructions: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
