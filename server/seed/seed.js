const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
if (!process.env.JWT_SECRET) {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const { connectDB } = require('../config/db');
const User = require('../models/User');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const ExamAttempt = require('../models/ExamAttempt');
const Achievement = require('../models/Achievement');
const Notification = require('../models/Notification');

const topicsData = require('./topicsData');
const questionsData = require('./questionsData');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting CodeArena DSA Database Seeding...');
    await connectDB();

    // 1. Clear existing collections
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Topic.deleteMany({}),
      Question.deleteMany({}),
      Exam.deleteMany({}),
      ExamAttempt.deleteMany({}),
      Achievement.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // 2. Seed Default Users
    console.log('👤 Creating default user accounts (Admin, Faculty, Student)...');
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
      badges: [
        {
          badgeKey: 'system_architect',
          title: 'System Architect',
          description: 'Lead administrator of CodeArena Examination System.',
          icon: 'Shield',
        },
      ],
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
      badges: [
        {
          badgeKey: 'algorithm_master',
          title: 'Algorithm Master',
          description: 'Authored comprehensive university examinations.',
          icon: 'Award',
        },
      ],
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
        {
          badgeKey: 'first_exam',
          title: 'First Battle',
          description: 'Completed your first DSA examination on CodeArena.',
          icon: 'Shield',
        },
        {
          badgeKey: 'high_scorer',
          title: 'DSA Prodigy',
          description: 'Scored 90%+ in a timed examination.',
          icon: 'Award',
        },
        {
          badgeKey: 'streak_master',
          title: 'Consistent Learner',
          description: 'Maintained a 5-day active study streak.',
          icon: 'Flame',
        },
      ],
    });

    // Create 4 additional demo students for realistic leaderboard
    const peerStudents = await User.create([
      {
        name: 'Aarav Sharma',
        email: 'aarav@codearena.com',
        password: 'Student@123',
        role: 'student',
        college: 'IIT Bombay',
        studentId: 'CA-102938',
        course: 'B.Tech CSE',
        year: '3rd Year',
        streakCount: 12,
        stats: {
          examsAttempted: 5,
          totalScore: 135,
          averageScore: 27.0,
          bestScore: 29.5,
          totalQuestionsSolved: 150,
          totalCorrect: 138,
          totalWrong: 12,
          accuracy: 92.0,
        },
      },
      {
        name: 'Priya Patel',
        email: 'priya@codearena.com',
        password: 'Student@123',
        role: 'student',
        college: 'BITS Pilani',
        studentId: 'CA-948201',
        course: 'B.Tech CSE',
        year: '4th Year',
        streakCount: 9,
        stats: {
          examsAttempted: 4,
          totalScore: 104,
          averageScore: 26.0,
          bestScore: 27,
          totalQuestionsSolved: 120,
          totalCorrect: 107,
          totalWrong: 13,
          accuracy: 89.2,
        },
      },
      {
        name: 'Rohan Gupta',
        email: 'rohan@codearena.com',
        password: 'Student@123',
        role: 'student',
        college: 'NIT Trichy',
        studentId: 'CA-774920',
        course: 'B.Tech Information Technology',
        year: '2nd Year',
        streakCount: 4,
        stats: {
          examsAttempted: 2,
          totalScore: 49,
          averageScore: 24.5,
          bestScore: 25.5,
          totalQuestionsSolved: 60,
          totalCorrect: 50,
          totalWrong: 10,
          accuracy: 83.3,
        },
      },
      {
        name: 'Ananya Verma',
        email: 'ananya@codearena.com',
        password: 'Student@123',
        role: 'student',
        college: 'IIIT Hyderabad',
        studentId: 'CA-559102',
        course: 'B.Tech CSE',
        year: '3rd Year',
        streakCount: 7,
        stats: {
          examsAttempted: 3,
          totalScore: 72,
          averageScore: 24.0,
          bestScore: 26,
          totalQuestionsSolved: 90,
          totalCorrect: 74,
          totalWrong: 16,
          accuracy: 82.2,
        },
      },
    ]);

    // 3. Seed DSA Topics
    console.log('📚 Seeding 22 DSA Syllabus Topics...');
    const createdTopics = await Topic.insertMany(topicsData);
    const topicMap = {};
    createdTopics.forEach((t) => {
      topicMap[t.name] = t._id;
    });

    // 4. Seed Questions
    console.log(`💡 Seeding ${questionsData.length} comprehensive DSA Questions...`);
    const preparedQuestions = questionsData.map((q) => ({
      ...q,
      topic: topicMap[q.topicName] || null,
      createdBy: facultyUser._id,
    }));

    const createdQuestions = await Question.insertMany(preparedQuestions);
    console.log(`✅ ${createdQuestions.length} Questions successfully inserted.`);

    // Update topic questionsCount
    for (const t of createdTopics) {
      const count = await Question.countDocuments({ topicName: t.name });
      t.questionsCount = count;
      await t.save();
    }

    // 5. Seed 3 Sample Exams
    console.log('📝 Creating 3 Sample Examination Papers...');
    const allQIds = createdQuestions.map((q) => q._id);

    // Exam 1: DSA Fundamentals (30 Questions, 30 Minutes)
    const exam1Questions = allQIds.slice(0, 30);
    const exam1 = await Exam.create({
      title: 'DSA Fundamentals — Mid-Semester Examination',
      description: 'Comprehensive test covering foundational topics: Arrays, Linked Lists, Stacks, Queues, and Searching.',
      subject: 'Data Structures and Algorithms',
      duration: 30,
      totalMarks: 30,
      passingMarks: 12,
      passingPercentage: 40,
      questions: exam1Questions,
      questionCount: exam1Questions.length,
      randomizeQuestions: true,
      randomizeOptions: true,
      negativeMarking: true,
      negativeMarkValue: 0.25,
      status: 'live',
      difficultyLevel: 'Beginner',
      instructions: [
        'Total Duration: 30 Minutes for 30 Questions.',
        'Each correct answer awards +1 Mark. Incorrect answers deduct -0.25 Marks.',
        'Unanswered questions receive 0 Marks.',
        'Fullscreen and tab activity will be monitored. Ensure uninterrupted connectivity.',
        'The examination will auto-submit when the timer expires.',
      ],
      createdBy: facultyUser._id,
    });

    // Exam 2: Advanced DSA (40 Questions, 45 Minutes)
    const exam2Questions = allQIds.slice(20, 60);
    const exam2 = await Exam.create({
      title: 'Advanced DSA — Trees, Graphs & Dynamic Programming',
      description: 'In-depth assessment testing Trees, BSTs, Graph Traversals (BFS/DFS), Dijkstra, Kruskal, and DP formulations.',
      subject: 'Data Structures and Algorithms',
      duration: 45,
      totalMarks: 40,
      passingMarks: 16,
      passingPercentage: 40,
      questions: exam2Questions,
      questionCount: exam2Questions.length,
      randomizeQuestions: true,
      randomizeOptions: true,
      negativeMarking: true,
      negativeMarkValue: 0.25,
      status: 'live',
      difficultyLevel: 'Intermediate',
      instructions: [
        'Total Duration: 45 Minutes for 40 Questions.',
        'Covers non-linear data structures and dynamic programming optimizations.',
        'Negative marking of -0.25 is active.',
        'Navigation between questions is unrestricted until submission.',
      ],
      createdBy: facultyUser._id,
    });

    // Exam 3: DSA Final Assessment (50 Questions, 60 Minutes)
    const exam3Questions = allQIds.slice(0, 50);
    const exam3 = await Exam.create({
      title: 'DSA Final University Assessment — Full Course',
      description: 'Comprehensive 60-minute university examination spanning all 22 topics of the Data Structures & Algorithms syllabus.',
      subject: 'Data Structures and Algorithms',
      duration: 60,
      totalMarks: 50,
      passingMarks: 20,
      passingPercentage: 40,
      questions: exam3Questions,
      questionCount: exam3Questions.length,
      randomizeQuestions: true,
      randomizeOptions: true,
      negativeMarking: true,
      negativeMarkValue: 0.25,
      status: 'live',
      difficultyLevel: 'Comprehensive',
      instructions: [
        'University Final Examination for DSA.',
        '60 Minutes | 50 Questions | 50 Marks.',
        'Grading scale: 90%+ (A+), 80%+ (A), 70%+ (B+), 60%+ (B), 50%+ (C), 40%+ (D), Below 40% (F).',
        'Auto-evaluates immediately upon submission.',
      ],
      createdBy: adminUser._id,
    });

    // 6. Create Historical Attempts for Student to populate Analytics & Result charts
    console.log('📊 Seeding initial evaluated attempt for demo student...');
    const sampleQuestions = await Question.find({ _id: { $in: exam1Questions } });
    const sampleAnswers = sampleQuestions.map((q, idx) => {
      // 26 correct, 4 wrong
      const isCorrect = idx < 26;
      return {
        question: q._id,
        selectedAnswer: isCorrect ? q.correctAnswer : (q.correctAnswer === 'A' ? 'B' : 'A'),
        isCorrect,
        marksAwarded: isCorrect ? 1 : -0.25,
        status: 'answered',
        timeSpentSeconds: 40 + (idx % 20),
      };
    });

    const sampleAttempt = await ExamAttempt.create({
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
      obtainedMarks: 25.0, // 26 - (4 * 0.25)
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
      antiCheatingLogs: {
        tabSwitchCount: 1,
        fullscreenExitCount: 0,
        copyAttemptCount: 0,
        pasteAttemptCount: 0,
        rightClickCount: 0,
        events: [
          {
            eventType: 'tab_switch',
            timestamp: new Date(Date.now() - 2500000),
            details: 'Student switched browser tab for 3 seconds.',
          },
        ],
      },
    });

    // 7. Seed Achievements
    console.log('🏆 Seeding DSA Badges & Achievements...');
    await Achievement.insertMany([
      {
        badgeKey: 'first_exam',
        title: 'First Battle',
        description: 'Completed your first DSA examination on CodeArena.',
        icon: 'Shield',
        category: 'Exams',
      },
      {
        badgeKey: 'high_scorer',
        title: 'DSA Prodigy',
        description: 'Scored 90%+ in a timed examination.',
        icon: 'Award',
        category: 'Accuracy',
      },
      {
        badgeKey: 'streak_master',
        title: 'Consistent Learner',
        description: 'Maintained a 5-day active study streak.',
        icon: 'Flame',
        category: 'Streak',
      },
      {
        badgeKey: 'half_century',
        title: '50 Problems Solved',
        description: 'Successfully answered 50+ DSA problems correctly.',
        icon: 'Target',
        category: 'Topic_Mastery',
      },
      {
        badgeKey: 'speed_demon',
        title: 'Speed Demon',
        description: 'Finished a 30-question exam in under 15 minutes with > 80% accuracy.',
        icon: 'Zap',
        category: 'Speed',
      },
    ]);

    // 8. Seed Sample Notification
    await Notification.create({
      recipient: null,
      title: 'New Examination Published: DSA Final Assessment',
      message: 'The comprehensive full-course examination is now live for all CSE batches.',
      type: 'exam_published',
      link: '/exams',
    });

    console.log('====================================================');
    console.log('✨ DATABASE SEEDING COMPLETED SUCCESSFULLY! ✨');
    console.log('====================================================');
    console.log('📋 DEMO CREDENTIALS:');
    console.log('   ADMIN:   admin@codearena.com   /  Admin@123');
    console.log('   FACULTY: faculty@codearena.com /  Faculty@123');
    console.log('   STUDENT: student@codearena.com /  Student@123');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
