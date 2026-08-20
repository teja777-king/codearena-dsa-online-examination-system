/**
 * Analytics Service for computing performance insights and weak-area diagnosis
 */

const ExamAttempt = require('../models/ExamAttempt');

async function getStudentDetailedAnalytics(studentId) {
  const attempts = await ExamAttempt.find({
    student: studentId,
    status: { $in: ['evaluated', 'submitted', 'timed_out'] },
  })
    .populate('exam', 'title duration totalMarks difficultyLevel')
    .sort({ submittedAt: 1 });

  if (!attempts || attempts.length === 0) {
    return {
      totalAttempts: 0,
      scoreTrend: [],
      topicPerformance: [],
      difficultyPerformance: [
        { difficulty: 'Easy', accuracy: 0, count: 0 },
        { difficulty: 'Medium', accuracy: 0, count: 0 },
        { difficulty: 'Hard', accuracy: 0, count: 0 },
      ],
      weakAreas: [],
      strongAreas: [],
      averageTimePerQuestion: 0,
      improvementPercentage: 0,
    };
  }

  // 1. Score Trend
  const scoreTrend = attempts.map((att, idx) => ({
    attemptNumber: idx + 1,
    examTitle: att.exam ? att.exam.title : `Attempt ${idx + 1}`,
    score: att.obtainedMarks,
    totalMarks: att.totalMarks,
    percentage: att.percentage,
    accuracy: att.accuracy,
    date: att.submittedAt ? att.submittedAt.toISOString().split('T')[0] : 'N/A',
  }));

  // 2. Aggregate Topic Performance across all attempts
  const topicMap = {};
  let totalTimeSpent = 0;
  let totalQuestionsAnswered = 0;

  attempts.forEach((att) => {
    (att.topicBreakdown || []).forEach((item) => {
      if (!topicMap[item.topicName]) {
        topicMap[item.topicName] = { total: 0, correct: 0, wrong: 0 };
      }
      topicMap[item.topicName].total += item.total || 0;
      topicMap[item.topicName].correct += item.correct || 0;
      topicMap[item.topicName].wrong += item.wrong || 0;
    });

    (att.answers || []).forEach((ans) => {
      if (ans.timeSpentSeconds) totalTimeSpent += ans.timeSpentSeconds;
      if (ans.status === 'answered') totalQuestionsAnswered++;
    });
  });

  const topicPerformance = Object.keys(topicMap).map((topic) => {
    const data = topicMap[topic];
    const acc = data.total > 0 ? parseFloat(((data.correct / data.total) * 100).toFixed(1)) : 0;
    return {
      topic,
      total: data.total,
      correct: data.correct,
      wrong: data.wrong,
      accuracy: acc,
    };
  });

  // Sort topics by accuracy
  const sortedTopics = [...topicPerformance].sort((a, b) => a.accuracy - b.accuracy);
  const weakAreas = sortedTopics
    .filter((t) => t.accuracy < 60)
    .map((t) => ({
      topic: t.topic,
      accuracy: t.accuracy,
      recommendation: `Recommended: Practice more fundamental and intermediate ${t.topic} problems. Focus on core edge cases and time complexities.`,
    }));

  const strongAreas = sortedTopics
    .filter((t) => t.accuracy >= 70)
    .map((t) => ({
      topic: t.topic,
      accuracy: t.accuracy,
    }));

  // 3. Improvement calculation: compare first 3 vs last 3 attempts
  let improvementPercentage = 0;
  if (attempts.length >= 2) {
    const firstScore = attempts[0].percentage || 0;
    const lastScore = attempts[attempts.length - 1].percentage || 0;
    improvementPercentage = parseFloat((lastScore - firstScore).toFixed(1));
  }

  const averageTimePerQuestion =
    totalQuestionsAnswered > 0 ? Math.round(totalTimeSpent / totalQuestionsAnswered) : 45;

  return {
    totalAttempts: attempts.length,
    scoreTrend,
    topicPerformance,
    weakAreas,
    strongAreas,
    averageTimePerQuestion,
    improvementPercentage,
  };
}

module.exports = {
  getStudentDetailedAnalytics,
};
