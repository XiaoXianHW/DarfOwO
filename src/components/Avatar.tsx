import { motion } from 'motion/react';
import type { SideType, AvatarAnimation } from '../types';
import { config } from '../config';

interface AvatarProps {
  hoveredSide: SideType;
  isProfileOpen: boolean;
  avatarAnim: AvatarAnimation;
  onOpenProfile: () => void;
}

export const Avatar = ({ hoveredSide, isProfileOpen, avatarAnim, onOpenProfile }: AvatarProps) => {
  return (
    <motion.div
      className="fixed z-50 pointer-events-none flex items-center justify-center"
      animate={{ ...avatarAnim }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.8 }}
    >
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotateZ: [-2, 2, -2],
          scale: [1, 1.02, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }}
        className="relative w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64"
      >
        <motion.div
          className="absolute inset-0 cursor-pointer group"
          animate={{ opacity: (!hoveredSide && !isProfileOpen) ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => !hoveredSide && onOpenProfile()}
          style={{ pointerEvents: (!hoveredSide && !isProfileOpen) ? 'auto' : 'none' }}
        >
          <img
            src={config.avatars.default}
            alt="Default Avatar"
            className="w-full h-full object-cover rounded-full border-[3px] border-white/50 shadow-2xl shadow-black/20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-mono text-xs font-bold text-center px-2">
              [ REVEAL ]<br/>SOUL
            </span>
          </div>
        </motion.div>
        <motion.img
          src={config.avatars.side1}
          alt="Rationality Avatar"
          animate={{ opacity: hoveredSide === 'side1' ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-cover rounded-full border-[3px] border-[#5B89D2] shadow-2xl shadow-[#5B89D2]/50"
          referrerPolicy="no-referrer"
        />
        <motion.img
          src={config.avatars.side2}
          alt="Sensibility Avatar"
          animate={{ opacity: hoveredSide === 'side2' ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-cover rounded-full border-[3px] border-orange-400 shadow-2xl shadow-orange-500/50"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </motion.div>
  );
};
