import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, StepForward, Sliders, Zap } from 'lucide-react';
import Button from '../common/Button';
import { Badge } from '../common/Badge';

const SortingVisualizer = ({ algorithm = 'bubble' }) => {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(60); // ms delay
  const [arraySize, setArraySize] = useState(20);
  const [stepIndex, setStepIndex] = useState(0);
  const animationSteps = useRef([]);
  const isCancelled = useRef(false);

  // Generate random array
  const generateRandomArray = (size = arraySize) => {
    const newArr = [];
    for (let i = 0; i < size; i++) {
      newArr.push(Math.floor(Math.random() * 85) + 15);
    }
    setArray(newArr);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setStepIndex(0);
    setIsRunning(false);
    isCancelled.current = false;
  };

  useEffect(() => {
    generateRandomArray(arraySize);
  }, [arraySize, algorithm]);

  // Compute animations for selected algorithm
  const generateSteps = () => {
    const arr = [...array];
    const steps = [];

    if (algorithm === 'bubble') {
      const a = [...arr];
      const n = a.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          steps.push({ type: 'compare', indices: [j, j + 1], array: [...a] });
          if (a[j] > a[j + 1]) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            steps.push({ type: 'swap', indices: [j, j + 1], array: [...a] });
          }
        }
        steps.push({ type: 'sorted', index: n - 1 - i, array: [...a] });
      }
      steps.push({ type: 'sorted', index: 0, array: [...a] });
    } else if (algorithm === 'selection') {
      const a = [...arr];
      const n = a.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          steps.push({ type: 'compare', indices: [minIdx, j], array: [...a] });
          if (a[j] < a[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          [a[i], a[minIdx]] = [a[minIdx], a[i]];
          steps.push({ type: 'swap', indices: [i, minIdx], array: [...a] });
        }
        steps.push({ type: 'sorted', index: i, array: [...a] });
      }
      steps.push({ type: 'sorted', index: n - 1, array: [...a] });
    } else if (algorithm === 'insertion') {
      const a = [...arr];
      for (let i = 1; i < a.length; i++) {
        const key = a[i];
        let j = i - 1;
        while (j >= 0 && a[j] > key) {
          steps.push({ type: 'compare', indices: [j, j + 1], array: [...a] });
          a[j + 1] = a[j];
          steps.push({ type: 'swap', indices: [j, j + 1], array: [...a] });
          j--;
        }
        a[j + 1] = key;
        steps.push({ type: 'sorted', index: i, array: [...a] });
      }
      for (let i = 0; i < a.length; i++) steps.push({ type: 'sorted', index: i, array: [...a] });
    }

    return steps;
  };

  const runVisualizer = async () => {
    if (isRunning) {
      setIsRunning(false);
      isCancelled.current = true;
      return;
    }

    setIsRunning(true);
    isCancelled.current = false;

    const steps = generateSteps();
    animationSteps.current = steps;

    for (let i = stepIndex; i < steps.length; i++) {
      if (isCancelled.current) break;

      const step = steps[i];
      setStepIndex(i);
      setArray(step.array);

      if (step.type === 'compare') {
        setComparing(step.indices);
        setSwapping([]);
      } else if (step.type === 'swap') {
        setSwapping(step.indices);
        setComparing([]);
      } else if (step.type === 'sorted') {
        setSorted((prev) => [...prev, step.index]);
      }

      await new Promise((resolve) => setTimeout(resolve, 110 - speed));
    }

    if (!isCancelled.current) {
      setComparing([]);
      setSwapping([]);
      setSorted(Array.from({ length: array.length }, (_, i) => i));
      setIsRunning(false);
    }
  };

  const getBarColor = (index) => {
    if (sorted.includes(index)) return 'bg-emerald-400 border-emerald-300 shadow-glow-green';
    if (swapping.includes(index)) return 'bg-rose-500 border-rose-400 shadow-glow-red scale-105';
    if (comparing.includes(index)) return 'bg-amber-400 border-amber-300 shadow-glow-amber scale-105';
    return 'bg-gradient-to-t from-brand-600 to-cyan-400 border-cyan-300/40';
  };

  const complexities = {
    bubble: { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', best: 'O(n)' },
    selection: { name: 'Selection Sort', time: 'O(n²)', space: 'O(1)', best: 'O(n²)' },
    insertion: { name: 'Insertion Sort', time: 'O(n²)', space: 'O(1)', best: 'O(n)' },
  };

  const currentMeta = complexities[algorithm] || complexities.bubble;

  return (
    <div className="glass-card p-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={runVisualizer}
            icon={isRunning ? Pause : Play}
            className="shadow-glow-cyan"
          >
            {isRunning ? 'Pause' : 'Start Sorting'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => generateRandomArray(arraySize)}
            disabled={isRunning}
            icon={RotateCcw}
          >
            Randomize Array
          </Button>
        </div>

        {/* Sliders */}
        <div className="flex items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Speed:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
              className="w-24 accent-brand-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Size:</span>
            <input
              type="range"
              min="10"
              max="40"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isRunning}
              className="w-24 accent-brand-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="h-64 sm:h-80 w-full bg-dark-950/80 rounded-2xl border border-slate-800/80 p-4 sm:p-6 flex items-end justify-center gap-1 sm:gap-2 shadow-inner">
        {array.map((value, idx) => (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center justify-end h-full group relative"
          >
            <div
              className={`w-full rounded-t-md transition-all duration-75 border-t ${getBarColor(idx)}`}
              style={{ height: `${value}%` }}
            />
            <span className="text-[10px] text-slate-400 mt-1 select-none hidden sm:inline">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Complexity Info Box */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="glass-card p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Algorithm</span>
          <span className="text-xs sm:text-sm font-bold text-brand-400">{currentMeta.name}</span>
        </div>
        <div className="glass-card p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Worst Time</span>
          <span className="text-xs sm:text-sm font-bold text-rose-400 font-mono">{currentMeta.time}</span>
        </div>
        <div className="glass-card p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Best Time</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">{currentMeta.best}</span>
        </div>
        <div className="glass-card p-3 text-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Space Complexity</span>
          <span className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">{currentMeta.space}</span>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
