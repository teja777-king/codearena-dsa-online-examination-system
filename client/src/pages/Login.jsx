import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Mail, Lock, Sparkles, GraduationCap, BookOpen, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, quickLoginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'faculty') navigate('/admin/questions');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      const res = await quickLoginAsDemo(role);
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'faculty') navigate('/admin/questions');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 blur-[130px] pointer-events-none -z-10" />

      <div className="w-full max-w-md glass-card p-6 sm:p-8 rounded-2xl border-slate-800 shadow-2xl">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-dark-950 font-bold mx-auto mb-3 shadow-glow-cyan">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your CodeArena DSA account</p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="mb-6 p-3.5 rounded-xl bg-dark-950/80 border border-brand-500/30">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-300 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
            <span>1-Click Quick Demo Login:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="px-2 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex flex-col items-center gap-1 transition"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('faculty')}
              className="px-2 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[11px] font-bold flex flex-col items-center gap-1 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="px-2 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[11px] font-bold flex flex-col items-center gap-1 transition"
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            Sign In
          </Button>
        </form>

        {/* Bottom Signup Link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-bold hover:underline">
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
