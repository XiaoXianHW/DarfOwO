import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface BentoCardProps {
  className?: string;
  children: ReactNode;
  color?: string;
  delay?: number;
}

export const BentoCard = ({ className = '', children, color = 'from-white/5 to-white/5', delay = 0 }: BentoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative group overflow-hidden rounded-3xl bg-[#1a1a1a] border border-white/5 backdrop-blur-md hover:bg-[#222] transition-all duration-500 ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10 h-full w-full p-6 flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};
