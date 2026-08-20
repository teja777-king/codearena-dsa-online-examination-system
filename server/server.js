const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.JWT_SECRET) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const topicRoutes = require('./routes/topicRoutes');
const questionRoutes = require('./routes/questionRoutes');
const examRoutes = require('./routes/examRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Import algorithm implementations for direct API access / playground
const arrayAlgos = require('./algorithms/arrayAlgorithms');
const searchingAlgos = require('./algorithms/searchingAlgorithms');
const sortingAlgos = require('./algorithms/sortingAlgorithms');
const linkedListAlgos = require('./algorithms/linkedListAlgorithms');
const stackAlgos = require('./algorithms/stackAlgorithms');
const queueAlgos = require('./algorithms/queueAlgorithms');
const treeAlgos = require('./algorithms/treeAlgorithms');
const graphAlgos = require('./algorithms/graphAlgorithms');
const dpAlgos = require('./algorithms/dynamicProgramming');
const greedyAlgos = require('./algorithms/greedyAlgorithms');
const recursionAlgos = require('./algorithms/recursionAlgorithms');
const stringAlgos = require('./algorithms/stringAlgorithms');

const app = express();

// Security and utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // allow modern inline scripts & charts in dev
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date(),
    service: 'CodeArena DSA Examination Engine',
    version: '1.0.0',
  });
});

// Mount Core API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/analytics', analyticsRoutes);

// DSA Algorithms Metadata & Catalog API
app.get('/api/algorithms/catalog', (req, res) => {
  res.status(200).json({
    success: true,
    catalog: {
      arrays: arrayAlgos.metadata,
      searching: searchingAlgos.metadata,
      sorting: sortingAlgos.metadata,
      linkedList: linkedListAlgos.metadata,
      stacks: stackAlgos.metadata,
      queues: queueAlgos.metadata,
      trees: treeAlgos.metadata,
      graphs: graphAlgos.metadata,
      dynamicProgramming: dpAlgos.metadata,
      greedy: greedyAlgos.metadata,
      recursion: recursionAlgos.metadata,
      strings: stringAlgos.metadata,
    },
  });
});

