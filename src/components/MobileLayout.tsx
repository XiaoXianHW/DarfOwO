import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, Music, MonitorSmartphone, Activity, ChevronRight, Users, RotateCcw,
  Terminal, Palette, Cpu, GitBranch, Sparkles, Heart,
} from 'lucide-react';
import type { SideType } from '../types';
import { config } from '../config';

const menuItems = [
  { label: 'Music', zh: '音乐', icon: Music, path: '/music' },
  { label: 'Devices', zh: '设备', icon: MonitorSmartphone, path: '/devices' },
  { label: 'Status', zh: '状态', icon: Activity, path: '/status' },
  { label: 'Friends', zh: '朋友', icon: Users, path: '/friends' },
];

const iconMap = { Terminal, Palette, Cpu, GitBranch, Sparkles, Heart };

const revealItem = {
  hide: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

interface MobileLayoutProps {
  hoveredSide: SideType;
  onSetHoveredSide: (side: SideType) => void;
  onOpenProfile: () => void;
}

export const MobileLayout = ({ hoveredSide, onSetHoveredSide, onOpenProfile }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isSide1 = hoveredSide === 'side1';
  const isSide2 = hoveredSide === 'side2';

  // Menu / reset icon sits over a dark surface except when the light (side2) persona is open
  const onLight = isSide2;
  const sc = isSide1 ? config.side1 : config.side2;
  const lk = isSide1 ? config.links.side1 : config.links.side2;
  const PersonaIcon = isSide1 ? Terminal : Palette;
  const accent = isSide1 ? 'text-[#5B89D2]' : 'text-orange-500';
  const avatarSrc = !hoveredSide
    ? config.avatars.default
    : isSide1 ? config.avatars.side1 : config.avatars.side2;

  return (
    <div className="absolute inset-0 z-10 pointer-events-auto overflow-hidden">
      {/* Top bar — menu + reset (icon only) */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-1 p-6 z-50">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="菜单"
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            onLight ? 'text-slate-700' : 'text-white/80'
          }`}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <AnimatePresence>
          {hoveredSide && !menuOpen && (
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              onClick={() => onSetHoveredSide(null)}
              aria-label="复位"
              className={`flex h-10 w-10 items-center justify-center transition-colors ${
                onLight ? 'text-slate-600 hover:text-slate-900' : 'text-white/70 hover:text-white'
              }`}
            >
              <RotateCcw className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
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
              <button
                onClick={() => { setMenuOpen(false); onOpenProfile(); }}
                className="group mb-1 flex w-full items-center gap-3 rounded-xl border-b border-white/10 px-3 pb-3 pt-2 text-left text-white/85 transition-colors hover:bg-white/10"
              >
                <img
                  src={config.avatars.default}
                  alt={config.profile.name}
                  className="h-10 w-10 rounded-lg border border-white/15 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium">
                    {config.profile.name}
                    <span className="ml-1.5 text-[11px] font-light text-white/40">{config.profile.alias}</span>
                  </span>
                  <span className="block text-[11px] text-white/40">查看资料卡 · Profile</span>
                </span>
                <ChevronRight className="h-4 w-4 text-white/25 transition-colors group-hover:text-white/70" />
              </button>

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
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Default — top: Rationality, bottom: Sensibility (tap regions) */}
      {!hoveredSide && (
        <motion.div
          key="split"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20"
        >
          <button onClick={() => onSetHoveredSide('side1')} className="absolute top-0 left-0 right-0 h-1/2 w-full" aria-label="理性" />
          <button onClick={() => onSetHoveredSide('side2')} className="absolute bottom-0 left-0 right-0 h-1/2 w-full" aria-label="感性" />

          <div className="absolute top-[17%] left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">
            <Terminal className="w-12 h-12 text-[#5B89D2]" strokeWidth={1} />
            <div className="text-center">
              <p className="font-mono text-xl tracking-wide text-[#5B89D2]">{config.side1.title}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">理性 · 轻触展开</p>
            </div>
          </div>

          <div className="absolute bottom-[17%] left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">
            <div className="text-center">
              <p className="font-serif italic text-xl tracking-wide text-orange-500">{config.side2.title}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">感性 · 轻触展开</p>
            </div>
            <Palette className="w-12 h-12 text-orange-500" strokeWidth={1} />
          </div>
        </motion.div>
      )}

      {/* Expanded — detail content (icon sits under the avatar) */}
      {hoveredSide && (
        <motion.div
          key={hoveredSide}
          variants={{ show: { transition: { delayChildren: 0.4, staggerChildren: 0.08 } } }}
          initial="hide"
          animate="show"
          className="absolute inset-0 z-20 flex flex-col items-center px-8 pt-[24vh] pb-24 overflow-y-auto"
        >
          <div className="w-full max-w-xs flex flex-col items-center text-center">
            <motion.div variants={revealItem}>
              <PersonaIcon className={`w-8 h-8 mb-4 ${accent}`} strokeWidth={1.5} />
            </motion.div>

            {isSide1 ? (
              <motion.h2 variants={revealItem} className="font-mono text-3xl font-bold text-white mb-4">
                <span className="text-[#5B89D2]">&lt;</span>{config.side1.heading.main}<span className="text-[#5B89D2]">{config.side1.heading.accent}</span>
              </motion.h2>
            ) : (
              <motion.h2 variants={revealItem} className="font-serif italic text-4xl tracking-tight text-slate-900 mb-4">
                {config.side2.heading.main} <span className="font-sans not-italic font-bold text-orange-600">{config.side2.heading.accent}</span>
              </motion.h2>
            )}

            <motion.p variants={revealItem} className={`text-sm leading-relaxed mb-7 ${isSide1 ? 'text-slate-400' : 'text-slate-600'}`}>
              {sc.description}
            </motion.p>

            <div className={`w-full mb-7 border-t ${isSide1 ? 'border-white/10' : 'border-black/10'}`}>
              {sc.items.map((item, i) => {
                const ItemIcon = iconMap[item.icon as keyof typeof iconMap];
                return (
                  <motion.div
                    key={i}
                    variants={revealItem}
                    className={`flex items-center gap-4 py-3 border-b text-left ${isSide1 ? 'border-white/10' : 'border-black/10'}`}
                  >
                    <ItemIcon className={`w-5 h-5 shrink-0 ${accent}`} />
                    <div className="flex flex-col">
                      <span className={`font-bold text-sm tracking-wide ${isSide1 ? 'text-slate-100' : 'text-slate-800'}`}>{item.title}</span>
                      <span className="text-[11px] tracking-wide text-slate-500">{item.desc}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={revealItem} className="w-full flex flex-col items-center">
              <button
                className={`w-full px-6 py-3 border rounded-md font-mono text-sm font-bold transition-colors ${
                  isSide1
                    ? 'border-[#5B89D2]/50 text-[#5B89D2] bg-[#5B89D2]/10 hover:bg-[#5B89D2] hover:text-white'
                    : 'border-orange-500/50 text-orange-600 hover:bg-orange-500 hover:text-white'
                }`}
                onClick={() => window.open(lk.url, '_blank')}
              >
                {lk.label}
              </button>
              <span className="mt-3 text-[11px] tracking-wide text-slate-500">{lk.desc}</span>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Avatar — default center, smoothly moves up into the selected persona */}
      <motion.div
        className={`absolute left-1/2 z-40 w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-2xl overflow-hidden ${
          isSide2 ? 'border-orange-500/40 shadow-orange-500/20' : isSide1 ? 'border-[#5B89D2]/40 shadow-[#5B89D2]/20' : 'border-white/20 shadow-[#5B89D2]/20'
        }`}
        animate={{ top: hoveredSide ? '16%' : '50%', scale: hoveredSide ? 0.82 : 1 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.7 }}
        style={{ pointerEvents: hoveredSide ? 'auto' : 'none' }}
        whileTap={hoveredSide ? { scale: 0.78 } : undefined}
        onClick={hoveredSide ? onOpenProfile : undefined}
      >
        <img src={avatarSrc} alt={config.profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </motion.div>
    </div>
  );
};
