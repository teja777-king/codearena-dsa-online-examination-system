import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Button from '../common/Button';
import { Badge } from '../common/Badge';

const ExamHeader = ({
  examTitle,
  remainingSeconds,
  totalQuestions,
  answeredCount,
  markedCount,
  tabSwitches = 0,
  onSubmitClick,
}) => {
  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (secs <= 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Color-coded urgency
  const isDanger = remainingSeconds <= 60; // < 1 min
  const isWarning = remainingSeconds <= 300 && remainingSeconds > 60; // < 5 min

  const timerColor = isDanger
    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse'
    : isWarning
    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
    : 'bg-brand-500/15 text-brand-300 border-brand-500/40';

  return (
    <div className="bg-dark-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sticky top-0 z-30 shadow-md">
      {/* Exam Title & Stats */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-md">
            {examTitle}
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> {answeredCount}/{totalQuestions} Answered
            </span>
            {markedCount > 0 && (
              <span className="text-amber-400">
                • {markedCount} For Review
              </span>
            )}
            {tabSwitches > 0 && (
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" /> {tabSwitches} Warning{tabSwitches > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Timer & Submit Button */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-base sm:text-lg font-bold tracking-wider transition-colors ${timerColor}`}
        >
          <Clock className={`w-5 h-5 ${isDanger ? 'text-rose-400 animate-spin' : isWarning ? 'text-amber-400' : 'text-brand-400'}`} />
          <span>{formatTime(remainingSeconds)}</span>
        </div>

        {/* Submit Exam Button */}
        <Button
          variant="primary"
          size="md"
          onClick={onSubmitClick}
          className="shadow-glow-cyan"
        >
          Submit Exam
        </Button>
      </div>
    </div>
  );
};

export default ExamHeader;
