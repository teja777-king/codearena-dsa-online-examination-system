/**
 * Randomization Service using Fisher-Yates Shuffle Algorithm
 */

// Fisher-Yates Shuffle implementation
function fisherYatesShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate randomized question order and option order for an exam attempt
 * @param {Array} questions - Array of Question documents/objects
 * @param {Boolean} randomizeQuestions - Whether to shuffle question order
 * @param {Boolean} randomizeOptions - Whether to shuffle option order
 */
function prepareExamSession(questions, randomizeQuestions = true, randomizeOptions = true) {
  let orderedQuestions = [...questions];
  if (randomizeQuestions) {
    orderedQuestions = fisherYatesShuffle(orderedQuestions);
  }

  const questionOrder = orderedQuestions.map((q) => {
    let optionOrder = (q.options || []).map((opt) => opt.id);
    if (randomizeOptions && optionOrder.length > 0) {
      optionOrder = fisherYatesShuffle(optionOrder);
    }
    return {
      questionId: q._id,
      optionOrder,
    };
  });

  return {
    orderedQuestions,
    questionOrder,
  };
}

module.exports = {
  fisherYatesShuffle,
  prepareExamSession,
};
