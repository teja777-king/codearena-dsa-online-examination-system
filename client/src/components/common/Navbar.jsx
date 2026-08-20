import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Code2,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Shield,
  GraduationCap,
  BookOpen,
  Menu,
  X,
  Play,
  Flame,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

const Navbar = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout, quickLoginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDemoSwitch = async (role) => {
    try {
      await quickLoginAsDemo(role);
      setDemoMenuOpen(false);
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'faculty') navigate('/admin/questions');
      else navigate('/dashboard');
    } catch (err) {
      console.error('Demo login switch error:', err);
    }
  };

  const isTakeExamPage = location.pathname.includes('/take');

  return (
    <nav className="sticky top-0 z-40 w-full bg-dark-950/80 backdrop-blur-lg border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated && onToggleSidebar && !isTakeExamPage && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 focus:outline-none"
                aria-label="Toggle Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to={isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-dark-950 font-bold shadow-glow-cyan group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  CodeArena <span className="text-brand-400 text-xs px-1.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/30">DSA</span>
                </span>
                <span className="text-[10px] text-slate-400 -mt-1 hidden sm:inline">Intelligent Examination Portal</span>
              </div>
            </Link>
          </div>

          {/* Center Links for Public/Landing */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link to="/#features" className="hover:text-brand-400 transition">Features</Link>
              <Link to="/#syllabus" className="hover:text-brand-400 transition">DSA Syllabus</Link>
              <Link to="/visualizer" className="hover:text-brand-400 transition flex items-center gap-1 text-cyan-300">
                <Play className="w-3.5 h-3.5" /> Visualizer
              </Link>
              <Link to="/#leaderboard" className="hover:text-brand-400 transition">Leaderboard</Link>
              <Link to="/#faq" className="hover:text-brand-400 transition">FAQ</Link>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setDemoMenuOpen(!demoMenuOpen);
                  setUserMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/30 hover:bg-brand-500/20 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                <span className="hidden sm:inline">1-Click</span> Demo Roles
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-card border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('student')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-slate-800/80 flex items-center justify-between text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-emerald-400">Student Account</div>
                        <div className="text-[10px] text-slate-400">student@codearena.com</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('faculty')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-slate-800/80 flex items-center justify-between text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-semibold text-blue-400">Faculty / Examiner</div>
                        <div className="text-[10px] text-slate-400">faculty@codearena.com</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-slate-800/80 flex items-center justify-between text-slate-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-semibold text-purple-400">Admin Account</div>
                        <div className="text-[10px] text-slate-400">admin@codearena.com</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* If Authenticated: User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setDemoMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 border border-transparent hover:border-slate-700/80 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-brand-400 capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-card border-slate-700/80 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-medium text-slate-200">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Badge variant="primary" size="sm">
                          {user?.role?.toUpperCase()}
                        </Badge>
                        {user?.streakCount > 0 && (
                          <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                            <Flame className="w-3 h-3 text-amber-400" /> {user.streakCount}d streak
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2.5 transition"
                    >
                      <User className="w-4 h-4 text-slate-400" /> My Profile
                    </Link>

                    {user?.role === 'student' && (
                      <Link
                        to="/analytics"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white flex items-center gap-2.5 transition"
                      >
                        <Award className="w-4 h-4 text-slate-400" /> Performance Analytics
                      </Link>
                    )}

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-brand-500 hover:bg-brand-400 text-dark-950 shadow-glow-cyan transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
