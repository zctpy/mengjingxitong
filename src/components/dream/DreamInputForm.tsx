import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Quote, Heart, Activity, RefreshCw, ChevronRight, AlertTriangle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DreamInputFormProps {
  dreamText: string;
  setDreamText: (s: string) => void;
  emotion: string;
  setEmotion: (s: string) => void;
  behavior: string;
  setBehavior: (s: string) => void;
  isAnalyzing: boolean;
  handleAnalyze: () => void;
  error: string | null;
}

export const DreamInputForm: React.FC<DreamInputFormProps> = ({
  dreamText,
  setDreamText,
  emotion,
  setEmotion,
  behavior,
  setBehavior,
  isAnalyzing,
  handleAnalyze,
  error
}) => {
  const emotions = ['平静', '喜悦', '恐惧', '焦虑', '愤怒', '无感'];
  const behaviors = ['利他/精进', '正常', '懈怠', '起烦恼'];

  return (
    <motion.div 
      key="input"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl mx-auto space-y-12 no-print"
    >
      <div className="space-y-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--zen-accent)]/10 text-[var(--zen-accent)] text-[11px] font-bold uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5" />
          基于《大宝积经》108梦辨析
        </motion.div>
        <h2 className="text-5xl font-serif font-light tracking-tight leading-tight">记录您的梦境日志</h2>
        <p className="text-[var(--zen-ink)]/60 font-serif italic text-lg">“梦是您当前真实修行层级的外显。”</p>
      </div>

      <div className="bg-[var(--zen-card)] backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl shadow-[var(--zen-ink)]/10 border border-[var(--zen-border)] space-y-10 transition-all duration-500">
        <div className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-50 flex items-center gap-2 ml-2">
            <BookOpen className="w-3.5 h-3.5" /> 梦境内容
          </label>
          <div className="relative group">
            <textarea 
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="昨晚梦见了什么？请尽量描述细节、环境与人物..."
              className="w-full h-64 bg-[var(--zen-bg)]/30 rounded-3xl p-8 focus:outline-none focus:ring-2 focus:ring-[var(--zen-accent)]/20 transition-all resize-none text-xl font-serif leading-relaxed placeholder:opacity-40 text-[var(--zen-ink)] border border-[var(--zen-border)]"
            />
            <div className="absolute top-8 right-8 opacity-5 group-focus-within:opacity-10 transition-opacity">
              <Quote className="w-12 h-12 rotate-180" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-5">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-50 flex items-center gap-2 ml-2">
              <Heart className="w-3.5 h-3.5" /> 情绪基调
            </label>
            <div className="flex flex-wrap gap-3">
              {emotions.map(e => (
                <button
                  key={e}
                  onClick={() => setEmotion(e)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-sm transition-all border font-medium",
                    emotion === e 
                      ? "bg-[var(--zen-ink)] text-[var(--zen-bg)] border-[var(--zen-ink)] shadow-xl shadow-[var(--zen-ink)]/20 scale-105" 
                      : "bg-[var(--zen-bg)]/40 text-[var(--zen-ink)] border-[var(--zen-border)] hover:bg-[var(--zen-bg)]/60"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-50 flex items-center gap-2 ml-2">
              <Activity className="w-3.5 h-3.5" /> 近期行为
            </label>
            <div className="flex flex-wrap gap-3">
              {behaviors.map(b => (
                <button
                  key={b}
                  onClick={() => setBehavior(b)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-sm transition-all border font-medium",
                    behavior === b 
                      ? "bg-[var(--zen-accent)] text-white border-[var(--zen-accent)] shadow-xl shadow-[var(--zen-accent)]/20 scale-105" 
                      : "bg-[var(--zen-bg)]/40 text-[var(--zen-ink)] border-[var(--zen-border)] hover:bg-[var(--zen-bg)]/60"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log("Generate Report button clicked");
            handleAnalyze();
          }}
          disabled={isAnalyzing || !dreamText.trim()}
          className={cn(
            "w-full py-8 rounded-[2.5rem] font-bold tracking-[0.3em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group shadow-2xl relative overflow-hidden",
            isAnalyzing || !dreamText.trim()
              ? "bg-gray-200 text-gray-400"
              : "bg-[var(--zen-ink)] text-[var(--zen-bg)] hover:scale-[1.02] active:scale-[0.98] shadow-[var(--zen-ink)]/20"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-xl">正在读取潜意识数据...</span>
            </>
          ) : (
            <>
              <span className="text-xl">生成诊断报告</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </button>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">诊断失败</p>
              <p className="opacity-80">{error}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
