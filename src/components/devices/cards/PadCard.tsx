import { Battery, Cpu } from 'lucide-react';
import { BentoCard } from '../BentoCard';
import { PadIllustration } from '../DeviceIllustrations';

export const PadCard = () => {
  return (
    <BentoCard className="col-span-2 row-span-1" color="from-indigo-500/20 to-blue-500/20" delay={0.5}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Xiaomi Pad 6</h3>
          <p className="text-white/50 text-xs font-mono">Tablet</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] text-white/50 font-mono">
            <Battery className="w-3 h-3" />
            100%
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-mono text-white/70">Charging</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between mt-2">
        <div className="w-24 h-24 shrink-0">
          <PadIllustration />
        </div>
        <div className="flex-1 ml-6 grid grid-cols-1 gap-2">
          {['Snapdragon 870', '8GB RAM + 128GB Storage', 'Xiaomi Smart Pen'].map((spec, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/70 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
              <Cpu className="w-3.5 h-3.5 text-white/30 shrink-0" />
              <span className="font-light truncate">{spec}</span>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
};


