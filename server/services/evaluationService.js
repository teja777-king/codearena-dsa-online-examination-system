/**
 * Evaluation Service for Secure Server-Side Exam Processing
 */

const User = require('../models/User');

function calculateGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

/**
 * Compare student's selected answer against question's correctAnswer
 */
function isAnswerCorrect(questionType, selectedAnswer, correctAnswer) {
  if (selectedAnswer === null || selectedAnswer === undefined || selectedAnswer === '') {
    return false;
  }

  if (questionType === 'multiple_select' && Array.isArray(correctAnswer)) {
    if (!Array.isArray(selectedAnswer)) return false;
    if (selectedAnswer.length !== correctAnswer.length) return false;
    const sortedStudent = [...selectedAnswer].map(String).sort();
    const sortedCorrect = [...correctAnswer].map(String).sort();
    return sortedStudent.every((val, idx) => val === sortedCorrect[idx]);
  }

  // True/False or single MCQ or code output
  return String(selectedAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
}

/**
 * Evaluate submitted answers against actual question documents
 */
async function evaluateAttempt({ attempt, exam, questionsMap, studentId }) {
  let totalMarks = 0;
  let obtainedMarks = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  let attemptedCount = 0;

  const topicStats = {}; // { topicName: { total: 0, correct: 0, wrong: 0 } }

  const evaluatedAnswers = attempt.answers.map((ans) => {
    const question = questionsMap[ans.question.toString()];
    if (!question) return ans;

    const qMarks = question.marks || 1;
    const qNeg = exam.negativeMarking ? (question.negativeMarks !== undefined ? question.negativeMarks : (exam.negativeMarkValue || 0.25)) : 0;
    totalMarks += qMarks;

    const topic = question.topicName || 'General DSA';
    if (!topicStats[topic]) {
      topicStats[topic] = { total: 0, correct: 0, wrong: 0 };
    }
    topicStats[topic].total++;

    const hasAnswered = ans.selectedAnswer !== null && ans.selectedAnswer !== undefined && ans.selectedAnswer !== '';

    if (hasAnswered) {
      attemptedCount++;
      const correct = isAnswerCorrect(question.questionType, ans.selectedAnswer, question.correctAnswer);

      if (correct) {
        correctCount++;
        topicStats[topic].correct++;
        obtainedMarks += qMarks;
        return {
          question: ans.question,
          selectedAnswer: ans.selectedAnswer,
          isCorrect: true,
          marksAwarded: qMarks,
          status: 'answered',
          timeSpentSeconds: ans.timeSpentSeconds || 0,
        };
      } else {
        wrongCount++;
        topicStats[topic].wrong++;
        obtainedMarks -= qNeg;
        return {
          question: ans.question,
          selectedAnswer: ans.selectedAnswer,
          isCorrect: false,
          marksAwarded: -qNeg,
          status: 'answered',
          timeSpentSeconds: ans.timeSpentSeconds || 0,
        };
      }
    } else {
      unansweredCount++;
      return {
        question: ans.question,
        selectedAnswer: null,
        isCorrect: false,
        marksAwarded: 0,
        status: 'not_visited',
        timeSpentSeconds: ans.timeSpentSeconds || 0,
      };
    }
  });

  // Ensure totalMarks has minimum 1 to avoid division by zero
  if (totalMarks === 0) totalMarks = exam.totalMarks || 1;
  obtainedMarks = Math.max(0, parseFloat(obtainedMarks.toFixed(2))); // avoid negative total score

  const percentage = parseFloat(((obtainedMarks / totalMarks) * 100).toFixed(2));
  const accuracy = attemptedCount > 0 ? parseFloat(((correctCount / attemptedCount) * 100).toFixed(2)) : 0;
  const grade = calculateGrade(percentage);
  const isPassed = percentage >= (exam.passingPercentage || 40);

  const topicBreakdown = Object.keys(topicStats).map((tName) => ({
    topicName: tName,
    total: topicStats[tName].total,
    correct: topicStats[tName].correct,
    wrong: topicStats[tName].wrong,
    accuracy: topicStats[tName].total > 0
      ? parseFloat(((topicStats[tName].correct / topicStats[tName].total) * 100).toFixed(1))
      : 0,
  }));

  // Update student global statistics
  try {
    const user = await User.findById(studentId);
    if (user) {
      const prevAttempts = user.stats.examsAttempted || 0;
      const newAttempts = prevAttempts + 1;
      const prevTotalScore = user.stats.totalScore || 0;
      const newTotalScore = prevTotalScore + obtainedMarks;
      const newAvgScore = parseFloat((newTotalScore / newAttempts).toFixed(2));
      const newBestScore = Math.max(user.stats.bestScore || 0, obtainedMarks);
      const newTotalSolved = (user.stats.totalQuestionsSolved || 0) + attemptedCount;
      const newTotalCorrect = (user.stats.totalCorrect || 0) + correctCount;
      const newTotalWrong = (user.stats.totalWrong || 0) + wrongCount;
      const newAccuracy = newTotalSolved > 0 ? parseFloat(((newTotalCorrect / newTotalSolved) * 100).toFixed(1)) : 0;

      user.stats = {
        examsAttempted: newAttempts,
        totalScore: newTotalScore,
        averageScore: newAvgScore,
        bestScore: newBestScore,
        totalQuestionsSolved: newTotalSolved,
        totalCorrect: newTotalCorrect,
        totalWrong: newTotalWrong,
        accuracy: newAccuracy,
      };

      // Check badges
      if (newAttempts >= 1 && !user.badges.some((b) => b.badgeKey === 'first_exam')) {
        user.badges.push({
          badgeKey: 'first_exam',
          title: 'First Battle',
          description: 'Completed your first DSA examination on CodeArena.',
          icon: 'Shield',
        });
      }
      if (percentage >= 90 && !user.badges.some((b) => b.badgeKey === 'high_scorer')) {
        user.badges.push({
          badgeKey: 'high_scorer',
          title: 'DSA Prodigy',
          description: 'Scored 90%+ in a timed examination.',
          icon: 'Award',
        });
      }
      if (newTotalCorrect >= 50 && !user.badges.some((b) => b.badgeKey === 'half_century')) {
        user.badges.push({
          badgeKey: 'half_century',
          title: '50 Problems Solved',
          description: 'Successfully answered 50+ DSA problems correctly.',
          icon: 'Target',
        });
      }

      await user.save();
    }
  } catch (userErr) {
    console.error('Error updating user statistics post evaluation:', userErr);
  }

  return {
    evaluatedAnswers,
    totalQuestions: attempt.answers.length,
    attemptedQuestions: attemptedCount,
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    unansweredQuestions: unansweredCount,
    totalMarks,
    obtainedMarks,
    percentage,
    accuracy,
    grade,
    isPassed,
    topicBreakdown,
  };
}

module.exports = {
  calculateGrade,
  isAnswerCorrect,
  evaluateAttempt,
};
