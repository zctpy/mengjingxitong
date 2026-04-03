import React from 'react';
import { motion } from 'motion/react';

export const BackgroundAtmosphere: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/2 -left-1/2 w-full h-full bg-[var(--zen-accent)] rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[var(--zen-accent)] rounded-full blur-[120px]"
      />
    </div>
  );
};
