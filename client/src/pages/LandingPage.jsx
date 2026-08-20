import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Sparkles,
  ShieldCheck,
  Zap,
  BarChart3,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Play,
  Flame,
  Award,
  Layers,
  ChevronRight,
  Terminal,
} from 'lucide-react';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';

const LandingPage = () => {
  const topicsPreview = [
    { name: 'Arrays & Two Pointers', questions: 20, difficulty: 'Beginner', icon: 'Grid' },
    { name: 'Linked Lists & Cycles', questions: 15, difficulty: 'Intermediate', icon: 'Link' },
    { name: 'Stacks & Monotonic Queues', questions: 15, difficulty: 'Intermediate', icon: 'Layers' },
    { name: 'Binary Trees & BSTs', questions: 15, difficulty: 'Intermediate', icon: 'GitBranch' },
    { name: 'Graphs, BFS & DFS', questions: 15, difficulty: 'Advanced', icon: 'Share2' },
    { name: 'Dynamic Programming', questions: 10, difficulty: 'Advanced', icon: 'Cpu' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Real-Time Auto Evaluation',
      description: 'Instant server-side grading with strict negative marking support and in-depth educational explanations.',
    },
    {
      icon: ShieldCheck,
      title: 'Anti-Cheating Monitoring',
      description: 'Browser tab-switch tracking, fullscreen enforcement, and copy-paste prevention for exam integrity.',
    },
    {
      icon: Play,
      title: 'Interactive Algorithm Visualizer',
      description: 'Step-by-step visual animations for Bubble/Merge/Quick Sort, Binary Search, and BFS/DFS graph traversals.',
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics Radar',
      description: 'Track score trajectories, topic strength matrices, and receive AI-guided practice recommendations.',
    },
    {
      icon: BookOpen,
      title: '22-Topic University Syllabus',
      description: 'Comprehensive curriculum tailored for academic university exams, technical interviews, and coding tests.',
    },
    {
      icon: Award,
      title: 'Competitive Leaderboards & Badges',
      description: 'Global, weekly, and course rankings with streak milestones and unlockable DSA achievement badges.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand-500/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-8 shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation DSA Examination Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
          Master DSA. <br className="hidden sm:inline" />
          <span className="gradient-text">Think Faster. Score Higher.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          An intelligent online examination platform built specifically for university Data Structures and Algorithms courses with live auto-evaluation, anti-cheating, and interactive visualizers.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link to="/register">
            <Button variant="primary" size="lg" className="shadow-glow-cyan">
              Start Learning Free <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link to="/practice">
            <Button variant="secondary" size="lg">
              Take a Practice Test
            </Button>
          </Link>
          <Link to="/visualizer">
            <Button variant="outline" size="lg" icon={Play}>
              Algorithm Visualizer
            </Button>
          </Link>
        </div>

        {/* Code Snippet / Visual Hero Card */}
        <div className="relative max-w-4xl mx-auto glass-card p-4 sm:p-6 border-slate-800 shadow-2xl rounded-2xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-300">binarySearch.cpp</span>
            </div>
            <Badge variant="live" size="sm">
              EXAM ENGINE ACTIVE
            </Badge>
          </div>

          <div className="text-left font-mono text-xs sm:text-sm text-cyan-300 bg-dark-950 p-4 rounded-xl overflow-x-auto shadow-inner leading-relaxed">
            <span className="text-purple-400">int</span> <span className="text-brand-300">binarySearch</span>(<span className="text-purple-400">const</span> vector&lt;<span className="text-purple-400">int</span>&gt;&amp; arr, <span className="text-purple-400">int</span> target) &#123;<br />
            &nbsp;&nbsp;<span className="text-purple-400">int</span> left = <span className="text-amber-400">0</span>, right = arr.<span className="text-blue-400">size</span>() - <span className="text-amber-400">1</span>;<br />
            &nbsp;&nbsp;<span className="text-purple-400">while</span> (left &lt;= right) &#123;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">int</span> mid = left + (right - left) / <span className="text-amber-400">2</span>;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> (arr[mid] == target) <span className="text-purple-400">return</span> mid; <span className="text-slate-500">// O(log n) Time | O(1) Space</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">else if</span> (arr[mid] &lt; target) left = mid + <span className="text-amber-400">1</span>;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">else</span> right = mid - <span className="text-amber-400">1</span>;<br />
            &nbsp;&nbsp;&#125;<br />
            &nbsp;&nbsp;<span className="text-purple-400">return</span> -<span className="text-amber-400">1</span>;<br />
            &#125;
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-dark-900/50 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">Why CodeArena?</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              Built for Serious DSA Excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-5 shadow-glow-cyan">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DSA Syllabus Preview */}
      <section id="syllabus" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">Complete Curriculum</h2>
            <p className="text-3xl font-extrabold text-white">22 Comprehensive DSA Topics</p>
          </div>
          <Link to="/syllabus">
            <Button variant="outline" size="md">
              View Full Syllabus <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topicsPreview.map((topic, idx) => (
            <div key={idx} className="glass-card p-5 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">{topic.name}</h4>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                  <Badge variant={topic.difficulty.toLowerCase()} size="sm">
                    {topic.difficulty}
                  </Badge>
                  <span>{topic.questions} Questions</span>
                </div>
              </div>
              <Link to="/practice">
                <Button variant="ghost" size="sm" className="text-brand-400">
                  Practice
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-dark-900/40 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">Got Questions?</h2>
            <p className="text-3xl font-extrabold text-white">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5 rounded-xl">
              <h4 className="text-base font-bold text-white mb-1.5">How does the anti-cheating system work?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                The platform actively monitors browser visibility, window focus losses, and fullscreen exits. Any attempts are logged into an examination audit trail visible to instructors.
              </p>
            </div>

            <div className="glass-card p-5 rounded-xl">
              <h4 className="text-base font-bold text-white mb-1.5">Does the exam timer survive browser refreshes?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes! The examination session expiration is securely computed from the server-side timestamp. If a student refreshes or accidentally closes the tab, they can resume with accurate remaining time.
              </p>
            </div>

            <div className="glass-card p-5 rounded-xl">
              <h4 className="text-base font-bold text-white mb-1.5">Can I try all user roles without registering?</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes! Click the "Demo Roles" dropdown in the navbar or the quick demo buttons on the Login page to instantly test Student, Faculty, and Admin accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950 border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <Code2 className="w-5 h-5 text-brand-400" />
            <span>CodeArena DSA Examination System</span>
          </div>
          <p>© 2026 CodeArena DSA. Production-Quality University Examination Portal.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
