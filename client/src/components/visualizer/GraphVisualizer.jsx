import React, { useState } from 'react';
import { Play, RotateCcw, Radio, Compass } from 'lucide-react';
import Button from '../common/Button';
import { Badge } from '../common/Badge';

const defaultNodes = [
  { id: 'A', x: 100, y: 150 },
  { id: 'B', x: 220, y: 70 },
  { id: 'C', x: 220, y: 230 },
  { id: 'D', x: 360, y: 70 },
  { id: 'E', x: 360, y: 230 },
  { id: 'F', x: 480, y: 150 },
];

const defaultEdges = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'C', to: 'E' },
  { from: 'D', to: 'F' },
  { from: 'E', to: 'F' },
  { from: 'B', to: 'E' },
];

const GraphVisualizer = () => {
  const [traversalType, setTraversalType] = useState('bfs'); // 'bfs' or 'dfs'
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [activeQueue, setActiveQueue] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const reset = () => {
    setVisitedNodes([]);
    setCurrentNode(null);
    setActiveQueue([]);
    setIsRunning(false);
  };

  const runTraversal = async () => {
    reset();
    setIsRunning(true);

    const adj = {
      A: ['B', 'C'],
      B: ['A', 'D', 'E'],
      C: ['A', 'E'],
      D: ['B', 'F'],
      E: ['C', 'B', 'F'],
      F: ['D', 'E'],
    };

    if (traversalType === 'bfs') {
      const queue = ['A'];
      const visited = new Set(['A']);
      const order = [];

      while (queue.length > 0) {
        setActiveQueue([...queue]);
        const curr = queue.shift();
        setCurrentNode(curr);
        order.push(curr);
        setVisitedNodes([...order]);

        await new Promise((r) => setTimeout(r, 900));

        const neighbors = adj[curr] || [];
        for (const n of neighbors) {
          if (!visited.has(n)) {
            visited.add(n);
            queue.push(n);
          }
        }
      }
    } else {
      // DFS
      const visited = new Set();
      const order = [];
      const stack = ['A'];

      while (stack.length > 0) {
        setActiveQueue([...stack]);
        const curr = stack.pop();

        if (!visited.has(curr)) {
          visited.add(curr);
          setCurrentNode(curr);
          order.push(curr);
          setVisitedNodes([...order]);

          await new Promise((r) => setTimeout(r, 900));

          const neighbors = (adj[curr] || []).slice().reverse();
          for (const n of neighbors) {
            if (!visited.has(n)) {
              stack.push(n);
            }
          }
        }
      }
    }

    setCurrentNode(null);
    setActiveQueue([]);
    setIsRunning(false);
  };

  return (
    <div className="glass-card p-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex bg-dark-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setTraversalType('bfs'); reset(); }}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                traversalType === 'bfs' ? 'bg-brand-500 text-dark-950 shadow-glow-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> BFS (Breadth-First)
            </button>
            <button
              onClick={() => { setTraversalType('dfs'); reset(); }}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                traversalType === 'dfs' ? 'bg-brand-500 text-dark-950 shadow-glow-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> DFS (Depth-First)
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={runTraversal}
            disabled={isRunning}
            icon={Play}
            className="shadow-glow-cyan"
          >
            {isRunning ? 'Traversing...' : 'Start Traversal'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={reset}
            disabled={isRunning}
            icon={RotateCcw}
          >
            Reset
          </Button>
        </div>

        {/* Traversal Order Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Order:</span>
          <span className="font-mono text-cyan-300 font-bold bg-dark-950 px-3 py-1 rounded-lg border border-slate-800">
            {visitedNodes.length > 0 ? visitedNodes.join(' ➔ ') : 'Click Start'}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="h-72 sm:h-80 w-full bg-dark-950/90 rounded-2xl border border-slate-800 p-4 relative flex items-center justify-center overflow-hidden shadow-inner">
        <svg viewBox="0 0 580 300" className="w-full h-full max-w-2xl">
          {/* Edges */}
          {defaultEdges.map((edge, idx) => {
            const fromNode = defaultNodes.find((n) => n.id === edge.from);
            const toNode = defaultNodes.find((n) => n.id === edge.to);
            const isTraversed = visitedNodes.includes(edge.from) && visitedNodes.includes(edge.to);

            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isTraversed ? '#06B6D4' : '#334155'}
                strokeWidth={isTraversed ? 3 : 2}
                strokeDasharray={isTraversed ? 'none' : '4 4'}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Nodes */}
          {defaultNodes.map((node) => {
            const isVisited = visitedNodes.includes(node.id);
            const isCurrent = currentNode === node.id;

            return (
              <g key={node.id} className="transition-all duration-300 cursor-pointer">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={22}
                  fill={isCurrent ? '#F59E0B' : isVisited ? '#10B981' : '#0F172A'}
                  stroke={isCurrent ? '#FBBF24' : isVisited ? '#34D399' : '#06B6D4'}
                  strokeWidth={isCurrent ? 4 : 2}
                  className="transition-all duration-300 filter drop-shadow-md"
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fill={isCurrent || isVisited ? '#050811' : '#F1F5F9'}
                  fontSize={13}
                  fontWeight="bold"
                  fontFamily="Inter, sans-serif"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Live Data Structure State */}
      <div className="mt-4 p-3 rounded-xl bg-dark-950/80 border border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Current {traversalType === 'bfs' ? 'FIFO Queue' : 'LIFO Stack'} State:
        </span>
        <span className="font-mono text-amber-300 font-semibold">
          [{activeQueue.join(', ')}]
        </span>
      </div>
    </div>
  );
};

export default GraphVisualizer;
