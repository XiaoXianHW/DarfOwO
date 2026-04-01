import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Terminal, Cpu, GitBranch, Users, Palette, Sparkles, Coffee, Heart } from 'lucide-react';
import type { SideType } from '../types';
import { config } from '../config';

const iconMap = { Terminal, Cpu, GitBranch, Users, Palette, Sparkles, Coffee, Heart };

interface MobileLayoutProps {
  hoveredSide: SideType;
  onSetHoveredSide: (side: SideType) => void;
  onOpenProfile: () => void;
}

export const MobileLayout = ({ hoveredSide, onSetHoveredSide, onOpenProfile }: MobileLayoutProps) => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col pointer-events-auto overflow-y-auto overflow-x-hidden">
      <div className="w-full flex justify-between items-center p-6 z-50">
        <a href={config.links.legacyMobile} className={`flex items-center gap-2 transition-colors ${hoveredSide === 'side2' ? 'text-slate-500 hover:text-slate-900' : 'text-white/50 hover:text-white'}`}>
          <ArrowLeft className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-widest">Legacy</span>
        </a>
      </div>

      <div className="w-full flex flex-col items-center justify-center mt-4 z-50">
        <motion.div
          className={`relative w-24 h-24 rounded-full border-2 shadow-2xl overflow-hidden cursor-pointer ${hoveredSide === 'side2' ? 'border-orange-500/20 shadow-orange-500/20' : 'border-white/20'}`}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenProfile}
        >
          <img src={config.avatars.default} alt={config.profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>
        <h1 className={`mt-4 text-2xl font-bold tracking-widest transition-colors ${hoveredSide === 'side2' ? 'text-slate-900' : 'text-white'}`}>{config.profile.displayName}</h1>
      </div>

      <div className="w-full flex justify-center gap-4 mt-8 px-6 z-50">
        <button 
          onClick={() => onSetHoveredSide('side1')}
          className={`px-6 py-2 rounded-full font-mono text-sm transition-all duration-300 ${hoveredSide === 'side1' || !hoveredSide ? 'bg-[#5B89D2]/20 text-[#5B89D2] border border-[#5B89D2]/50' : (hoveredSide === 'side2' ? 'bg-slate-200 text-slate-500 border border-slate-300' : 'bg-white/5 text-white/50 border border-white/10')}`}
        >
          {config.side1.title}
        </button>
        <button 
          onClick={() => onSetHoveredSide('side2')}
          className={`px-6 py-2 rounded-full font-serif italic text-sm transition-all duration-300 ${hoveredSide === 'side2' ? 'bg-orange-500/20 text-orange-600 border border-orange-500/50' : 'bg-white/5 text-white/50 border border-white/10'}`}
        >
          {config.side2.title}
        </button>
      </div>

      <div className="flex-1 w-full relative mt-8 z-40">
        <AnimatePresence mode="wait">
          {(!hoveredSide || hoveredSide === 'side1') && (
            <motion.div
              key="side1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full px-8 pb-32 flex flex-col items-center"
            >
              <Terminal className="w-10 h-10 text-[#5B89D2] mb-6" strokeWidth={1.5} />
              <div className="font-mono text-slate-300 text-xs leading-relaxed bg-black/60 p-4 rounded-xl border border-[#5B89D2]/30 w-full shadow-inner text-left backdrop-blur-sm mb-8">
                <span className="text-pink-500">const</span> <span className="text-blue-400">developer</span> = {'{'}
                <br/>
                &nbsp;&nbsp;name: <span className="text-green-400">"{config.profile.name}"</span>,
                <br/>
                &nbsp;&nbsp;status: <span className="text-green-400">"Compiling..."</span>
                <br/>
                {'}'};
              </div>
              
              <div className="flex flex-col items-start space-y-4 mb-8 w-full">
                {config.side1.items.map((item, i) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <div key={i} className="flex items-center gap-3 text-slate-300">
                      <Icon className="w-5 h-5 text-[#5B89D2]" />
                      <span className="font-bold font-mono text-sm tracking-wide">{item.title}</span>
                    </div>
                  );
                })}
              </div>
              
              <button 
                className="px-6 py-3 border border-[#5B89D2]/50 text-[#5B89D2] rounded-md font-mono text-sm font-bold bg-[#5B89D2]/10 w-full"
                onClick={() => window.open(config.links.side1.url, '_blank')}
              >
                {config.links.side1.label}
              </button>
            </motion.div>
          )}

          {hoveredSide === 'side2' && (
            <motion.div
              key="side2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full px-8 pb-32 flex flex-col items-center"
            >
              <Palette className="w-10 h-10 text-orange-500 mb-6" strokeWidth={1.5} />
              <h2 className="text-3xl font-serif italic tracking-tight text-slate-900 mb-8 text-center">
                {config.side2.heading.main} <br/><span className="font-sans font-bold text-orange-600 not-italic">{config.side2.heading.accent}</span>
              </h2>

              <div className="flex flex-col items-start space-y-4 mb-8 w-full">
                {config.side2.items.map((item, i) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <div key={i} className="flex items-center gap-3 text-slate-700">
                      <Icon className="w-5 h-5 text-orange-500" />
                      <span className="font-bold font-sans text-sm tracking-wide">{item.title}</span>
                    </div>
                  );
                })}
              </div>
              
              <button 
                className="px-6 py-3 border border-orange-500/50 text-orange-600 rounded-md font-mono text-sm font-bold hover:bg-orange-500 hover:text-white transition-colors w-full"
                onClick={() => window.open(config.links.side2.url, '_blank')}
              >
                {config.links.side2.label}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
