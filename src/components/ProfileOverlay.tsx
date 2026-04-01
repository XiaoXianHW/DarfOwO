import { motion } from 'motion/react';
import { X, Monitor, Music, Activity, ChevronRight } from 'lucide-react';
import { config } from '../config';

const iconMap = { Monitor, Music, Activity };
const colorMap = {
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-300' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  green: { bg: 'bg-green-500/20', text: 'text-green-400' }
};

interface ProfileOverlayProps {
  heartRate: number;
  onClose: () => void;
}

export const ProfileOverlay = ({ heartRate, onClose }: ProfileOverlayProps) => {
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
        
        <div className="w-full sm:w-2/5 p-8 sm:p-10 border-b sm:border-b-0 sm:border-r border-white/10 flex flex-col shrink-0 bg-black/20">
          <img src={config.avatars.default} alt={config.profile.name} className="w-24 h-24 rounded-2xl border border-white/20 mb-6 shadow-lg object-cover" referrerPolicy="no-referrer" />
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-2 tracking-tight">{config.profile.name}</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {config.profile.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/80 border border-white/5">{tag}</span>
            ))}
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-8 font-light">
            {config.profile.bio}
          </p>
        </div>

        <div className="w-full sm:w-3/5 p-8 sm:p-10 overflow-y-auto custom-scrollbar flex flex-col">
          <h3 className="text-white/50 font-medium text-xs uppercase tracking-widest mb-6">Explore Dimensions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {config.profileCards.map((card) => {
              const Icon = iconMap[card.icon as keyof typeof iconMap];
              const colors = colorMap[card.color as keyof typeof colorMap];
              return (
                <div 
                  key={card.title}
                  className={`group cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between aspect-square sm:aspect-auto sm:h-40 ${card.span === 2 ? 'sm:col-span-2' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 ${colors.bg} ${colors.text} rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/70 transition-colors" />
                  </div>
                  <div className={`mt-4 ${card.span === 2 ? 'flex justify-between items-end' : ''}`}>
                    <div>
                      <h4 className="text-white font-medium text-lg">{card.title}</h4>
                      <p className="text-white/50 text-xs mt-1 font-light">{card.subtitle}</p>
                    </div>
                    {card.icon === 'Activity' && (
                      <div className="text-right">
                        <p className="text-white font-mono text-xl">{heartRate} <span className="text-sm text-white/50">bpm</span></p>
                      </div>
                    )}
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
