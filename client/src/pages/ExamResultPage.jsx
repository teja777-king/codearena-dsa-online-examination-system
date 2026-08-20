import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  BarChart3,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  AlertCircle,
  HelpCircle,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Badge';

const ExamResultPage = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'correct', 'wrong', 'unanswered'

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/attempts/${attemptId}`);
        if (res.data.success) {
          setAttempt(res.data.attempt);
          setReview(res.data.review || []);
        }
      } catch (err) {
        console.error('Error loading result:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[80vh]" />;
  }

  if (!attempt) {
    return (
      <div className="p-8 text-center text-slate-400">
        Result not found or not yet evaluated.
      </div>
    );
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const filteredReview = review.filter((item) => {
    if (filterType === 'correct') return item.isCorrect;
    if (filterType === 'wrong') return !item.isCorrect && item.selectedAnswer !== null;
    if (filterType === 'unanswered') return item.selectedAnswer === null || item.selectedAnswer === undefined;
    return true;
  });

  const gradeColors = {
    'A+': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'A': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'B+': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    'B': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    'C': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'D': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    'F': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Result Hero Banner */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border-slate-800 relative overflow-hidden bg-gradient-to-r from-dark-900 via-dark-850 to-cyan-950/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold shadow-glow-cyan">
              <Trophy className="w-3.5 h-3.5" />
              <span>Assessment Completed</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {attempt.exam?.title || 'Data Structures & Algorithms Examination'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Submitted on {new Date(attempt.submittedAt || Date.now()).toLocaleDateString()} at{' '}
              {new Date(attempt.submittedAt || Date.now()).toLocaleTimeString()}
            </p>
          </div>

          {/* Large Score Indicator */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-dark-950/90 border border-slate-800 shadow-2xl min-w-[200px]">
            <div className="text-4xl sm:text-5xl font-black gradient-text tracking-tight mb-1">
              {attempt.percentage}%
            </div>
            <div className={`px-4 py-1 rounded-full border text-xs font-extrabold tracking-wide ${gradeColors[attempt.grade] || 'text-brand-400'}`}>
              Grade {attempt.grade} • {attempt.isPassed ? 'PASSED' : 'FAILED'}
            </div>
            <span className="text-[11px] text-slate-500 mt-2 font-mono">
              {attempt.obtainedMarks} / {attempt.totalMarks} Marks
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Questions</span>
          <span className="text-xl font-bold text-white mt-1 block">{attempt.totalQuestions}</span>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Attempted</span>
          <span className="text-xl font-bold text-cyan-300 mt-1 block">{attempt.attemptedQuestions}</span>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Correct</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{attempt.correctAnswers}</span>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Wrong</span>
          <span className="text-xl font-bold text-rose-400 mt-1 block">{attempt.wrongAnswers}</span>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Accuracy</span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">{attempt.accuracy}%</span>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Time Taken</span>
          <span className="text-xl font-bold text-purple-400 mt-1 block">{formatTime(attempt.timeTakenSeconds || 0)}</span>
        </div>
      </div>

      {/* Topic Breakdown Chart */}
      {attempt.topicBreakdown && attempt.topicBreakdown.length > 0 && (
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-base font-bold text-white mb-4">Topic Performance Breakdown</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attempt.topicBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="topicName" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#070B16',
                    borderColor: '#1E293B',
                    borderRadius: '10px',
                  }}
                />
                <Bar dataKey="accuracy" name="Accuracy (%)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Question-by-Question Review Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-white">Question-by-Question Review</h2>
            <p className="text-xs text-slate-400 mt-0.5">Inspect your answers, correct options, and detailed DSA explanations</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-dark-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${filterType === 'all' ? 'bg-brand-500 text-dark-950' : 'text-slate-400 hover:text-white'}`}
            >
              All ({review.length})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${filterType === 'correct' ? 'bg-emerald-500 text-dark-950' : 'text-slate-400 hover:text-white'}`}
            >
              Correct ({attempt.correctAnswers})
            </button>
            <button
              onClick={() => setFilterType('wrong')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${filterType === 'wrong' ? 'bg-rose-500 text-dark-950' : 'text-slate-400 hover:text-white'}`}
            >
              Wrong ({attempt.wrongAnswers})
            </button>
            <button
              onClick={() => setFilterType('unanswered')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${filterType === 'unanswered' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Skipped ({attempt.unansweredQuestions})
            </button>
          </div>
        </div>

        {/* List of Review Cards */}
        <div className="space-y-4">
          {filteredReview.map((q, idx) => {
            const hasAnswered = q.selectedAnswer !== null && q.selectedAnswer !== undefined && q.selectedAnswer !== '';
            return (
              <div
                key={q.questionId || idx}
                className="glass-card p-6 rounded-2xl border-slate-800 space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-400 text-sm">
                      Q{q.index || idx + 1}.
                    </span>
                    <Badge variant={q.difficulty?.toLowerCase()} size="sm">
                      {q.difficulty?.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">{q.topicName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.isCorrect ? (
                      <Badge variant="gradeA" size="sm">
                        +{q.marksAwarded} Marks
                      </Badge>
                    ) : hasAnswered ? (
                      <Badge variant="hard" size="sm">
                        {q.marksAwarded} Marks
                      </Badge>
                    ) : (
                      <Badge variant="draft" size="sm">
                        0 Marks (Unanswered)
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                  {q.questionText}
                </p>

                {/* Code Snippet */}
                {q.codeSnippet && (
                  <div className="rounded-xl bg-dark-950/90 border border-slate-800 p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
                    <pre className="whitespace-pre">{q.codeSnippet}</pre>
                  </div>
                )}

                {/* Options List with Color Coding */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {(q.options || []).map((opt) => {
                    const isSelected = q.selectedAnswer === opt.id;
                    const isCorrect = q.correctAnswer === opt.id;

                    let optClass = 'bg-dark-950/60 border-slate-800 text-slate-400';
                    if (isCorrect) {
                      optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold shadow-glow-green';
                    } else if (isSelected && !isCorrect) {
                      optClass = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${optClass}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-dark-950 flex items-center justify-center font-bold flex-shrink-0">
                          {opt.id}
                        </span>
                        <span className="flex-1 pt-0.5">{opt.text}</span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800 text-xs leading-relaxed text-slate-300">
                  <div className="flex items-center gap-1.5 text-brand-400 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explanation:</span>
                  </div>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800">
        <Link to="/dashboard">
          <Button variant="secondary" size="md">
            ← Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/practice">
            <Button variant="outline" size="md" icon={Target}>
              Practice Weak Topics
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="primary" size="md" icon={Trophy} className="shadow-glow-cyan">
              View Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamResultPage;
