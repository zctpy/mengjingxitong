import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { analyzeDream } from './services/geminiService';
import { Theme, DreamDiagnosis, HistoryItem } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BackgroundAtmosphere } from './components/layout/BackgroundAtmosphere';
import { DreamInputForm } from './components/dream/DreamInputForm';
import { DiagnosisReport } from './components/diagnosis/DiagnosisReport';
import { HistorySidebar } from './components/history/HistorySidebar';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--zen-bg)] p-8">
          <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl border border-red-100 text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">系统运行异常</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              很抱歉，程序在运行过程中遇到了不可预期的错误。这可能是由于数据格式不兼容或网络波动导致的。
            </p>
            <div className="p-4 bg-gray-50 rounded-xl text-left text-xs font-mono text-red-600 overflow-auto max-h-32">
              {this.state.error?.message}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重新加载系统
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [dreamText, setDreamText] = useState(() => localStorage.getItem('zen_dream_text') || '');
  const [emotion, setEmotion] = useState(() => localStorage.getItem('zen_emotion') || '平静');
  const [behavior, setBehavior] = useState(() => localStorage.getItem('zen_behavior') || '正常');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DreamDiagnosis | null>(() => {
    const saved = localStorage.getItem('zen_diagnosis');
    console.log("Initial diagnosis load from localStorage:", saved ? "FOUND" : "NOT FOUND");
    try {
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      console.log("Parsed diagnosis successfully");
      return parsed;
    } catch (e) {
      console.error("Failed to parse diagnosis from localStorage:", e);
      return null;
    }
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('zen_history');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('zen_theme') as Theme) || 'platinum');
  const [completedActions, setCompletedActions] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('zen_completed_actions');
    try {
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("App mounted/remounted. Heartbeat: " + new Date().toISOString());
    const handleUnload = () => console.log("Page unloading at: " + new Date().toISOString());
    window.addEventListener('beforeunload', handleUnload);
    
    // Check localStorage status
    try {
      const keys = Object.keys(localStorage);
      console.log("LocalStorage keys on mount:", keys);
      const diag = localStorage.getItem('zen_diagnosis');
      console.log("zen_diagnosis in localStorage on mount:", diag ? `EXISTS (${diag.length} bytes)` : "MISSING");
    } catch (e) {
      console.error("Error checking localStorage on mount:", e);
    }

    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  useEffect(() => {
    try {
      if (diagnosis) {
        localStorage.setItem('zen_diagnosis', JSON.stringify(diagnosis));
        console.log("Saved diagnosis to localStorage");
      } else {
        // IMPORTANT: Only remove if we are sure we want to clear it.
        // If the state is null but it exists in localStorage, it might be a race condition during mount.
        // However, since useState initializer is synchronous, if it's null here, it was null there.
        // The real issue is likely that we need to ensure we don't clear it unless explicitly requested.
        const exists = localStorage.getItem('zen_diagnosis');
        if (exists && !diagnosis) {
           console.warn("Diagnosis is null in state but exists in localStorage. Skipping removal to prevent race condition.");
           return;
        }
        localStorage.removeItem('zen_diagnosis');
        console.log("Removed diagnosis from localStorage");
      }
    } catch (e) {
      console.error("Failed to save diagnosis to localStorage:", e);
    }
    console.log("Diagnosis state updated:", diagnosis ? "REPORT_VIEW" : "INPUT_VIEW");
  }, [diagnosis]);

  useEffect(() => {
    localStorage.setItem('zen_completed_actions', JSON.stringify(Array.from(completedActions)));
  }, [completedActions]);

  useEffect(() => {
    if (error) {
      console.error("App error state set:", error);
    }
  }, [error]);

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
    console.log("handleAnalyze triggered", { dreamTextLength: dreamText.length, emotion, behavior });
    if (!dreamText.trim()) {
      console.warn("handleAnalyze aborted: dreamText is empty");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setCompletedActions(new Set());
    try {
      console.log("Calling analyzeDream...");
      const result = await analyzeDream(dreamText, emotion, behavior);
      console.log("analyzeDream result received:", result);
      
      if (!result || typeof result !== 'object') {
        throw new Error("AI引擎返回的数据格式不正确。");
      }

      setDiagnosis(result);
      setHistory(prev => {
        const newHistory = [{ ...result, date: new Date().toLocaleString(), text: dreamText }, ...prev];
        console.log("History updated, new size:", newHistory.length);
        return newHistory;
      });
    } catch (error) {
      console.error('Analysis failed in App.tsx:', error);
      setError(error instanceof Error ? error.message : '分析过程中出现未知错误，请稍后重试。');
    } finally {
      setIsAnalyzing(false);
      console.log("handleAnalyze finished");
    }
  };

  const reset = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    console.log("Manual reset triggered by user");
    setDiagnosis(null);
    setDreamText('');
    setEmotion('平静');
    setBehavior('正常');
    setCompletedActions(new Set());
    localStorage.removeItem('zen_diagnosis');
    localStorage.removeItem('zen_completed_actions');
    localStorage.removeItem('zen_dream_text');
    localStorage.removeItem('zen_emotion');
    localStorage.removeItem('zen_behavior');
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
${diagnosis.obstacleType !== '无' ? `障碍释义: ${diagnosis.obstacleDefinition}` : ''}

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
        .obstacle-box { background: #fdfaf0; border: 1px solid #e8e0c8; padding: 30px; border-radius: 24px; margin: 30px 0; }
        .obstacle-title { font-size: 11px; font-weight: bold; color: #8a7a4a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
        .obstacle-text { font-family: serif; font-size: 18px; font-style: italic; color: #6a5a3a; line-height: 1.6; }
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
        
        ${diagnosis.obstacleType !== '无' ? `
        <div class="obstacle-box">
            <div class="obstacle-title">${diagnosis.obstacleType} 深度释义</div>
            <div class="obstacle-text">${diagnosis.obstacleDefinition}</div>
        </div>
        ` : ''}

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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
