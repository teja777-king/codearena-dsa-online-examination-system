import React, { useState } from 'react';
import { Play, Layers, Compass, Radio, ArrowUpDown, Search } from 'lucide-react';
import SortingVisualizer from '../components/visualizer/SortingVisualizer';
import GraphVisualizer from '../components/visualizer/GraphVisualizer';
import { Badge } from '../components/common/Badge';

const VisualizerPage = () => {
  const [activeTab, setActiveTab] = useState('sorting'); // 'sorting', 'graph'
  const [sortingAlgo, setSortingAlgo] = useState('bubble');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border-slate-800 bg-gradient-to-r from-dark-900 via-dark-850 to-cyan-950/30">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold mb-3 shadow-glow-cyan">
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Animation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            DSA Algorithm Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Step through sorting mechanisms and graph traversals in real-time. Observe memory swaps, pointer modifications, and state structures live.
          </p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Tabs */}
        <div className="flex items-center gap-2 bg-dark-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('sorting')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'sorting'
                ? 'bg-brand-500 text-dark-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" /> Sorting Visualizer
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'graph'
                ? 'bg-brand-500 text-dark-950 shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" /> Graph Traversal (BFS / DFS)
          </button>
        </div>

        {/* Algorithm Sub-select if on sorting tab */}
        {activeTab === 'sorting' && (
          <div className="flex items-center gap-2 bg-dark-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['bubble', 'selection', 'insertion'].map((algo) => (
              <button
                key={algo}
                onClick={() => setSortingAlgo(algo)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                  sortingAlgo === algo
                    ? 'bg-slate-800 text-brand-400 border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {algo} Sort
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visualizer Container */}
      <div>
        {activeTab === 'sorting' ? (
          <SortingVisualizer algorithm={sortingAlgo} />
        ) : (
          <GraphVisualizer />
        )}
      </div>
    </div>
  );
};

export default VisualizerPage;
