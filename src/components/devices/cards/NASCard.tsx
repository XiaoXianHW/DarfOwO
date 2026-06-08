import { Cpu } from 'lucide-react';
import { BentoCard } from '../BentoCard';
import { NASIllustration } from '../DeviceIllustrations';

export const NASCard = () => {
  return (
    <BentoCard className="col-span-2 row-span-1" color="from-emerald-500/20 to-teal-500/20" delay={0.6}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Synology DS918+</h3>
          <p className="text-white/50 text-xs font-mono">NAS Server</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-mono text-white/70">Syncing</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between mt-2">
        <div className="w-24 h-24 shrink-0">
          <NASIllustration />
        </div>
        <div className="flex-1 ml-6 grid grid-cols-1 gap-2">
          {['4x 4TB Seagate IronWolf', 'RAID 5 Configuration'].map((spec, i) => (
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


