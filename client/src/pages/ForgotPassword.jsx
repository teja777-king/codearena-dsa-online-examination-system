import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Mail, Lock, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error requesting password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md glass-card p-6 sm:p-8 rounded-2xl border-slate-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-dark-950 font-bold mx-auto mb-3 shadow-glow-cyan">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Forgot Password</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your registered email to reset your password</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
              Password reset link has been processed.
              {resetToken && (
                <div className="mt-3 p-2 bg-dark-950 rounded-lg text-cyan-300 font-mono text-[11px] select-all break-all border border-slate-800">
                  Token: {resetToken}
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/reset-password?token=${resetToken}`)}
              className="w-full shadow-glow-cyan"
            >
              Proceed to Reset Password
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@codearena.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full shadow-glow-cyan mt-2"
            >
              Generate Reset Link
            </Button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-xs text-slate-400 hover:text-brand-400">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const ResetPassword = () => {
  const [token, setToken] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || '';
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md glass-card p-6 sm:p-8 rounded-2xl border-slate-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-dark-950 font-bold mx-auto mb-3 shadow-glow-cyan">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1">Set a new secure password for your account</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center leading-relaxed">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
            Password reset successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reset Token</label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token here"
                className="w-full px-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full shadow-glow-cyan mt-2"
            >
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
