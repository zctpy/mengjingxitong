import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { analyzeDream } from './services/geminiService';
import { Theme, DreamDiagnosis, HistoryItem } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BackgroundAtmosphere } from './components/layout/BackgroundAtmosphere';
import { DreamInputForm } from './components/dream/DreamInputForm';
import { DiagnosisReport } from './components/diagnosis/DiagnosisReport';
import { HistorySidebar } from './components/history/HistorySidebar';

export default function App() {
  const [dreamText, setDreamText] = useState(() => localStorage.getItem('zen_dream_text') || '');
  const [emotion, setEmotion] = useState(() => localStorage.getItem('zen_emotion') || '平静');
  const [behavior, setBehavior] = useState(() => localStorage.getItem('zen_behavior') || '正常');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DreamDiagnosis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('zen_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('zen_theme') as Theme) || 'platinum');
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('zen_dream_text', dreamText);
  }, [dreamText]);

  useEffect(() => {
    localStorage.setItem('zen_emotion', emotion);
  }, [emotion]);

  useEffect(() => {
    localStorage.setItem('zen_behavior', behavior);
  }, [behavior]);

  useEffect(() => {
    localStorage.setItem('zen_theme', theme);
    const themeClasses: Record<Theme, string> = {
      platinum: 'theme-platinum',
      forest: 'theme-forest',
      amber: 'theme-amber',
      azure: 'theme-azure'
    };
    document.body.className = themeClasses[theme];
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zen_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!dreamText.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setCompletedActions(new Set());
    try {
      const result = await analyzeDream(dreamText, emotion, behavior);
      setDiagnosis(result);
      setHistory(prev => [{ ...result, date: new Date().toLocaleString(), text: dreamText }, ...prev]);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : '分析过程中出现未知错误，请稍后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setDiagnosis(null);
    setDreamText('');
    setEmotion('平静');
    setBehavior('正常');
    setCompletedActions(new Set());
  };

  const toggleAction = (index: number) => {
    setCompletedActions(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleCopy = () => {
    if (!diagnosis) return;
    const text = `
觉醒OS · 梦境诊断报告
日期: ${new Date().toLocaleString()}
梦境: ${dreamText}
分类: ${diagnosis.category}
状态: ${diagnosis.status}
修行层级: ${diagnosis.ground}
障碍识别: ${diagnosis.obstacleType}

解析: ${diagnosis.analysis}

修行指令:
${diagnosis.action.map((a, i) => `${i + 1}. ${a}`).join('\n')}

底层逻辑: ${diagnosis.logic}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportHTML = () => {
    if (!diagnosis) return;
    const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>觉醒OS 梦境诊断报告 - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1c1c1a; background: #f8f7f2; padding: 40px; }
        .card { max-width: 800px; margin: 0 auto; background: white; padding: 60px; border-radius: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); }
        h1 { font-family: serif; font-size: 32px; font-style: italic; margin-bottom: 8px; }
        .date { opacity: 0.4; font-size: 14px; margin-bottom: 40px; }
        .label { font-size: 11px; font-weight: bold; color: #5a5a40; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        .quote { font-family: serif; font-size: 20px; font-style: italic; color: #5a5a40; margin: 20px 0; padding-left: 20px; border-left: 2px solid #5a5a40; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 40px 0; }
        .stat { background: #fcfcf9; padding: 20px; border-radius: 20px; border: 1px solid rgba(0,0,0,0.03); }
        .stat-val { font-family: serif; font-size: 22px; font-style: italic; }
        .analysis { font-family: serif; font-size: 22px; line-height: 1.5; margin: 40px 0; }
        .actions { background: #1c1c1a; color: white; padding: 40px; border-radius: 32px; }
        .action-item { display: flex; gap: 15px; margin-bottom: 15px; align-items: flex-start; }
        .num { width: 24px; height: 24px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
        .footer { text-align: center; margin-top: 60px; font-size: 11px; opacity: 0.3; letter-spacing: 0.1em; }
    </style>
</head>
<body>
    <div class="card">
        <h1>觉醒OS 梦境诊断报告</h1>
        <div class="date">生成于 ${new Date().toLocaleString()}</div>
        
        <div class="label">梦境记录</div>
        <div class="quote">“${dreamText}”</div>

        <div class="grid">
            <div class="stat"><div class="label">当前状态</div><div class="stat-val">${diagnosis.status}</div></div>
            <div class="stat"><div class="label">修行层级</div><div class="stat-val">${diagnosis.ground}</div></div>
            <div class="stat"><div class="label">障碍识别</div><div class="stat-val">${diagnosis.obstacleType}</div></div>
        </div>

        <div class="label">深度解析</div>
        <div class="analysis">${diagnosis.analysis}</div>

        <div class="actions">
            <div class="label" style="color: rgba(255,255,255,0.4); margin-bottom: 24px;">今日修行指令</div>
            ${diagnosis.action.map((a, i) => `
                <div class="action-item">
                    <div class="num">${i + 1}</div>
                    <div>${a}</div>
                </div>
            `).join('')}
        </div>

        <div class="footer">
            觉醒OS · 梦境诊断系统 V4.5 | 修行不是“悟到什么”，而是“不断校准自己”。
        </div>
    </div>
</body>
</html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dream_Report_${new Date().getTime()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--zen-bg)] text-[var(--zen-ink)] font-sans atmosphere-bg selection:bg-[var(--zen-accent)] selection:text-white print:bg-white transition-colors duration-500">
      <BackgroundAtmosphere />
      
      <Header 
        theme={theme} 
        setTheme={setTheme} 
        showHistory={showHistory} 
        setShowHistory={setShowHistory} 
      />

      <main className="max-w-5xl mx-auto px-8 py-16 relative z-10">
        <AnimatePresence mode="wait">
          {!diagnosis ? (
            <DreamInputForm 
              dreamText={dreamText}
              setDreamText={setDreamText}
              emotion={emotion}
              setEmotion={setEmotion}
              behavior={behavior}
              setBehavior={setBehavior}
              isAnalyzing={isAnalyzing}
              handleAnalyze={handleAnalyze}
              error={error}
            />
          ) : (
            <DiagnosisReport 
              diagnosis={diagnosis}
              dreamText={dreamText}
              reset={reset}
              handleCopy={handleCopy}
              handleExportHTML={handleExportHTML}
              completedActions={completedActions}
              toggleAction={toggleAction}
              copySuccess={copySuccess}
            />
          )}
        </AnimatePresence>
      </main>

      <HistorySidebar 
        history={history} 
        showHistory={showHistory} 
        setShowHistory={setShowHistory} 
      />

      <Footer />
    </div>
  );
}
