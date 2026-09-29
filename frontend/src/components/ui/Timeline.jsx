import React from 'react';
import { CheckCircle, Circle, AlertCircle, Sparkles } from 'lucide-react';

export function Timeline({ steps = [] }) {
  return (
    <div className="glass-panel rounded-2xl p-6 shadow-edu-md border border-white/10">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div>
          <h3 className="text-base font-semibold text-white font-heading">Learning Progression Trajectory</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Continuous visual tracking from foundational concepts to topic mastery</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-glow-indigo">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Active Pathway
        </span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            const isWarning = step.status === 'warning';

            return (
              <div key={index} className="relative flex flex-col items-start md:items-center text-left md:text-center group">
                {/* Connecting Line for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-4 left-1/2 w-full h-0.5 bg-zinc-800 z-0">
                    <div
                      className={`h-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-zinc-800'}`}
                    />
                  </div>
                )}

                {/* Step Icon Node */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-indigo-400/30 shadow-glow-indigo'
                      : isCurrent
                      ? 'bg-zinc-900 text-indigo-300 border-indigo-500 ring-4 ring-indigo-500/20 shadow-glow-indigo'
                      : isWarning
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/50 shadow-glow-orange'
                      : 'bg-zinc-900/80 text-zinc-500 border-zinc-800'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : isWarning ? (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step Label & Detail */}
                <div className="mt-3 w-full">
                  <span
                    className={`block text-xs font-semibold ${
                      isCurrent
                        ? 'text-indigo-400'
                        : isCompleted
                        ? 'text-white'
                        : 'text-zinc-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  {step.subtitle && (
                    <span className="block text-[11px] text-zinc-500 mt-0.5 leading-tight">
                      {step.subtitle}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

