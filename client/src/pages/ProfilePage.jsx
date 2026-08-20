import React, { useState } from 'react';
import {
  User,
  Mail,
  Building,
  BookOpen,
  Award,
  Flame,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    course: user?.course || '',
    year: user?.year || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      await updateProfile(formData);
      setProfileSuccess('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return setPasswordError('New passwords do not match.');
    }
    if (passwordData.newPassword.length < 6) {
      return setPasswordError('New password must be at least 6 characters.');
    }

    setPasswordLoading(true);

    try {
      await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess('Password changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header Profile Card */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-3xl shadow-glow-cyan">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
            <Badge variant="primary" size="sm">
              {user?.role?.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-300">
            <span>ID: <strong className="text-brand-400 font-mono">{user?.studentId || 'CA-001'}</strong></span>
            <span>• {user?.college}</span>
            <span>• <span className="text-amber-400 font-bold">🔥 {user?.streakCount || 1}d Streak</span></span>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <div className="glass-card p-6 rounded-2xl border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" />
            <span>Academic Details</span>
          </h3>

          {profileSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">University / College</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Course / Department</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={profileLoading}
              className="w-full shadow-glow-cyan"
            >
              Save Profile Changes
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-card p-6 rounded-2xl border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Update Password</span>
          </h3>

          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-dark-950 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="md"
              loading={passwordLoading}
              className="w-full"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
