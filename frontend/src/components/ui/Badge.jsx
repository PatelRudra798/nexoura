import React from 'react';

export function Badge({ children, variant = 'neutral', icon: Icon, className = '', pulse = false }) {
  const variants = {
    neutral: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
    success: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
    info: 'bg-sky-950/60 text-sky-300 border-sky-500/30',
    academic: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40 shadow-glow-indigo',
    live: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/15 text-purple-200 border-purple-500/40 shadow-glow-purple',
    ai: 'bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 text-purple-200 border-purple-400/40 shadow-glow-purple',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-glow-orange'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border backdrop-blur-md ${variants[variant] || variants.neutral} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

