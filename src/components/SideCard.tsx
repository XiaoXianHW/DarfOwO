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

export const SideCard = ({ side, clipPath, hoveredSide, isMobile, onHover }: SideCardProps) => {
  const isSide1 = side === 'side1';
  const sideConfig = isSide1 ? config.side1 : config.side2;
  const items = sideConfig.items.map(item => ({
    icon: iconMap[item.icon as keyof typeof iconMap],
    title: item.title
  }));

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
        <motion.div
          className={`absolute inset-0 flex flex-col ${isSide1 ? 'p-6 pt-12 pb-[15vh] sm:pb-16 sm:p-16 lg:pl-32' : 'p-6 pt-[15vh] pb-32 sm:pt-16 sm:p-16 lg:pr-32'} overflow-hidden`}
          animate={{
            opacity: hoveredSide === (isSide1 ? 'side2' : 'side1') ? (isMobile ? 0 : 0.2) : 1,
            scale: hoveredSide === (isSide1 ? 'side2' : 'side1') ? 0.95 : hoveredSide === side ? 1.02 : 1,
            x: hoveredSide === (isSide1 ? 'side2' : 'side1') ? (isMobile ? 0 : (isSide1 ? -40 : 40)) : 0,
            y: hoveredSide === (isSide1 ? 'side2' : 'side1') ? (isMobile ? (isSide1 ? -20 : 20) : 0) : 0,
          }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
        >
          <div className={`relative z-10 w-full max-w-lg flex flex-col h-full justify-center ${isSide1 ? '' : 'items-end text-right ml-auto'}`}>
            <div className={`flex flex-col ${isSide1 ? 'items-start text-left' : 'items-end'} mb-8`}>
              {isSide1 ? (
                <>
                  <Terminal className="w-10 h-10 sm:w-12 sm:h-12 text-[#5B89D2] mb-4 sm:mb-6" strokeWidth={1.5} />
                  <div className="font-mono text-slate-300 text-xs sm:text-base leading-relaxed bg-black/60 p-4 sm:p-6 rounded-xl border border-[#5B89D2]/30 w-full shadow-inner text-left backdrop-blur-sm">
                    <span className="text-pink-500">const</span> <span className="text-blue-400">developer</span> = {'{'}
                    <br/>
                    &nbsp;&nbsp;name: <span className="text-green-400">"{config.profile.name}"</span>,
                    <br/>
                    &nbsp;&nbsp;status: <span className="text-green-400">"Compiling..."</span>
                    <br/>
                    {'}'};
                  </div>
                </>
              ) : (
                <>
                  <Palette className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 mb-4 sm:mb-6" strokeWidth={1.5} />
                  <h2 className="text-3xl sm:text-6xl font-serif italic tracking-tight text-slate-900 mb-4 sm:mb-6">
                    {config.side2.heading.main} <br/><span className="font-sans font-bold text-orange-600 not-italic">{config.side2.heading.accent}</span>
                  </h2>
                </>
              )}
            </div>

            <div className={`flex flex-col ${isSide1 ? 'items-start' : 'items-end'} space-y-4 mb-8 w-full`}>
              {items.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 ${isSide1 ? 'text-slate-300 hover:text-[#5B89D2]' : 'text-slate-700 hover:text-orange-600 flex-row-reverse'} transition-colors cursor-pointer group`}>
                  <item.icon className={`w-5 h-5 ${isSide1 ? 'text-[#5B89D2]' : 'text-orange-500'} group-hover:scale-110 transition-transform`} />
                  <span className={`font-bold text-sm sm:text-base tracking-wide`}>{item.title}</span>
                </div>
              ))}
            </div>
            
            <button 
              className={`px-6 py-3 border ${isSide1 ? 'border-[#5B89D2]/50 text-[#5B89D2] hover:bg-[#5B89D2] hover:text-white' : 'border-orange-500/50 text-orange-600 hover:bg-orange-500 hover:text-white'} rounded-md font-mono text-xs sm:text-sm font-bold transition-colors pointer-events-auto w-fit`}
              onClick={(e) => { 
                e.stopPropagation(); 
                window.open(isSide1 ? config.links.side1.url : config.links.side2.url, '_blank'); 
              }}
            >
              {isSide1 ? config.links.side1.label : config.links.side2.label}
            </button>
          </div>
        </motion.div>

        <motion.div
          className={`absolute inset-0 ${isSide1 ? 'bg-[#111111]/60' : 'bg-white/40'} backdrop-blur-xl z-20 pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: hoveredSide === (isSide1 ? 'side2' : 'side1') ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};
