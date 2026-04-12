import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Download, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Compass, Zap, Quote, Sparkles, Info } from 'lucide-react';
import { DreamDiagnosis } from '../../types';
import { StatusCard } from './StatusCard';
import { ActionItem } from './ActionItem';

interface DiagnosisReportProps {
  diagnosis: DreamDiagnosis;
  dreamText: string;
  reset: () => void;
  handleCopy: () => void;
  handleExportHTML: () => void;
  completedActions: Set<number>;
  toggleAction: (i: number) => void;
  copySuccess: boolean;
}

export const DiagnosisReport: React.FC<DiagnosisReportProps> = ({
  diagnosis,
  dreamText,
  reset,
  handleCopy,
  handleExportHTML,
  completedActions,
  toggleAction,
  copySuccess
}) => {
  console.log("DiagnosisReport rendering", { diagnosis, dreamText });
  return (
    <motion.div 
      key="diagnosis"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 no-print">
        <div className="space-y-2">
          <button 
            onClick={reset}
            className="flex items-center gap-2 text-[var(--zen-ink)]/60 hover:text-[var(--zen-ink)] transition-colors text-sm font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> 返回记录
          </button>
          <h2 className="text-5xl font-serif font-light tracking-tight">梦境诊断报告</h2>
          <p className="text-[var(--zen-ink)]/60 font-serif italic text-lg">生成的修行指令具有实时校准意义</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCopy}
            className="p-4 bg-[var(--zen-card)] backdrop-blur-xl border border-[var(--zen-border)] rounded-2xl hover:shadow-xl transition-all relative group"
            title="复制文本"
          >
            <Copy className="w-5 h-5 opacity-60" />
            {copySuccess && (
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[var(--zen-ink)] text-[var(--zen-bg)] text-[10px] px-3 py-1.5 rounded-lg shadow-xl">已复制</span>
            )}
          </button>
          <button 
            onClick={handleExportHTML}
            className="p-4 bg-[var(--zen-card)] backdrop-blur-xl border border-[var(--zen-border)] rounded-2xl hover:shadow-xl transition-all"
            title="导出网页"
          >
            <Download className="w-5 h-5 opacity-60" />
          </button>
          <button 
            onClick={() => window.print()}
            className="p-4 bg-[var(--zen-card)] backdrop-blur-xl border border-[var(--zen-border)] rounded-2xl hover:shadow-xl transition-all"
            title="导出PDF"
          >
            <FileText className="w-5 h-5 opacity-60" />
          </button>
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block text-center space-y-4 mb-12 border-b border-gray-100 pb-12">
        <h1 className="text-5xl font-serif italic">觉醒OS 梦境诊断报告</h1>
        <p className="opacity-40 text-sm tracking-widest uppercase font-bold">生成日期: {new Date().toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatusCard 
          label="当前状态" 
          value={diagnosis.status} 
          status={diagnosis.status}
          subValue={diagnosis.category}
          icon={diagnosis.status === '正常' ? <CheckCircle2 className="w-6 h-6" /> : diagnosis.status === '偏差' ? <AlertTriangle className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
        />
        <StatusCard 
          label="修行层级" 
          value={diagnosis.ground} 
          icon={<Compass className="w-6 h-6" />}
        />
        <StatusCard 
          label="障碍识别" 
          value={diagnosis.obstacleType} 
          icon={<Zap className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-12">
          <div className="space-y-6">
            <label className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
              <Quote className="w-3.5 h-3.5" /> 梦境回顾
            </label>
            <p className="text-3xl font-serif italic leading-relaxed text-[var(--zen-ink)]/80 pl-10 border-l-4 border-[var(--zen-accent)]/20">
              “{dreamText}”
            </p>
          </div>

          <div className="space-y-6">
            <label className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> 潜意识深度解析
            </label>
            <p className="text-2xl font-serif leading-relaxed opacity-90 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-[var(--zen-accent)]">
              {diagnosis.analysis}
            </p>
          </div>

          {diagnosis.obstacleType !== '无' && (
            <div className="space-y-6 bg-[var(--zen-accent)]/5 p-10 rounded-[2.5rem] border border-[var(--zen-accent)]/10">
              <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--zen-accent)] flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5" /> {diagnosis.obstacleType}深度释义
              </label>
              <p className="text-xl font-serif leading-relaxed opacity-80 italic">
                {diagnosis.obstacleDefinition}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[var(--zen-ink)] text-[var(--zen-bg)] p-12 rounded-[3.5rem] space-y-10 shadow-2xl shadow-[var(--zen-ink)]/30 relative overflow-hidden print:bg-white print:text-black print:shadow-none print:border print:border-gray-100 transition-all duration-500">
            <div className="absolute top-0 right-0 p-12 opacity-5 print:hidden">
              <Sparkles className="w-64 h-64" />
            </div>
            
            <div className="space-y-10 relative z-10">
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-50 print:text-gray-400">今日修行指令</h3>
                <p className="text-xs italic opacity-40">必须执行以校准系统</p>
              </div>
              
              <div className="grid grid-cols-1 gap-5">
                {diagnosis.action.map((a, i) => (
                  <ActionItem 
                    key={i} 
                    index={i} 
                    text={a} 
                    isCompleted={completedActions.has(i)} 
                    onToggle={() => toggleAction(i)} 
                  />
                ))}
              </div>

              <div className="pt-10 border-t border-white/10 flex items-center gap-4 text-xs opacity-40 italic print:text-gray-400 print:border-gray-100">
                <Info className="w-4 h-4" />
                底层算法：{diagnosis.logic}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
