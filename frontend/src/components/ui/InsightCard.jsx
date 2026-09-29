import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function InsightCard({
  subject,
  performance,
  trend = 'stable',
  focusArea,
  recommendedAction,
  status = 'normal'
}) {
  const trendConfig = {
    improving: { icon: ArrowUpRight, text: 'Improving', color: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' },
    declining: { icon: ArrowDownRight, text: 'Needs Attention', color: 'text-amber-400 bg-amber-500/10 border border-amber-500/20' },
    stable: { icon: Minus, text: 'Consistent', color: 'text-zinc-400 bg-zinc-800/80 border border-zinc-700/50' }
  };

  const TrendIcon = trendConfig[trend]?.icon || Minus;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h4 className="text-base font-semibold text-white font-heading">{subject}</h4>
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${trendConfig[trend]?.color}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trendConfig[trend]?.text}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5 mb-4">
          <div>
            <span className="text-xs text-zinc-400 block font-medium">Current Performance</span>
            <span className="text-2xl font-bold text-white font-mono">{performance}%</span>
          </div>
          <div>
            <span className="text-xs text-zinc-400 block font-medium">Target Focus Area</span>
            <span className="text-xs font-semibold text-indigo-300 block mt-1 truncate" title={focusArea}>
              {focusArea}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/80 rounded-xl p-3 border border-white/5">
        <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase block mb-1">Recommended Action</span>
        <p className="text-xs font-medium text-zinc-300 leading-relaxed">{recommendedAction}</p>
      </div>
    </div>
  );
}

