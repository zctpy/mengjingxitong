import React, { useState } from 'react';
import { Sparkles, Palette, History } from 'lucide-react';
import { Theme } from '../../types';
import { ThemeMenu } from '../ui/ThemeMenu';

interface HeaderProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  showHistory: boolean;
  setShowHistory: (s: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, showHistory, setShowHistory }) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="border-b border-[var(--zen-border)] bg-[var(--zen-card)] backdrop-blur-xl sticky top-0 z-50 no-print transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[var(--zen-ink)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--zen-ink)]/20 transition-colors duration-500">
            <Sparkles className="text-[var(--zen-bg)] w-6 h-6 transition-colors duration-500" />
          </div>
          <div>
            <h1 className="font-serif italic text-2xl tracking-tight leading-none">觉醒OS</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 mt-1">Dream Diagnosis System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="w-10 h-10 flex items-center justify-center hover:bg-[var(--zen-ink)]/5 rounded-full transition-all"
              title="切换主题"
            >
              <Palette className="w-5 h-5 opacity-60" />
            </button>
            <ThemeMenu 
              currentTheme={theme} 
              setTheme={setTheme} 
              isOpen={showThemeMenu} 
              onClose={() => setShowThemeMenu(false)} 
            />
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--zen-ink)]/5 rounded-full transition-all"
            title="历史记录"
          >
            <History className="w-5 h-5 opacity-60" />
          </button>
        </div>
      </div>
    </header>
  );
};
