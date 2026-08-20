import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  FileText,
  Play,
  Code,
  BarChart3,
  Trophy,
  User,
  Shield,
  HelpCircle,
  Users,
  Settings,
  Flame,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'DSA Syllabus', path: '/syllabus', icon: BookOpen },
    { name: 'Practice Mode', path: '/practice', icon: Target },
    { name: 'Examinations', path: '/exams', icon: FileText },
    { name: 'Algo Visualizer', path: '/visualizer', icon: Play },
    { name: 'Algorithm Library', path: '/algorithms', icon: Code },
    { name: 'Performance Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const facultyLinks = [
    { name: 'Question Bank', path: '/admin/questions', icon: HelpCircle },
    { name: 'Manage Exams', path: '/admin/exams', icon: FileText },
    { name: 'Student Submissions', path: '/admin/attempts', icon: BarChart3 },
    { name: 'Algo Visualizer', path: '/visualizer', icon: Play },
    { name: 'Algorithm Library', path: '/algorithms', icon: Code },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: Shield },
    { name: 'Question Bank', path: '/admin/questions', icon: HelpCircle },
    { name: 'Manage Exams', path: '/admin/exams', icon: FileText },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
    { name: 'Exam Attempts & Audit', path: '/admin/attempts', icon: BarChart3 },
    { name: 'DSA Syllabus', path: '/syllabus', icon: BookOpen },
    { name: 'Algo Visualizer', path: '/visualizer', icon: Play },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const links = role === 'admin' ? adminLinks : role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-dark-900/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Links */}
        <div className="px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {role === 'admin' ? 'Admin Portal' : role === 'faculty' ? 'Faculty Portal' : 'Student Learning & Exams'}
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer Widget */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="glass-card p-3 rounded-xl bg-slate-900/60 border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-300">Daily Activity</span>
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {user?.streakCount || 1}d
              </span>
            </div>
            <div className="text-[10px] text-slate-400 leading-snug">
              {role === 'student' ? 'Keep taking practice quizzes to maintain your streak!' : 'CodeArena DSA Examination System v1.0'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
