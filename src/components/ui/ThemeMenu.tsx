import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Sparkles, Leaf, Sun, Cloud } from 'lucide-react';
import { Theme } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ThemeMenuProps {
  currentTheme: Theme;
  setTheme: (t: Theme) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeMenu: React.FC<ThemeMenuProps> = ({ currentTheme, setTheme, isOpen, onClose }) => {
  const themes: { id: Theme; name: string; icon: React.ReactNode; class: string }[] = [
    { id: 'platinum', name: '白金禅', icon: <Sparkles className="w-4 h-4" />, class: 'theme-platinum' },
    { id: 'forest', name: '墨绿林', icon: <Leaf className="w-4 h-4" />, class: 'theme-forest' },
    { id: 'amber', name: '琥珀光', icon: <Sun className="w-4 h-4" />, class: 'theme-amber' },
    { id: 'azure', name: '浅蓝云', icon: <Cloud className="w-4 h-4" />, class: 'theme-azure' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClose} />
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-[var(--zen-card)] backdrop-blur-2xl rounded-2xl shadow-2xl border border-[var(--zen-border)] p-2 z-20"
          >
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  currentTheme === t.id ? "bg-[var(--zen-ink)] text-[var(--zen-bg)]" : "hover:bg-[var(--zen-ink)]/5 text-[var(--zen-ink)]"
                )}
              >
                {t.icon}
                {t.name}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
