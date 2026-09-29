import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

export function StatusIndicator({ status, label, details }) {
  const statusMap = {
    connected: {
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
      icon: CheckCircle2,
      tag: 'CONNECTED'
    },
    ok: {
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
      icon: CheckCircle2,
      tag: 'ONLINE'
    },
    standby_ready: {
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      dotColor: 'bg-amber-500',
      icon: AlertTriangle,
      tag: 'STANDBY READY'
    },
    offline: {
      color: 'bg-red-50 text-red-900 border-red-200',
      dotColor: 'bg-red-500',
      icon: AlertOctagon,
      tag: 'OFFLINE'
    }
  };

  const current = statusMap[status] || {
    color: 'bg-slate-100 text-slate-800 border-slate-200',
    dotColor: 'bg-slate-400',
    icon: HelpCircle,
    tag: 'STATUS UNKNOWN'
  };

  const Icon = current.icon;

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-lg border shadow-edu-sm ${current.color}`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm tracking-tight">{label}</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/70 uppercase">
            <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor}`} />
            {current.tag}
          </span>
        </div>
        {details && <p className="text-xs mt-1 leading-relaxed opacity-90">{details}</p>}
      </div>
    </div>
  );
}
