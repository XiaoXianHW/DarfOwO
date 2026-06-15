import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Music, MonitorSmartphone, Activity, ChevronRight, Terminal, Users, Palette, RotateCcw } from 'lucide-react';
import type { SideType } from '../types';
import { config } from '../config';

const menuItems = [
  { label: 'Music', zh: '音乐', icon: Music, path: '/music' },
  { label: 'Devices', zh: '设备', icon: MonitorSmartphone, path: '/devices' },
  { label: 'Status', zh: '状态', icon: Activity, path: '/status' },
  { label: 'Friends', zh: '朋友', icon: Users, path: '/friends' },
];

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
  // Menu icon sits over a dark surface except when the light (side2) persona is open
  const menuDark = isSide2;

  return (
    <div className="absolute inset-0 z-10 pointer-events-auto overflow-hidden">
      {/* Top bar — menu + reset */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-2 p-6 z-50">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="菜单"
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            menuDark ? 'text-slate-700' : 'text-white/80'
          }`}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <AnimatePresence>
          {hoveredSide && !menuOpen && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              onClick={() => onSetHoveredSide(null)}
              aria-label="复位"
              className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                isSide2
                  ? 'bg-black/5 text-slate-700 hover:bg-black/10'
                  : 'bg-white/10 text-white/85 hover:bg-white/15'
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              复位
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

      <AnimatePresence mode="wait">
        {!hoveredSide ? (
          /* Default — top: Rationality, bottom: Sensibility */
          <motion.div
            key="split"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col z-30"
          >
            <button
              onClick={() => onSetHoveredSide('side1')}
              className="h-1/2 w-full flex flex-col items-center justify-center gap-4 px-8"
            >
              <Terminal className="w-20 h-20 text-[#5B89D2]" strokeWidth={1} />
              <div className="text-center">
                <p className="font-mono text-2xl tracking-wide text-[#5B89D2]">{config.side1.title}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">理性 · 轻触展开</p>
              </div>
            </button>
            <button
              onClick={() => onSetHoveredSide('side2')}
              className="h-1/2 w-full flex flex-col items-center justify-center gap-4 px-8"
            >
              <Palette className="w-20 h-20 text-orange-500" strokeWidth={1} />
              <div className="text-center">
                <p className="font-serif italic text-2xl tracking-wide text-orange-500">{config.side2.title}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">感性 · 轻触展开</p>
              </div>
            </button>
          </motion.div>
        ) : (
          /* Expanded — avatar + content for the chosen persona */
          <motion.div
            key={hoveredSide}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8 pt-24 pb-28 overflow-y-auto"
          >
            <motion.div
              className={`relative w-28 h-28 rounded-full border-2 shadow-2xl overflow-hidden cursor-pointer shrink-0 ${
                isSide2 ? 'border-orange-500/40 shadow-orange-500/20' : 'border-[#5B89D2]/40 shadow-[#5B89D2]/20'
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenProfile}
            >
              <img
                src={isSide1 ? config.avatars.side1 : config.avatars.side2}
                alt={config.profile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {isSide1 ? (
              <div className="mt-8 w-full max-w-sm flex flex-col items-center">
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
                <button
                  className="px-6 py-3 border border-[#5B89D2]/50 text-[#5B89D2] rounded-md font-mono text-sm font-bold bg-[#5B89D2]/10 w-full"
                  onClick={() => window.open(config.links.side1.url, '_blank')}
                >
                  {config.links.side1.label}
                </button>
              </div>
            ) : (
              <div className="mt-8 w-full max-w-sm flex flex-col items-center">
                <Palette className="w-10 h-10 text-orange-500 mb-6" strokeWidth={1.5} />
                <h2 className="text-3xl font-serif italic tracking-tight text-slate-900 mb-8 text-center">
                  {config.side2.heading.main} <br/><span className="font-sans font-bold text-orange-600 not-italic">{config.side2.heading.accent}</span>
                </h2>
                <button
                  className="px-6 py-3 border border-orange-500/50 text-orange-600 rounded-md font-mono text-sm font-bold hover:bg-orange-500 hover:text-white transition-colors w-full"
                  onClick={() => window.open(config.links.side2.url, '_blank')}
                >
                  {config.links.side2.label}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
