import { motion } from 'motion/react';
import { Terminal, Cpu, GitBranch, Users, Sparkles, Palette, Coffee, Heart } from 'lucide-react';
import type { SideType } from '../types';
import { config } from '../config';

interface SideCardProps {
  side: 'side1' | 'side2';
  clipPath: string;
  hoveredSide: SideType;
  isMobile: boolean;
  onHover: (side: SideType) => void;
}

const iconMap = { Terminal, Cpu, GitBranch, Users, Sparkles, Palette, Coffee, Heart };

const revealItem = {
  hide: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export const SideCard = ({ side, clipPath, hoveredSide, isMobile, onHover }: SideCardProps) => {
  const isSide1 = side === 'side1';
  const sideConfig = isSide1 ? config.side1 : config.side2;
  const items = sideConfig.items.map(item => ({
    icon: iconMap[item.icon as keyof typeof iconMap],
    title: item.title,
    desc: item.desc
  }));

  const isActive = hoveredSide === side;
  const isOpposite = hoveredSide === (isSide1 ? 'side2' : 'side1');
  const BigIcon = isSide1 ? Terminal : Palette;
  const accent = isSide1 ? 'text-[#5B89D2]' : 'text-orange-500';
  const link = isSide1 ? config.links.side1 : config.links.side2;

  return (
    <motion.div 
      className={`absolute inset-0 ${isSide1 ? 'z-20' : 'z-10'} flex items-center justify-center p-0 sm:p-8 pointer-events-none`}
      animate={{ clipPath }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
    >
      <div 
        className="relative w-full max-w-[1800px] h-full sm:h-[85vh] sm:min-h-[600px] sm:rounded-2xl pointer-events-auto cursor-pointer sm:cursor-default"
        onMouseEnter={() => onHover(side)}
        onClick={() => isMobile && onHover(side)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Default state — only the enlarged top icon */}
        {!isActive && (
          <motion.div
            className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none ${isSide1 ? 'pr-[50%]' : 'pl-[50%]'}`}
            initial={false}
            animate={{ opacity: isOpposite ? 0.15 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              layoutId={`side-icon-${side}`}
              className="block"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
            >
              <BigIcon
                className={`${isSide1 ? 'text-[#5B89D2]' : 'text-orange-500'} w-32 h-32 sm:w-56 sm:h-56`}
                strokeWidth={1}
              />
            </motion.span>
          </motion.div>
        )}

        {/* Hover state — full details */}
        <motion.div
          className={`absolute inset-0 flex flex-col z-10 ${isSide1 ? 'p-6 pt-12 pb-[15vh] sm:pb-16 sm:p-16 lg:pl-32' : 'p-6 pt-[15vh] pb-32 sm:pt-16 sm:p-16 lg:pr-32'} overflow-hidden`}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ pointerEvents: isActive ? 'auto' : 'none' }}
        >
          <motion.div
            className={`relative z-10 w-full max-w-md flex flex-col h-full justify-center ${isSide1 ? 'items-start text-left' : 'items-end text-right ml-auto'}`}
            variants={{ show: { transition: { delayChildren: 0.45, staggerChildren: 0.08 } } }}
            initial="hide"
            animate={isActive ? 'show' : 'hide'}
          >
            {isActive && (
              <motion.span
                layoutId={`side-icon-${side}`}
                className="block mb-5 sm:mb-6"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
              >
                <BigIcon className={`w-12 h-12 sm:w-14 sm:h-14 ${accent}`} strokeWidth={1.25} />
              </motion.span>
            )}

            {isSide1 ? (
              <motion.h2 variants={revealItem} className="font-mono text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-5">
                <span className="text-[#5B89D2]">&lt;</span>{sideConfig.heading.main}<span className="text-[#5B89D2]">{sideConfig.heading.accent}</span>
              </motion.h2>
            ) : (
              <motion.h2 variants={revealItem} className="font-serif italic text-4xl sm:text-6xl tracking-tight text-slate-900 mb-4 sm:mb-5">
                {sideConfig.heading.main} <span className="font-sans not-italic font-bold text-orange-600">{sideConfig.heading.accent}</span>
              </motion.h2>
            )}

            <motion.p variants={revealItem} className={`text-sm sm:text-[15px] leading-relaxed mb-7 sm:mb-8 max-w-sm ${isSide1 ? 'text-slate-400' : 'text-slate-600'}`}>
              {sideConfig.description}
            </motion.p>

            <div className={`w-full max-w-sm mb-8 border-t ${isSide1 ? 'border-white/10' : 'border-black/10'}`}>
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  variants={revealItem}
                  className={`flex items-center gap-4 py-3.5 border-b ${isSide1 ? 'border-white/10' : 'border-black/10'} ${isSide1 ? '' : 'flex-row-reverse'} group cursor-pointer`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${accent} transition-transform group-hover:scale-110`} />
                  <div className={`flex flex-col ${isSide1 ? 'items-start' : 'items-end'}`}>
                    <span className={`font-bold text-sm sm:text-base tracking-wide transition-colors ${isSide1 ? 'text-slate-100 group-hover:text-[#5B89D2]' : 'text-slate-800 group-hover:text-orange-600'}`}>{item.title}</span>
                    <span className="text-[11px] tracking-wide text-slate-500">{item.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={revealItem} className={`flex items-center gap-4 ${isSide1 ? '' : 'flex-row-reverse'}`}>
              <button
                className={`px-6 py-3 border ${isSide1 ? 'border-[#5B89D2]/50 text-[#5B89D2] hover:bg-[#5B89D2] hover:text-white' : 'border-orange-500/50 text-orange-600 hover:bg-orange-500 hover:text-white'} rounded-md font-mono text-xs sm:text-sm font-bold transition-colors pointer-events-auto w-fit`}
                onClick={(e) => { e.stopPropagation(); window.open(link.url, '_blank'); }}
              >
                {link.label}
              </button>
              <span className="text-[11px] sm:text-xs text-slate-500">{link.desc}</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className={`absolute inset-0 ${isSide1 ? 'bg-[#111111]/60' : 'bg-white/40'} backdrop-blur-xl z-20 pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpposite ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};
