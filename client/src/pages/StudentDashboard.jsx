import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  AlertCircle,
  Play,
  FileText,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Badge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [exams, setExams] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, examsRes, attemptsRes] = await Promise.all([
          api.get('/analytics/student'),
          api.get('/exams'),
          api.get('/attempts/my-attempts'),
        ]);

        if (analyticsRes.data.success) {
          setAnalytics(analyticsRes.data);
        }
        if (examsRes.data.success) {
          setExams(examsRes.data.exams);
        }
        if (attemptsRes.data.success) {
          setRecentAttempts(attemptsRes.data.attempts);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[70vh]" />;
  }

  const stats = user?.stats || {};
  const scoreTrend = analytics?.analytics?.scoreTrend || [];
  const topicPerformance = analytics?.analytics?.topicPerformance || [];
  const weakAreas = analytics?.analytics?.weakAreas || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden bg-gradient-to-r from-dark-900 via-dark-850 to-brand-950/40 border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
                Student Learning Center
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {user?.streakCount || 1} Day Streak
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {user?.college} • {user?.course} ({user?.year})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/exams">
              <Button variant="primary" size="md" icon={FileText} className="shadow-glow-cyan">
                Take Examination
              </Button>
            </Link>
            <Link to="/practice">
              <Button variant="secondary" size="md" icon={Target}>
                Practice Mode
              </Button>
            </Link>
            <Link to="/visualizer">
              <Button variant="outline" size="md" icon={Play}>
                Visualizer
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Exams Taken
          </div>
          <div className="text-2xl font-black text-white">{stats.examsAttempted || 0}</div>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Avg Score
          </div>
          <div className="text-2xl font-black text-brand-400">{stats.averageScore || 0}</div>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Best Score
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.bestScore || 0}</div>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Accuracy
          </div>
          <div className="text-2xl font-black text-cyan-300">{stats.accuracy || 0}%</div>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Problems Solved
          </div>
          <div className="text-2xl font-black text-purple-400">{stats.totalCorrect || stats.totalQuestionsSolved || 0}</div>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Current Streak
          </div>
          <div className="text-2xl font-black text-amber-400 flex items-center gap-1">
            <Flame className="w-5 h-5 fill-amber-400" /> {user?.streakCount || 1}d
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Progression Trend */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Score Performance Trend</h3>
              <p className="text-xs text-slate-400">Score percentage across examination attempts</p>
            </div>
            <Link to="/analytics" className="text-xs text-brand-400 hover:underline">
              Detailed Analytics →
            </Link>
          </div>

          <div className="h-64 w-full">
            {scoreTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreTrend}>
                  <defs>
                    <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070B16',
                      borderColor: '#1E293B',
                      borderRadius: '10px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="percentage"
                    name="Percentage (%)"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Complete your first examination to view performance charts.
              </div>
            )}
          </div>
        </div>

        {/* Topic Mastery Breakdown */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">DSA Topic Accuracy</h3>
              <p className="text-xs text-slate-400">Accuracy rate by major curriculum category</p>
            </div>
            <Badge variant="primary" size="sm">
              Live Mastery
            </Badge>
          </div>

          <div className="h-64 w-full">
            {topicPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="topic" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070B16',
                      borderColor: '#1E293B',
                      borderRadius: '10px',
                    }}
                  />
                  <Bar dataKey="accuracy" name="Accuracy (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No topic data yet. Start practice or exam questions to generate radar.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Practice & Weak Areas */}
      {weakAreas.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
            <AlertCircle className="w-4 h-4" />
            <span>Recommended Practice (Identified Weak Topics)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakAreas.map((area, idx) => (
              <div key={idx} className="glass-card p-4 rounded-xl bg-dark-950/80 border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-sm">{area.topic}</span>
                    <Badge variant="hard" size="sm">
                      {area.accuracy}% Accuracy
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 mb-3">{area.recommendation}</p>
                </div>
                <Link to={`/practice?topic=${encodeURIComponent(area.topic)}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Practice {area.topic} Now
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Examinations & Recent Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Exams (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Active Examinations</h3>
            <Link to="/exams" className="text-xs text-brand-400 hover:underline">
              View All Exams →
            </Link>
          </div>

          <div className="space-y-3">
            {exams.slice(0, 3).map((exam) => (
              <div
                key={exam._id}
                className="p-4 rounded-xl bg-dark-950/60 border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white text-sm">{exam.title}</h4>
                    <Badge variant="live" size="sm">
                      LIVE
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-400" /> {exam.duration} Mins
                    </span>
                    <span>• {exam.questionCount || 30} Questions</span>
                    <span>• Pass: {exam.passingMarks} Marks</span>
                  </div>
                </div>

                <Link to={`/exam/${exam._id}/take`}>
                  <Button variant="primary" size="sm" className="w-full sm:w-auto shadow-glow-cyan">
                    Start Exam
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results (1 Col) */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Recent Results</h3>
            <span className="text-xs text-slate-400">{recentAttempts.length} Submissions</span>
          </div>

          <div className="space-y-3">
            {recentAttempts.slice(0, 4).map((att) => (
              <Link
                key={att._id}
                to={`/exam/result/${att._id}`}
                className="block p-3.5 rounded-xl bg-dark-950/60 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-200 truncate max-w-[150px]">
                    {att.exam?.title || 'DSA Examination'}
                  </span>
                  <Badge variant={`grade${att.grade?.charAt(0) || 'A'}`} size="sm">
                    Grade {att.grade}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Score: {att.obtainedMarks}/{att.totalMarks} ({att.percentage}%)</span>
                  <span className="text-brand-400 font-semibold">Review →</span>
                </div>
              </Link>
            ))}

            {recentAttempts.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-6">
                No examination attempts yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Badges Gallery */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Earned DSA Achievements & Badges</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {(user?.badges || []).map((badge, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-dark-950/80 border border-slate-800 text-center flex flex-col items-center justify-center hover:border-brand-500/40 transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2 shadow-glow-amber">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-200 mb-1">{badge.title}</h4>
              <p className="text-[10px] text-slate-400 leading-snug">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
