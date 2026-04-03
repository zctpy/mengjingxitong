import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, History } from 'lucide-react';
import { HistoryItem } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HistorySidebarProps {
  history: HistoryItem[];
  showHistory: boolean;
  setShowHistory: (s: boolean) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, showHistory, setShowHistory }) => {
  return (
    <AnimatePresence>
      {showHistory && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHistory(false)}
            className="fixed inset-0 bg-[var(--zen-ink)]/20 backdrop-blur-md z-[60] no-print"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--zen-card)] z-[70] shadow-2xl p-10 overflow-y-auto no-print transition-colors duration-500"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl font-serif italic leading-none">历史诊断日志</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-2">Historical Records</p>
              </div>
              <button onClick={() => setShowHistory(false)} className="p-3 hover:bg-[var(--zen-bg)] rounded-full transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-8">
              {history.length === 0 ? (
                <div className="text-center py-32 space-y-4 opacity-20">
                  <History className="w-12 h-12 mx-auto" />
                  <p className="font-serif italic">暂无记录</p>
                </div>
              ) : (
                history.map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-8 bg-[var(--zen-bg)] rounded-[2rem] space-y-4 border border-[var(--zen-ink)]/5 hover:shadow-xl hover:shadow-[var(--zen-ink)]/5 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">{item.date}</span>
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-lg",
                        item.status === '正常' ? "bg-green-100 text-green-700" : 
                        item.status === '偏差' ? "bg-yellow-100 text-yellow-700" : 
                        "bg-red-100 text-red-700"
                      )}>{item.status}</span>
                    </div>
                    <p className="text-base font-serif italic leading-relaxed opacity-60 line-clamp-2 group-hover:opacity-100 transition-opacity">“{item.text}”</p>
                    <div className="flex gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-[var(--zen-card)] px-2.5 py-1 rounded-full border border-[var(--zen-ink)]/5 transition-colors duration-500">{item.category}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-[var(--zen-card)] px-2.5 py-1 rounded-full border border-[var(--zen-ink)]/5 transition-colors duration-500">{item.ground}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
