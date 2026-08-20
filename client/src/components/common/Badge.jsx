import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const base = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    primary: 'bg-brand-500/10 text-brand-400 border border-brand-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    easy: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    hard: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    live: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse',
    scheduled: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    completed: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    draft: 'bg-slate-800 text-slate-400 border border-slate-700',
    gradeA: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold',
    gradeB: 'bg-blue-500/20 text-blue-300 border border-blue-500/50 font-bold',
    gradeC: 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold',
    gradeF: 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`${hover ? 'glass-card-hover' : 'glass-card'} p-5 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div
        className={`${sizes[size]} border-2 border-brand-500/20 border-t-brand-400 rounded-full animate-spin`}
      />
    </div>
  );
};

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full rounded',
    card: 'h-40 w-full rounded-xl',
    circle: 'w-10 h-10 rounded-full',
  };
  return (
    <div className={`animate-pulse bg-slate-800/80 ${variants[variant]} ${className}`} />
  );
};

export const ProgressBar = ({ value = 0, max = 100, label = '', color = 'cyan', className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colors = {
    cyan: 'bg-gradient-to-r from-brand-500 to-cyan-400',
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    green: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    amber: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500',
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
          <span>{label}</span>
          <span className="font-semibold text-slate-200">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-800/90 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color] || colors.cyan}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'There are currently no items to display.',
  action,
  className = '',
}) => {
  return (
    <div className={`glass-card p-10 text-center flex flex-col items-center justify-center ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
};
