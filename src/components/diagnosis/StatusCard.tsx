import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatusCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  subValue?: string;
  accentColor?: string;
  status?: '正常' | '偏差' | '危险';
}

export const StatusCard: React.FC<StatusCardProps> = ({ label, value, icon, subValue, status }) => {
  return (
    <div className="bg-[var(--zen-card)] backdrop-blur-xl p-8 rounded-[3rem] border border-[var(--zen-border)] shadow-2xl shadow-[var(--zen-ink)]/5 space-y-6 relative overflow-hidden group transition-all duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--zen-accent)]/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-700" />
      <div className="flex items-center justify-between relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">{label}</span>
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
          status === '正常' ? "bg-green-500/20 text-green-500" : 
          status === '偏差' ? "bg-yellow-500/20 text-yellow-500" : 
          status === '危险' ? "bg-red-500/20 text-red-500" : 
          "bg-[var(--zen-bg)]/50 text-[var(--zen-accent)]"
        )}>
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-4xl font-serif italic mb-2">{value}</div>
        {subValue && (
          <div className="text-[11px] text-[var(--zen-ink)] font-bold uppercase tracking-widest bg-[var(--zen-bg)]/50 px-4 py-1.5 rounded-full inline-block border border-[var(--zen-border)] transition-colors duration-500">
            {subValue}
          </div>
        )}
        {!subValue && label === '修行层级' && <div className="text-[11px] opacity-50 font-medium italic">基于十地检测表简化版</div>}
        {!subValue && label === '障碍识别' && <div className="text-[11px] opacity-50 font-medium italic">系统识别的核心偏差</div>}
      </div>
    </div>
  );
};
