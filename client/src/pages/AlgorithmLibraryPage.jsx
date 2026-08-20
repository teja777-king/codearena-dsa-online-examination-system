import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { dsaCatalog } from '../algorithms/dsaCatalog';
import { Badge } from '../components/common/Badge';
import Button from '../components/common/Button';

const AlgorithmLibraryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const categories = [
    'All',
    'Arrays',
    'Searching',
    'Sorting',
    'Linked Lists',
    'Stacks',
    'Trees',
    'Graphs',
    'Dynamic Programming',
  ];

  const filteredAlgorithms = dsaCatalog.filter((algo) => {
    const matchesCategory = selectedCategory === 'All' || algo.category === selectedCategory;
    const matchesSearch =
      algo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 bg-gradient-to-r from-dark-900 via-dark-850 to-cyan-950/30">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-3 shadow-glow-cyan">
            <Code className="w-3.5 h-3.5" />
            <span>Code Repository & Reference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            DSA Algorithms & Implementations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Clean, optimized reference implementations across all Data Structures and Algorithms categories with time/space complexity analysis and test cases.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
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

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search algorithms (e.g. Kadane, Dijkstra, Binary Search, Knapsack, Reverse)..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark-900/80 border border-slate-800 focus:border-brand-400 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Algorithms List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAlgorithms.map((algo, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border-slate-800 flex flex-col justify-between">
            <div>
              {/* Meta Top Bar */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Badge variant="blue" size="sm">{algo.category}</Badge>
                  <Badge variant={algo.difficulty.toLowerCase()} size="sm">{algo.difficulty}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-rose-400 font-bold">Time: {algo.timeComplexity}</span>
                  <span className="text-cyan-300 font-bold">Space: {algo.spaceComplexity}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{algo.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{algo.description}</p>

              {/* Code Snippet Box */}
              <div className="relative rounded-xl bg-dark-950 border border-slate-800 p-4 font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner mb-4 group">
                <button
                  onClick={() => handleCopyCode(algo.code, idx)}
                  className="absolute right-2.5 top-2.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] font-sans flex items-center gap-1 opacity-80 hover:opacity-100 transition"
                  title="Copy code"
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>
                <pre className="whitespace-pre">{algo.code}</pre>
              </div>

              {/* Example Input / Output */}
              <div className="p-3 rounded-xl bg-dark-950/60 border border-slate-800 text-[11px] font-mono space-y-1 text-slate-400">
                <div><span className="text-slate-500">Input: </span> <span className="text-slate-200">{algo.exampleInput}</span></div>
                <div><span className="text-slate-500">Output:</span> <span className="text-emerald-400 font-bold">{algo.exampleOutput}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmLibraryPage;