// Serve frontend build if present
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty on start
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Database is empty. Running automatic seed...');
      const seedDatabase = require('./seed/seed');
      // Run seed in non-exiting mode
      try {
        const topicsData = require('./seed/topicsData');
        const questionsData = require('./seed/questionsData');
        const Topic = require('./models/Topic');
        const Question = require('./models/Question');
        const Exam = require('./models/Exam');
        const Achievement = require('./models/Achievement');
        const Notification = require('./models/Notification');

        const adminUser = await User.create({
          name: 'Dr. Alan Turing (Admin)',
          email: 'admin@codearena.com',
          password: 'Admin@123',
          role: 'admin',
          college: 'CodeArena Central University',
          studentId: 'ADMIN-001',
          course: 'Department of Computer Science',
          year: 'Faculty Lead',
          streakCount: 15,
        });

        const facultyUser = await User.create({
          name: 'Prof. Donald Knuth (Faculty)',
          email: 'faculty@codearena.com',
          password: 'Faculty@123',
          role: 'faculty',
          college: 'CodeArena Central University',
          studentId: 'FAC-101',
          course: 'Algorithms & Data Structures Division',
          year: 'Senior Professor',
          streakCount: 8,
        });

        const studentUser = await User.create({
          name: 'Teja Varma (Student)',
          email: 'student@codearena.com',
          password: 'Student@123',
          role: 'student',
          college: 'CodeArena Institute of Technology',
          studentId: 'CA-847291',
          course: 'B.Tech Computer Science & Engineering',
          year: '3rd Year',
          streakCount: 5,
          stats: {
            examsAttempted: 3,
            totalScore: 78.5,
            averageScore: 26.17,
            bestScore: 28,
            totalQuestionsSolved: 90,
            totalCorrect: 79,
            totalWrong: 11,
            accuracy: 87.8,
          },
          badges: [
            { badgeKey: 'first_exam', title: 'First Battle', description: 'Completed your first DSA examination on CodeArena.', icon: 'Shield' },
            { badgeKey: 'high_scorer', title: 'DSA Prodigy', description: 'Scored 90%+ in a timed examination.', icon: 'Award' },
            { badgeKey: 'streak_master', title: 'Consistent Learner', description: 'Maintained a 5-day active study streak.', icon: 'Flame' },
          ],
        });

        const createdTopics = await Topic.insertMany(topicsData);
        const topicMap = {};
        createdTopics.forEach((t) => (topicMap[t.name] = t._id));

        const preparedQuestions = questionsData.map((q) => ({
          ...q,
          topic: topicMap[q.topicName] || null,
          createdBy: facultyUser._id,
        }));
        const createdQuestions = await Question.insertMany(preparedQuestions);

        for (const t of createdTopics) {
          const count = await Question.countDocuments({ topicName: t.name });
          t.questionsCount = count;
          await t.save();
        }

        const allQIds = createdQuestions.map((q) => q._id);

        const exam1 = await Exam.create({
          title: 'DSA Fundamentals — Mid-Semester Examination',
          description: 'Comprehensive test covering foundational topics: Arrays, Linked Lists, Stacks, Queues, and Searching.',
          subject: 'Data Structures and Algorithms',
          duration: 30,
          totalMarks: 30,
          passingMarks: 12,
          passingPercentage: 40,
          questions: allQIds.slice(0, 30),
          questionCount: 30,
          randomizeQuestions: true,
          randomizeOptions: true,
          negativeMarking: true,
          negativeMarkValue: 0.25,
          status: 'live',
          difficultyLevel: 'Beginner',
          createdBy: facultyUser._id,
        });

        await Exam.create({
          title: 'Advanced DSA — Trees, Graphs & Dynamic Programming',
          description: 'In-depth assessment testing Trees, BSTs, Graph Traversals (BFS/DFS), Dijkstra, Kruskal, and DP formulations.',
          subject: 'Data Structures and Algorithms',
          duration: 45,
          totalMarks: 40,
          passingMarks: 16,
          passingPercentage: 40,
          questions: allQIds.slice(20, 60),
          questionCount: 40,
          randomizeQuestions: true,
          randomizeOptions: true,
          negativeMarking: true,
          negativeMarkValue: 0.25,
          status: 'live',
          difficultyLevel: 'Intermediate',
          createdBy: facultyUser._id,
        });

        await Exam.create({
          title: 'DSA Final University Assessment — Full Course',
          description: 'Comprehensive 60-minute university examination spanning all 22 topics of the Data Structures & Algorithms syllabus.',
          subject: 'Data Structures and Algorithms',
          duration: 60,
          totalMarks: 50,
          passingMarks: 20,
          passingPercentage: 40,
          questions: allQIds.slice(0, 50),
          questionCount: 50,
          randomizeQuestions: true,
          randomizeOptions: true,
          negativeMarking: true,
          negativeMarkValue: 0.25,
          status: 'live',
          difficultyLevel: 'Comprehensive',
          createdBy: adminUser._id,
        });

        const ExamAttempt = require('./models/ExamAttempt');
        const sampleQuestions = await Question.find({ _id: { $in: allQIds.slice(0, 30) } });
        const sampleAnswers = sampleQuestions.map((q, idx) => ({
          question: q._id,
          selectedAnswer: idx < 26 ? q.correctAnswer : 'B',
          isCorrect: idx < 26,
          marksAwarded: idx < 26 ? 1 : -0.25,
          status: 'answered',
          timeSpentSeconds: 45,
        }));

        await ExamAttempt.create({
          student: studentUser._id,
          exam: exam1._id,
          startTime: new Date(Date.now() - 3600000),
          endTime: new Date(Date.now() - 1800000),
          submittedAt: new Date(Date.now() - 1850000),
          status: 'evaluated',
          questionOrder: sampleQuestions.map((q) => ({ questionId: q._id, optionOrder: ['A', 'B', 'C', 'D'] })),
          answers: sampleAnswers,
          totalQuestions: 30,
          attemptedQuestions: 30,
          correctAnswers: 26,
          wrongAnswers: 4,
          unansweredQuestions: 0,
          totalMarks: 30,
          obtainedMarks: 25.0,
          percentage: 83.33,
          accuracy: 86.67,
          grade: 'A',
          isPassed: true,
          timeTakenSeconds: 1250,
          topicBreakdown: [
            { topicName: 'Arrays', total: 10, correct: 9, wrong: 1, accuracy: 90 },
            { topicName: 'Linked Lists', total: 8, correct: 7, wrong: 1, accuracy: 87.5 },
            { topicName: 'Stacks', total: 6, correct: 5, wrong: 1, accuracy: 83.3 },
            { topicName: 'Queues', total: 6, correct: 5, wrong: 1, accuracy: 83.3 },
          ],
        });

        await Notification.create({
          recipient: null,
          title: 'CodeArena DSA Online Examination System is Live!',
          message: 'Welcome to the intelligent examination portal for Data Structures & Algorithms.',
          type: 'system',
        });

        console.log('✅ Automatic database seeding completed on initial boot.');
      } catch (seedErr) {
        console.warn('Warning during auto-seed:', seedErr.message);
      }
    }

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 CodeArena DSA API Server running on port ${PORT}`);
      console.log(`🌐 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔑 Demo Accounts:`);
      console.log(`   Admin:   admin@codearena.com   / Admin@123`);
      console.log(`   Faculty: faculty@codearena.com / Faculty@123`);
      console.log(`   Student: student@codearena.com / Student@123`);
      console.log(`======================================================\n`);
    });

    return server;
  } catch (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
