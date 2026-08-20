import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Shield,
  GraduationCap,
  BookOpen,
  Trash2,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/Badge';

const AdminStudentsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('student');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: {
          role: roleFilter !== 'all' ? roleFilter : undefined,
          search,
          page,
          limit: 10,
        },
      });
      if (res.data.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setTotalUsers(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, page]);

  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/users/${user._id}/toggle-status`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete._id}`);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>User Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student & User Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage student registrations, inspect individual attempt metrics, and control account permissions.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, student ID, or college..."
            className="w-full pl-10 pr-4 py-2 bg-dark-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-400"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="w-full sm:w-40 px-3 py-2 bg-dark-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-400"
        >
          <option value="student">Students</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Administrators</option>
          <option value="all">All Roles</option>
        </select>

        <Button variant="secondary" size="sm" onClick={() => { setPage(1); fetchUsers(); }}>
          Search
        </Button>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl overflow-hidden border-slate-800">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Total {totalUsers} Accounts</span>
          <span>Page {page} of {totalPages || 1}</span>
        </div>

        {loading ? (
          <LoadingSpinner size="md" className="py-12" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">User</th>
                  <th className="py-3.5 px-4 font-bold">University & Course</th>
                  <th className="py-3.5 px-4 font-bold">ID</th>
                  <th className="py-3.5 px-4 font-bold">Exams Taken</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.role === 'admin' ? (
                          <Badge variant="hard" size="sm">ADMIN</Badge>
                        ) : u.role === 'faculty' ? (
                          <Badge variant="blue" size="sm">FACULTY</Badge>
                        ) : null}
                      </div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{u.college}</div>
                      <div className="text-[10px] text-slate-400">{u.course} ({u.year})</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-brand-300 font-semibold">
                      {u.studentId || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white">{u.stats?.examsAttempted || 0}</span>
                      {u.stats?.averageScore > 0 && (
                        <span className="text-[10px] text-slate-500 block">Avg: {u.stats.averageScore}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(u)}
                          className={u.isActive ? 'text-amber-400' : 'text-emerald-400'}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <button
                          onClick={() => { setUserToDelete(u); setDeleteConfirmOpen(true); }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user and all associated records?"
        confirmText="Delete Account"
      />
    </div>
  );
};

export default AdminStudentsPage;
