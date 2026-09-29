import React from 'react';
import { CheckSquare, ArrowRight, Clock, Target, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from './Button';

export function RecommendationCard({ tasks = [], onCompleteTask, onRefresh, onStartPractice }) {
  return (
    <div className="glass-panel rounded-2xl p-6 shadow-edu-md border border-white/10">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold shadow-glow-indigo">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight font-heading">
              Personalized Learning Recommendations
            </h3>
            <p className="text-xs text-zinc-400">
              Evidence-based priority actions generated from your diagnostic assessments
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5 shadow-glow-indigo">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Action Engine
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="py-8 text-center space-y-2 bg-zinc-900/50 rounded-xl border border-white/5">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-sm font-semibold text-white">All Priority Tasks Completed!</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Take a diagnostic assessment to evaluate new curriculum areas and discover fresh recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-5">
          {tasks.map((task, index) => (
            <div
              key={task.id || index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-zinc-900/70 border border-white/5 hover:border-indigo-500/30 transition-all duration-200 gap-3 group hover:bg-zinc-800/60"
            >
              <div className="flex items-start gap-3">
                <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                  task.priority === 'high' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-glow-orange' : 'bg-zinc-800 text-zinc-300 border border-zinc-700/50'
                }`}>
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {task.title}
                    </h4>
                    {task.priority === 'high' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        Priority Alert
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{task.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-400">
                    <span className="inline-flex items-center gap-1 font-medium text-indigo-400">
                      <Clock className="w-3 h-3" /> {task.estimated_time || task.estimatedTime || '15 mins'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-medium border border-zinc-700/50">
                      {task.subject_name || task.subject || 'Curriculum'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {onCompleteTask && (
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" /> Mark Done
                  </button>
                )}
                {onStartPractice && (
                  <button
                    onClick={() => onStartPractice(task)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-glow-indigo"
                  >
                    Practice <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-white/5">
        <span>Completion updates your academic profile and lowers risk score</span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 cursor-pointer"
          >
            Refresh Recommendations
          </button>
        )}
      </div>
    </div>
  );
}

