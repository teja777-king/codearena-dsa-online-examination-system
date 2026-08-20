import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Mail, Lock, User, Building, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: 'CodeArena Institute of Technology',
    studentId: '',
    course: 'Computer Science & Engineering',
    year: '3rd Year',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-xl glass-card p-6 sm:p-8 rounded-2xl border-slate-800 shadow-2xl my-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-dark-950 font-bold mx-auto mb-3 shadow-glow-cyan">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Student Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join the CodeArena DSA Examination System</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Teja Varma"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">University / College</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Institute Name"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Student Roll / ID (Optional)</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="e.g. CA-2026-081"
                className="w-full px-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Course / Degree</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              >
                <option value="Computer Science & Engineering">B.Tech - Computer Science & Engg</option>
                <option value="Information Technology">B.Tech - Information Technology</option>
                <option value="Artificial Intelligence & Data Science">B.Tech - AI & Data Science</option>
                <option value="Master of Computer Applications">MCA - Computer Applications</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 focus:outline-none transition"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-dark-950/90 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full shadow-glow-cyan mt-4"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
