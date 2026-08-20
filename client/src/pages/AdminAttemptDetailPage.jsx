import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  ArrowLeft,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Badge';

const AdminAttemptDetailPage = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await api.get(`/attempts/${id}`);
        if (res.data.success) {
          setAttempt(res.data.attempt);
          setReview(res.data.review || []);
        }
      } catch (err) {
        console.error('Error loading attempt detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[80vh]" />;
  }

  if (!attempt) {
    return <div className="p-8 text-center text-slate-400">Attempt not found.</div>;
  }

  const logs = attempt.antiCheatingLogs || {};
  const events = logs.events || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link to="/admin/attempts">
          <Button variant="secondary" size="sm" icon={ArrowLeft}>
            Back to Submissions
          </Button>
        </Link>
        <Badge variant={attempt.isPassed ? 'easy' : 'hard'} size="md">
          {attempt.isPassed ? 'EXAMINATION PASSED' : 'EXAMINATION FAILED'}
        </Badge>
      </div>

      {/* Student & Exam Info Card */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">
            Submission Audit Record
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {attempt.exam?.title || 'Data Structures & Algorithms Exam'}
          </h1>
          <p className="text-xs text-slate-400">
            Student: <strong className="text-white">{attempt.student?.name}</strong> ({attempt.student?.email}) • ID: {attempt.student?.studentId}
          </p>
        </div>

        {/* Score Pill */}
        <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 text-center min-w-[160px]">
          <div className="text-2xl font-black text-brand-400">{attempt.obtainedMarks} / {attempt.totalMarks}</div>
          <div className="text-xs font-bold text-white mt-0.5">{attempt.percentage}% • Grade {attempt.grade}</div>
        </div>
      </div>

      {/* Anti-Cheating Security Audit Trail */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-rose-500/30 bg-rose-500/5 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>Anti-Cheating Security Audit Trail</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-amber-400 font-bold">{logs.tabSwitchCount || 0} Tab Switches</span>
            <span className="text-slate-500">•</span>
            <span className="text-rose-400 font-bold">{logs.fullscreenExitCount || 0} Fullscreen Exits</span>
            <span className="text-slate-500">•</span>
            <span className="text-purple-400 font-bold">{logs.copyAttemptCount || 0} Copy Attempts</span>
          </div>
        </div>

        {/* Event Timeline */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {events.map((evt, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-dark-950/90 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-slate-200 capitalize">
                    {evt.eventType?.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400 block">{evt.details || 'Incident recorded by security monitor.'}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-6 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero security infractions recorded during this session.</span>
            </div>
          )}
        </div>
      </div>

      {/* Answer Audit List */}
      <div className="glass-card p-6 rounded-2xl border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white mb-2">Student Response Breakdown</h3>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {review.map((q, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-dark-950/70 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Q{idx + 1}. {q.questionText}</span>
                <Badge variant={q.isCorrect ? 'gradeA' : 'hard'} size="sm">
                  {q.isCorrect ? `+${q.marksAwarded} Marks` : `${q.marksAwarded} Marks`}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-2">
                <div className="p-2 rounded bg-dark-900 border border-slate-800">
                  <span className="text-slate-500">Selected Answer: </span>
                  <strong className={q.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                    {q.selectedAnswer || 'Not Answered'}
                  </strong>
                </div>
                <div className="p-2 rounded bg-dark-900 border border-slate-800">
                  <span className="text-slate-500">Correct Answer: </span>
                  <strong className="text-emerald-400">{q.correctAnswer}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAttemptDetailPage;
