import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  FileText,
  HelpCircle,
  BarChart3,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  ShieldAlert,
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

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/analytics/admin');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error loading admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[80vh]" />;
  }

  const stats = data?.stats || {};
  const topicPerformance = data?.topicPerformance || [];
  const recentAttempts = data?.recentAttempts || [];
  const recentUsers = data?.recentUsers || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Admin Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 bg-gradient-to-r from-dark-900 via-dark-850 to-purple-950/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-3 shadow-glow-blue">
              <Shield className="w-3.5 h-3.5" />
              <span>Administrative Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              System Control Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Real-time monitoring of registered students, question banks, scheduled examinations, and student anti-cheating audit trails.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin/questions">
              <Button variant="primary" size="md" icon={Plus} className="shadow-glow-cyan">
                New Question
              </Button>
            </Link>
            <Link to="/admin/exams">
              <Button variant="secondary" size="md" icon={FileText}>
                Create Exam
              </Button>
            </Link>
            <Link to="/admin/attempts">
              <Button variant="outline" size="md" icon={ShieldAlert}>
                Audit Logs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Students</span>
          <span className="text-2xl font-black text-white mt-1 block">{stats.totalStudents || 0}</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Faculty</span>
          <span className="text-2xl font-black text-purple-400 mt-1 block">{stats.totalFaculty || 0}</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Questions Bank</span>
          <span className="text-2xl font-black text-brand-400 mt-1 block">{stats.totalQuestions || 0}</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Examinations</span>
          <span className="text-2xl font-black text-blue-400 mt-1 block">{stats.totalExams || 0}</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Submissions</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats.totalEvaluated || 0}</span>
        </div>

        <div className="glass-card p-4 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">System Avg</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{stats.systemAverageScore || 0}%</span>
        </div>
      </div>

      {/* Analytics Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Performance BarChart (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">System-Wide Topic Accuracy</h3>
              <p className="text-xs text-slate-400">Aggregated performance across all student attempts</p>
            </div>
            <Badge variant="primary" size="sm">Global Metrics</Badge>
          </div>

          <div className="h-64 w-full">
            {topicPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="topic" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070B16',
                      borderColor: '#1E293B',
                      borderRadius: '10px',
                    }}
                  />
                  <Bar dataKey="accuracy" name="Accuracy (%)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Awaiting more examination submissions to chart topic distributions.
              </div>
            )}
          </div>
        </div>

        {/* Recently Registered Users (1 Col) */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Recent Registrations</h3>
            <Link to="/admin/students" className="text-xs text-brand-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div
                key={u._id}
                className="p-3 rounded-xl bg-dark-950/60 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-white">{u.name}</div>
                  <div className="text-[10px] text-slate-400">{u.email}</div>
                </div>
                <Badge variant={u.role === 'admin' ? 'hard' : u.role === 'faculty' ? 'blue' : 'primary'} size="sm">
                  {u.role?.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Student Examination Submissions & Anti-Cheating Flag Table */}
      <div className="glass-card rounded-2xl overflow-hidden border-slate-800">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Examination Submissions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live student submissions with evaluation status and security flags</p>
          </div>
          <Link to="/admin/attempts">
            <Button variant="ghost" size="sm">View All Submissions →</Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Student</th>
                <th className="py-3.5 px-4 font-bold">Exam Title</th>
                <th className="py-3.5 px-4 font-bold">Score</th>
                <th className="py-3.5 px-4 font-bold">Grade</th>
                <th className="py-3.5 px-4 font-bold">Anti-Cheating Flags</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
              {recentAttempts.map((att) => {
                const logs = att.antiCheatingLogs || {};
                const totalFlags = (logs.tabSwitchCount || 0) + (logs.fullscreenExitCount || 0) + (logs.copyAttemptCount || 0);

                return (
                  <tr key={att._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{att.student?.name || 'Student'}</div>
                      <div className="text-[10px] text-slate-500">{att.student?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {att.exam?.title || 'DSA Assessment'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-400 font-mono">
                      {att.obtainedMarks} / {att.totalMarks} ({att.percentage}%)
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={`grade${att.grade?.charAt(0) || 'A'}`} size="sm">
                        Grade {att.grade}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      {totalFlags > 0 ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-xs bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                          <ShieldAlert className="w-3.5 h-3.5" /> {totalFlags} Incident{totalFlags > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Clean Record
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/admin/attempt/${att._id}`}>
                        <Button variant="outline" size="sm">
                          Inspect Audit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
