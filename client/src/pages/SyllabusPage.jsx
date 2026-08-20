import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Code,
  Target,
  ArrowRight,
  Layers,
  ChevronRight,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/Badge';

const SyllabusPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/topics');
        if (res.data.success) {
          setTopics(res.data.topics);
        }
      } catch (err) {
        console.error('Error loading syllabus topics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const categories = [
    'All',
    'Foundations',
    'Linear Data Structures',
    'Non-Linear Data Structures',
    'Algorithms',
    'Advanced Techniques',
  ];

  const filteredTopics = topics.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.keyConcepts || []).some((c) => c.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[70vh]" />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 bg-gradient-to-r from-dark-900 to-brand-950/30">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Framework</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Data Structures & Algorithms Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            A comprehensive 22-topic roadmap designed for university-level DSA mastery, technical examinations, and competitive programming.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-dark-950 shadow-glow-cyan'
                  : 'bg-dark-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics (e.g. Dynamic Programming, Trees, Kadane, BFS)..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark-900/80 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <div
            key={topic._id}
            className="glass-card-hover p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Topic #{topic.order}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={topic.difficulty?.toLowerCase() || 'medium'} size="sm">
                    {topic.difficulty}
                  </Badge>
                  <span className="text-xs text-brand-400 font-semibold">
                    {topic.questionsCount || 0} Qs
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{topic.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{topic.description}</p>

              {/* Key Concepts Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {(topic.keyConcepts || []).map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-dark-950 text-[10px] font-mono text-slate-400 border border-slate-800/80"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <Link to={`/practice?topic=${encodeURIComponent(topic.name)}`}>
                <Button variant="primary" size="sm" icon={Target} className="shadow-glow-cyan">
                  Practice
                </Button>
              </Link>
              <Link to="/algorithms">
                <Button variant="ghost" size="sm" icon={Code} className="text-cyan-300">
                  View Code
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusPage;
