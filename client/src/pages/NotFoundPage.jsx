import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowLeft, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-6 shadow-glow-cyan">
        <Code2 className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black gradient-text tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-white mb-2">Algorithm Node Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8">
        The requested pathway does not exist in our memory heap. Please return to the central arena.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" icon={Home} className="shadow-glow-cyan">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
