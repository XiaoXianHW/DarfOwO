import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Monitor, Music, Activity, Users, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

const getAge = (birthday: string) => {
  const b = new Date(birthday);
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
  return age;
};

const iconMap = { Monitor, Music, Activity, Users };
const colorMap = {
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-300' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  green: { bg: 'bg-green-500/20', text: 'text-green-400' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-400' }
};

interface ProfileOverlayProps {
  onClose: () => void;
}

export const ProfileOverlay = ({ onClose }: ProfileOverlayProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 pointer-events-auto"
    >
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <motion.div
        initial={{ scale: 0.95, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 10, opacity: 0 }}
        className="relative w-full max-w-[900px] h-auto max-h-[85vh] rounded-3xl bg-white/10 dark:bg-black/40 backdrop-blur-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col sm:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-full sm:w-2/5 p-6 sm:p-10 border-b sm:border-b-0 sm:border-r border-white/10 flex flex-col shrink-0 bg-black/20">
          <img src={config.avatars.default} alt={config.profile.name} className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl border border-white/20 mb-4 sm:mb-6 shadow-lg object-cover" referrerPolicy="no-referrer" />
          <h2 className="text-3xl sm:text-[2.6rem] font-bold text-white tracking-tight leading-none">
            {config.profile.name}
          </h2>
          <p className="mt-2 text-sm sm:text-base font-light tracking-wide text-white/45">
            {config.profile.alias}
          </p>
          <p className="mt-3 mb-5 sm:mb-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] text-white/50">
            Age {getAge(config.profile.birthday)} / {config.profile.roles.join(' / ')}
          </p>
          <p className="text-white/70 text-[13px] sm:text-sm leading-relaxed mb-4 sm:mb-5 font-light whitespace-pre-line">
            {config.profile.bio}
          </p>
          <blockquote className="mb-5 sm:mb-6 border-l-2 border-white/15 pl-3.5 text-[12px] sm:text-[13px] italic leading-relaxed text-white/55">
            {config.profile.quote}
          </blockquote>
          <a
            href={config.profile.blog.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 self-start text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            {config.profile.blog.label}
            <ArrowUpRight className="w-3.5 h-3.5 text-white/40 transition-colors group-hover:text-white" />
          </a>
        </div>

        <div className="w-full sm:w-3/5 p-6 sm:p-10 overflow-y-auto custom-scrollbar flex flex-col">
          <h3 className="text-white/50 font-medium text-xs uppercase tracking-widest mb-4 sm:mb-6">Explore Dimensions</h3>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {config.profileCards.map((card) => {
              const Icon = iconMap[card.icon as keyof typeof iconMap];
              const colors = colorMap[card.color as keyof typeof colorMap];
              return (
                <div 
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  className={`group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between aspect-square sm:aspect-auto sm:h-40 ${card.span === 2 ? 'col-span-2' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 ${colors.bg} ${colors.text} rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <div className="mt-4">
                    <div>
                      <h4 className="text-white font-medium text-sm sm:text-lg">{card.title}</h4>
                      <p className="text-white/50 text-[11px] sm:text-xs mt-1 font-light">{card.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
