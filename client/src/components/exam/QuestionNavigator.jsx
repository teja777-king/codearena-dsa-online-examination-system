import React from 'react';

const QuestionNavigator = ({
  questions = [],
  answers = {},
  currentIndex,
  onSelectQuestion,
}) => {
  // Counts
  let notVisitedCount = 0;
  let visitedCount = 0;
  let answeredCount = 0;
  let markedCount = 0;
  let answeredAndMarkedCount = 0;

  questions.forEach((q, idx) => {
    const ans = answers[q._id] || {};
    const hasAnswered = ans.selectedAnswer !== null && ans.selectedAnswer !== undefined && ans.selectedAnswer !== '';
    const isMarked = ans.isMarkedForReview;

    if (hasAnswered && isMarked) answeredAndMarkedCount++;
    else if (hasAnswered) answeredCount++;
    else if (isMarked) markedCount++;
    else if (ans.status === 'visited') visitedCount++;
    else notVisitedCount++;
  });

  const getButtonClass = (q, idx) => {
    const ans = answers[q._id] || {};
    const hasAnswered = ans.selectedAnswer !== null && ans.selectedAnswer !== undefined && ans.selectedAnswer !== '';
    const isMarked = ans.isMarkedForReview;
    const isCurrent = currentIndex === idx;

    const base = 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all border';
    const activeRing = isCurrent ? 'ring-2 ring-brand-400 ring-offset-2 ring-offset-dark-950 scale-105 z-10' : '';

    if (hasAnswered && isMarked) {
      return `${base} ${activeRing} bg-purple-500/25 border-purple-500 text-purple-200`;
    }
    if (hasAnswered) {
      return `${base} ${activeRing} bg-emerald-500/25 border-emerald-500 text-emerald-200`;
    }
    if (isMarked) {
      return `${base} ${activeRing} bg-amber-500/25 border-amber-500 text-amber-200`;
    }
    if (ans.status === 'visited') {
      return `${base} ${activeRing} bg-blue-500/20 border-blue-500/50 text-blue-300`;
    }
    return `${base} ${activeRing} bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700`;
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center justify-between">
        <span>Question Palette</span>
        <span className="text-xs text-brand-400">{questions.length} Total</span>
      </h3>

      {/* Status Legends */}
      <div className="grid grid-cols-2 gap-2 text-[11px] pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2 text-amber-400">
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span>Marked ({markedCount})</span>
        </div>
        <div className="flex items-center gap-2 text-blue-400">
          <span className="w-3 h-3 rounded-full bg-blue-500/80" />
          <span>Visited ({visitedCount})</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-3 h-3 rounded-full bg-slate-700" />
          <span>Not Visited ({notVisitedCount})</span>
        </div>
      </div>

      {/* Grid of Question Buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
        {questions.map((q, idx) => (
          <button
            key={q._id || idx}
            type="button"
            onClick={() => onSelectQuestion(idx)}
            className={getButtonClass(q, idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionNavigator;
