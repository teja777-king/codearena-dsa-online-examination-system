import React from 'react';
import { ChevronLeft, ChevronRight, Bookmark, RotateCcw, Check } from 'lucide-react';
import Button from '../common/Button';
import { Badge } from '../common/Badge';

const QuestionCard = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isMarkedForReview,
  onSelectOption,
  onClearAnswer,
  onToggleMarkForReview,
  onPrevious,
  onNext,
  isFirst,
  isLast,
}) => {
  if (!question) return null;

  const isMultipleSelect = question.questionType === 'multiple_select';

  const handleOptionClick = (optionId) => {
    if (isMultipleSelect) {
      let currentSelection = Array.isArray(selectedAnswer) ? [...selectedAnswer] : [];
      if (currentSelection.includes(optionId)) {
        currentSelection = currentSelection.filter((id) => id !== optionId);
      } else {
        currentSelection.push(optionId);
      }
      onSelectOption(currentSelection.length > 0 ? currentSelection : null);
    } else {
      onSelectOption(optionId);
    }
  };

  const isOptionSelected = (optionId) => {
    if (isMultipleSelect) {
      return Array.isArray(selectedAnswer) && selectedAnswer.includes(optionId);
    }
    return selectedAnswer === optionId;
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between min-h-[500px]">
      {/* Top Meta Bar */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-brand-400">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <Badge variant={question.difficulty || 'medium'} size="sm">
              {question.difficulty?.toUpperCase()}
            </Badge>
            <Badge variant="blue" size="sm">
              {question.topicName}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-emerald-400">+{question.marks || 1} Mark</span>
            {question.negativeMarks > 0 && (
              <span className="text-rose-400">-{question.negativeMarks} Neg</span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed mb-4">
          {question.questionText}
        </div>

        {/* Code Snippet Block if any */}
        {question.codeSnippet && (
          <div className="mb-6 rounded-xl bg-dark-950/90 border border-slate-800 p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto shadow-inner">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 select-none">
              {question.codeLanguage || 'C++'} Code
            </div>
            <pre className="whitespace-pre">{question.codeSnippet}</pre>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 mt-6">
          {(question.options || []).map((opt) => {
            const selected = isOptionSelected(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleOptionClick(opt.id)}
                className={`w-full p-4 rounded-xl text-left border transition-all duration-200 flex items-start gap-3.5 group ${
                  selected
                    ? 'bg-brand-500/15 border-brand-500 text-white shadow-glow-cyan'
                    : 'bg-dark-850/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                {/* Option Identifier Badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                    selected
                      ? 'bg-brand-500 text-dark-950'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {selected ? <Check className="w-4 h-4 stroke-[3]" /> : opt.id}
                </div>

                {/* Option Text */}
                <div className="flex-1 text-sm font-medium pt-0.5 leading-snug">
                  {opt.text}
                  {opt.code && (
                    <code className="block mt-1 p-1 bg-dark-950 rounded text-cyan-300 font-mono text-xs">
                      {opt.code}
                    </code>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="pt-6 mt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Left Actions (Clear & Mark) */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAnswer}
            disabled={!selectedAnswer}
            icon={RotateCcw}
          >
            Clear
          </Button>
          <Button
            variant={isMarkedForReview ? 'secondary' : 'ghost'}
            size="sm"
            onClick={onToggleMarkForReview}
            className={isMarkedForReview ? 'text-amber-400 border-amber-500/40' : ''}
            icon={Bookmark}
          >
            {isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
          </Button>
        </div>

        {/* Right Navigation (Previous & Save & Next) */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={onPrevious}
            disabled={isFirst}
            icon={ChevronLeft}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onNext}
            className="shadow-glow-cyan"
          >
            {isLast ? 'Save & Review' : 'Save & Next'} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
