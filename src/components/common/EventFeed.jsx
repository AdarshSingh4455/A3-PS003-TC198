import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import SectionCard from './SectionCard';

export default function EventFeed({ events, onViewAll }) {
  const dotColors = {
    cyan: "bg-cyan-500 dark:bg-cyan-400",
    rose: "bg-rose-500 dark:bg-rose-400",
    slate: "bg-slate-400 dark:bg-slate-500",
    purple: "bg-purple-500 dark:bg-purple-400"
  };

  const action = onViewAll && (
    <button 
      onClick={onViewAll}
      className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold transition-colors cursor-pointer"
    >
      <span>View All</span>
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  );

  return (
    <SectionCard
      title="Recent System Events"
      icon={Clock}
      action={action}
      className="h-full"
    >
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {events.map((ev) => (
          <div key={ev.id} className="py-2.5 flex items-start gap-3">
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-[#8295A8] shrink-0 w-12 pt-0.5 tabular-nums">
              {ev.time}
            </span>
            <span 
              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColors[ev.color] || dotColors.cyan}`} 
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-slate-900 dark:text-[#F5F8FC] leading-snug">
                {ev.title}
              </p>
              {ev.subtitle && (
                <p className="text-xs text-slate-500 dark:text-[#B8C7D8] font-normal mt-0.5 leading-normal">
                  {ev.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
