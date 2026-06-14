import { motion } from 'motion/react';
import type { SideType } from '../types';

interface BackgroundProps {
  clip1: string;
  clip2: string;
  divider: string;
  hoveredSide: SideType;
  isMobile: boolean;
}

export const Background = ({ clip1, clip2, divider, hoveredSide, isMobile }: BackgroundProps) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <motion.div 
        className="absolute inset-0"
        animate={{ clipPath: clip1 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
        style={{ 
          backgroundColor: '#111111',
          backgroundImage: 'url(https://static.axtn.net/dash/svg/bg2.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto'
        }}
      />
      
      <motion.div 
        className="absolute inset-0 bg-slate-50"
        animate={{ clipPath: clip2 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
      </motion.div>

      {!isMobile && (
        <motion.div
          className="absolute inset-0 z-10"
          animate={{ 
            clipPath: divider,
            backgroundColor: hoveredSide === 'side1' ? '#5B89D2' : hoveredSide === 'side2' ? '#fb923c' : '#ffffff',
          }}
          style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
        />
      )}
    </div>
  );
};
