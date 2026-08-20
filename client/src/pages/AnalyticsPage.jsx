import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Award,
  Clock,
  Target,
  Zap,
  CheckCircle2,
  Layers,
  ArrowUpRight,
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
import api from '../services/api';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Badge';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/student');
        if (res.data.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error('Error loading student analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[80vh]" />;
  }

  const data = analytics?.analytics || {};
  const stats = analytics?.stats || {};
  const scoreTrend = data.scoreTrend || [];
  const topicPerformance = data.topicPerformance || [];
  const weakAreas = data.weakAreas || [];
  const strongAreas = data.strongAreas || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 bg-gradient-to-r from-dark-900 via-dark-850 to-blue-950/30">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>AI Learning Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Performance Analytics & Diagnosis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            In-depth statistical insights analyzing your time management, accuracy trends, and topic competencies across all DSA examination submissions.
          </p>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Attempts</span>
          <span className="text-2xl font-black text-white mt-1 block">{data.totalAttempts || 0}</span>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Avg Accuracy</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats.accuracy || 0}%</span>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Avg Time / Q</span>
          <span className="text-2xl font-black text-cyan-300 mt-1 block">{data.averageTimePerQuestion || 45}s</span>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Score Trajectory</span>
          <span className={`text-2xl font-black mt-1 flex items-center gap-1 ${data.improvementPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {data.improvementPercentage >= 0 ? `+${data.improvementPercentage}%` : `${data.improvementPercentage}%`}
            <ArrowUpRight className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend Over Time */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Score Progression History</h3>
            <Badge variant="primary" size="sm">Trend</Badge>
          </div>
          <div className="h-64 w-full">
            {scoreTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreTrend}>
                  <defs>
                    <linearGradient id="analyticsGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
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
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="percentage"
                    name="Score (%)"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#analyticsGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Complete an examination to populate historical trends.
              </div>
            )}
          </div>
        </div>

        {/* Topic Mastery Radar */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Topic Competency Radar</h3>
            <Badge variant="blue" size="sm">Mastery</Badge>
          </div>
          <div className="h-64 w-full">
            {topicPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={topicPerformance}>
                  <PolarGrid stroke="#1E293B" />
                  <PolarAngleAxis dataKey="topic" stroke="#94A3B8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                  <Radar name="Accuracy" dataKey="accuracy" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: '#070B16', borderColor: '#1E293B' }} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Topic competency data will populate after your exams.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weak Areas Diagnosis & Practice Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Areas Card */}
        <div className="glass-card p-6 rounded-2xl border-rose-500/20 bg-rose-500/5">
          <h3 className="text-base font-bold text-rose-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Identified Weak Competencies (&lt; 60% Accuracy)</span>
          </h3>

          <div className="space-y-3">
            {weakAreas.map((w, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-dark-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">{w.topic}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{w.recommendation}</div>
                </div>
                <Link to={`/practice?topic=${encodeURIComponent(w.topic)}`}>
                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    Practice
                  </Button>
                </Link>
              </div>
            ))}

            {weakAreas.length === 0 && (
              <div className="text-xs text-slate-400 py-4 text-center">
                ✨ Excellent mastery! No severe weak competencies detected.
              </div>
            )}
          </div>
        </div>

        {/* Strong Areas Card */}
        <div className="glass-card p-6 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
          <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Mastered Topics (&gt;= 70% Accuracy)</span>
          </h3>

          <div className="space-y-3">
            {strongAreas.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-dark-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">{s.topic}</div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">{s.accuracy}% Accuracy Rate</div>
                </div>
                <Badge variant="easy" size="sm">Mastered</Badge>
              </div>
            ))}

            {strongAreas.length === 0 && (
              <div className="text-xs text-slate-400 py-4 text-center">
                Continue attempting questions to build up topic mastery certificates.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
