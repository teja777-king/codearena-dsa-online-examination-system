import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Badge';

const AdminAttemptsListPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/attempts', { params: { page, limit: 12 } });
      if (res.data.success) {
        setAttempts(res.data.attempts);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error loading attempts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, [page]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Integrity & Submission Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Exam Submissions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review completed assessments, evaluated marks, and security audit logs across all examinations.
          </p>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="glass-card rounded-2xl overflow-hidden border-slate-800">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Examination Attempt Log</span>
          <span>Page {page} of {totalPages || 1}</span>
        </div>

        {loading ? (
          <LoadingSpinner size="md" className="py-12" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Student</th>
                  <th className="py-3.5 px-4 font-bold">Exam Title</th>
                  <th className="py-3.5 px-4 font-bold">Score</th>
                  <th className="py-3.5 px-4 font-bold">Grade</th>
                  <th className="py-3.5 px-4 font-bold">Security Flags</th>
                  <th className="py-3.5 px-4 font-bold">Submitted Date</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {attempts.map((att) => {
                  const logs = att.antiCheatingLogs || {};
                  const totalFlags = (logs.tabSwitchCount || 0) + (logs.fullscreenExitCount || 0) + (logs.copyAttemptCount || 0);

                  return (
                    <tr key={att._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{att.student?.name || 'Student'}</div>
                        <div className="text-[10px] text-slate-500">{att.student?.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {att.exam?.title || 'DSA Examination'}
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
                            <CheckCircle2 className="w-3.5 h-3.5" /> Clean
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(att.submittedAt || att.createdAt).toLocaleDateString()}
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

                {attempts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">
                      No examination submissions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttemptsListPage;
