import { motion } from 'motion/react';
import { Github, Mail, Send, Twitter, MessageSquare, Music, MessageCircle, Tv } from 'lucide-react';
import { config } from '../config';

const iconMap = { Github, Mail, Send, Twitter, MessageSquare, Music, MessageCircle, Tv };

export const Footer = () => {
  return (
    <div className="fixed bottom-4 sm:bottom-8 w-full px-4 sm:px-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sm:gap-0 z-[60] pointer-events-none mix-blend-difference text-white" style={{ perspective: '1000px' }}>
      <motion.div className="text-xs sm:text-sm font-mono text-center sm:text-left order-2 sm:order-1 opacity-70">
        © 2026 {config.profile.name}. All rights reserved.
      </motion.div>

      <motion.div className="flex flex-wrap gap-4 pointer-events-auto justify-center order-1 sm:order-3 opacity-70">
        {config.social.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <a key={item.name} href={item.url} target="_blank" rel="noreferrer" title={item.name} className="hover:opacity-100 transition-opacity">
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </motion.div>
    </div>
  );
};
