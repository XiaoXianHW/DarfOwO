import { motion } from 'motion/react';
import type { IconType } from 'react-icons';
import { FaQq, FaDiscord, FaTelegram, FaXTwitter, FaGithub } from 'react-icons/fa6';
import { HiMail } from 'react-icons/hi';
import { RiNeteaseCloudMusicLine } from 'react-icons/ri';
import { SiBilibili } from 'react-icons/si';
import { config } from '../config';
import type { SideType } from '../types';

const iconMap: Record<string, IconType> = {
  FaQq,
  HiMail,
  RiNeteaseCloudMusicLine,
  SiBilibili,
  FaDiscord,
  FaTelegram,
  FaXTwitter,
  FaGithub,
};

interface FooterProps {
  isMobile: boolean;
  hoveredSide: SideType;
}

export const Footer = ({ isMobile, hoveredSide }: FooterProps) => {
  // On mobile the contact row stays hidden until a side (persona) is chosen.
  const showContacts = !isMobile || hoveredSide !== null;

  return (
    <div className="fixed bottom-4 sm:bottom-8 w-full px-4 sm:px-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sm:gap-0 z-[60] pointer-events-none mix-blend-difference text-white" style={{ perspective: '1000px' }}>
      <motion.div className="text-xs sm:text-sm font-mono text-center sm:text-left order-2 sm:order-1 opacity-70">
        © 2026 {config.profile.name}. All rights reserved.
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-4 justify-center order-1 sm:order-3"
        initial={false}
        animate={{ opacity: showContacts ? 0.7 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ pointerEvents: showContacts ? 'auto' : 'none' }}
      >
        {config.contacts.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              title={`${item.name} · ${item.value}`}
              className="hover:opacity-100 transition-opacity"
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </motion.div>
    </div>
  );
};
