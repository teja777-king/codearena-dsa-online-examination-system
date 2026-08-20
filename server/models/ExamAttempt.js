const mongoose = require('mongoose');

const singleAnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  selectedAnswer: {
    type: mongoose.Schema.Types.Mixed, // e.g. "A" or ["A", "B"]
    default: null,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  marksAwarded: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['not_visited', 'visited', 'answered', 'marked_for_review', 'answered_and_marked'],
    default: 'not_visited',
  },
  timeSpentSeconds: {
    type: Number,
    default: 0,
  },
});

const examAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['in_progress', 'submitted', 'evaluated', 'timed_out', 'terminated_cheating'],
      default: 'in_progress',
    },
    questionOrder: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        optionOrder: [String], // e.g. ["B", "A", "D", "C"]
      },
    ],
    answers: [singleAnswerSchema],
    totalQuestions: {
      type: Number,
      default: 0,
    },
    attemptedQuestions: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    wrongAnswers: {
      type: Number,
      default: 0,
    },
    unansweredQuestions: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    obtainedMarks: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F', 'Pending'],
      default: 'Pending',
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
    topicBreakdown: [
      {
        topicName: String,
        total: Number,
        correct: Number,
        wrong: Number,
        accuracy: Number,
      },
    ],
    antiCheatingLogs: {
      tabSwitchCount: { type: Number, default: 0 },
      fullscreenExitCount: { type: Number, default: 0 },
      copyAttemptCount: { type: Number, default: 0 },
      pasteAttemptCount: { type: Number, default: 0 },
      rightClickCount: { type: Number, default: 0 },
      events: [
        {
          eventType: { type: String }, // 'tab_switch', 'fullscreen_exit', 'copy_attempt', 'paste_attempt', 'blur', 'right_click'
          timestamp: { type: Date, default: Date.now },
          details: { type: String, default: '' },
        },
      ],
    },
  },
  { timestamps: true }
);

examAttemptSchema.index({ student: 1, exam: 1 });
examAttemptSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('ExamAttempt', examAttemptSchema);
