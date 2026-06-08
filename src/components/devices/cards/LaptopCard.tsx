import { Battery, Cpu } from 'lucide-react';
import { BentoCard } from '../BentoCard';
import { LaptopIllustration } from '../DeviceIllustrations';

export const LaptopCard = () => {
  return (
    <BentoCard className="col-span-2 row-span-1" color="from-slate-500/20 to-gray-500/20" delay={0.4}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Redmi Book 14 Pro 2022</h3>
          <p className="text-white/50 text-xs font-mono">Laptop</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] text-white/50 font-mono">
            <Battery className="w-3 h-3" />
            100%
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-mono text-white/70">Sleeping</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between mt-2">
        <div className="w-24 h-24 shrink-0">
          <LaptopIllustration />
        </div>
        <div className="flex-1 ml-6 grid grid-cols-1 gap-2">
          {['i5-12450H', '16GB DDR5 5200MHz', '512GB SSD'].map((spec, i) => (
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


