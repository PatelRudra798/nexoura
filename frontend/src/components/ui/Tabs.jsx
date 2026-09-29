import React from 'react';

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="border-b border-edu-border mb-6">
      <nav className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-edu-navy text-edu-navy font-semibold'
                  : 'border-transparent text-edu-subtle hover:text-edu-slate hover:border-slate-300'
              }`}
            >
              {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-edu-navy' : 'text-slate-400'}`} />}
              {tab.label}
              {tab.badge && (
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
