import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Music, MonitorSmartphone, Activity, ChevronRight, Terminal, Cpu, GitBranch, Users, Palette, Sparkles, Coffee, Heart } from 'lucide-react';
import type { SideType } from '../types';
import { config } from '../config';

const iconMap = { Terminal, Cpu, GitBranch, Users, Palette, Sparkles, Coffee, Heart };

const menuItems = [
  { label: 'Music', zh: '音乐', icon: Music, path: '/music' },
  { label: 'Devices', zh: '设备', icon: MonitorSmartphone, path: '/devices' },
  { label: 'Status', zh: '状态', icon: Activity, path: '/status' },
];

interface MobileLayoutProps {
  hoveredSide: SideType;
  onSetHoveredSide: (side: SideType) => void;
  onOpenProfile: () => void;
}

export const MobileLayout = ({ hoveredSide, onSetHoveredSide, onOpenProfile }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const side2Active = hoveredSide === 'side2';
  const side1Active = hoveredSide === 'side1' || !hoveredSide;

  return (
    <div className="absolute inset-0 z-10 flex flex-col pointer-events-auto overflow-y-auto overflow-x-hidden">
      {/* Top bar — menu button (replaces Legacy) */}
      <div className="w-full flex justify-between items-center p-6 z-50">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="菜单"
          className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
            side2Active
              ? 'border-slate-300 bg-white/40 text-slate-700'
              : 'border-white/15 bg-white/5 text-white/80 backdrop-blur-sm'
          }`}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="absolute inset-0 z-[55]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="absolute left-6 top-[72px] z-[60] w-60 overflow-hidden rounded-2xl border border-white/15 bg-black/70 p-2 shadow-2xl backdrop-blur-2xl"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => { setMenuOpen(false); navigate(item.path); }}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-white/85 transition-colors hover:bg-white/10"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/90">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{item.label}</span>
                      <span className="block text-[11px] text-white/40">{item.zh}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/25 transition-colors group-hover:text-white/70" />
                  </button>
                );
              })}
              <a
                href={config.links.legacyMobile}
                className="mt-1 block rounded-xl px-3 py-2.5 text-center font-mono text-[11px] uppercase tracking-widest text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
              >
                Legacy ↗
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Avatar + name */}
      <div className="w-full flex flex-col items-center justify-center mt-2 z-40">
        <motion.div
          className={`relative w-28 h-28 rounded-full border-2 shadow-2xl overflow-hidden cursor-pointer ${side2Active ? 'border-orange-500/30 shadow-orange-500/20' : 'border-white/20 shadow-[#5B89D2]/20'}`}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenProfile}
        >
          <img src={config.avatars.default} alt={config.profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>
        <h1 className={`mt-4 text-3xl font-bold tracking-widest transition-colors ${side2Active ? 'text-slate-900' : 'text-white'}`}>{config.profile.displayName}</h1>
        <p className={`mt-1 font-serif italic text-sm tracking-wider transition-colors ${side2Active ? 'text-slate-500' : 'text-white/50'}`}>
          {config.profile.tagline.main}
        </p>
      </div>

      {/* Persona switch — text + "/" separator, no button frames */}
      <div className="w-full flex flex-col items-center mt-6 px-6 z-40">
        <div className="flex items-center gap-4 text-xl">
          <button
            onClick={() => onSetHoveredSide('side1')}
            className={`relative font-mono tracking-wide transition-all duration-300 ${
              side1Active ? 'text-[#5B89D2]' : (side2Active ? 'text-slate-400' : 'text-white/35')
            }`}
          >
            {config.side1.title}
            {side1Active && (
              <motion.span layoutId="persona-underline" className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-[#5B89D2]" />
            )}
          </button>
          <span className={`text-lg ${side2Active ? 'text-slate-300' : 'text-white/20'}`}>/</span>
          <button
            onClick={() => onSetHoveredSide('side2')}
            className={`relative font-serif italic transition-all duration-300 ${
              side2Active ? 'text-orange-500' : 'text-white/35'
            }`}
          >
            {config.side2.title}
            {side2Active && (
              <motion.span layoutId="persona-underline" className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-orange-500" />
            )}
          </button>
        </div>
        <p className={`mt-3 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors ${side2Active ? 'text-slate-400' : 'text-white/30'}`}>
          轻触切换 · Tap to switch
        </p>
      </div>

      {/* Side content */}
      <div className="flex-1 w-full relative mt-8 z-30">
        <AnimatePresence mode="wait">
          {side1Active && (
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

          {side2Active && (
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
