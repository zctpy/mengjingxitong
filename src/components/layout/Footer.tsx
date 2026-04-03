import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="max-w-5xl mx-auto px-8 py-20 border-t border-[var(--zen-border)] text-center space-y-6 no-print">
      <div className="flex items-center justify-center gap-3 opacity-20">
        <div className="h-px w-12 bg-[var(--zen-ink)]" />
        <p className="text-xs font-bold uppercase tracking-[0.3em]">觉醒OS · 梦境诊断系统</p>
        <div className="h-px w-12 bg-[var(--zen-ink)]" />
      </div>
      <p className="text-xs font-serif italic opacity-30 max-w-lg mx-auto leading-relaxed">
        本系统基于《大宝积经》卷十五“108梦”经文依据开发。修行不是“悟到什么”，而是“不断校准自己”。
      </p>
    </footer>
  );
};
