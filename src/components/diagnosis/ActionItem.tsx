import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ActionItemProps {
  index: number;
  text: string;
  isCompleted: boolean;
  onToggle: () => void;
}

export const ActionItem: React.FC<ActionItemProps> = ({ index, text, isCompleted, onToggle }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + (index * 0.1) }}
      onClick={onToggle}
      className={cn(
        "flex items-start gap-6 p-6 rounded-[2rem] border transition-all cursor-pointer select-none group/item",
        isCompleted 
          ? "bg-white/5 opacity-40 border-transparent" 
          : "bg-white/10 border-white/10 hover:bg-white/20 hover:translate-x-2",
        "print:bg-gray-50 print:border-gray-100 print:opacity-100"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 transition-all shadow-inner",
        isCompleted ? "bg-green-500/20 text-green-400" : "bg-white/10 group-hover/item:bg-white/20",
        "print:bg-gray-200"
      )}>
        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
      </div>
      <p className={cn(
        "text-xl font-medium leading-snug transition-all",
        isCompleted && "line-through decoration-1 opacity-60"
      )}>{text}</p>
    </motion.div>
  );
};
