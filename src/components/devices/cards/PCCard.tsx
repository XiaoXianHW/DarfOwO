import { Wifi, Cpu } from 'lucide-react';
import { BentoCard } from '../BentoCard';
import { PCIllustration } from '../DeviceIllustrations';

export const PCCard = () => {
  return (
    <BentoCard className="col-span-2 row-span-2" color="from-blue-500/20 to-purple-500/20" delay={0.1}>
      <div className="flex justify-between items-start mb-4">
        <div className="w-32 h-32 -mt-4 -ml-4">
          <PCIllustration />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-white/70">Online</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/50 font-mono">
            <Wifi className="w-3.5 h-3.5" />
            Ethernet
          </div>
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <p className="text-white/50 text-xs font-mono uppercase tracking-wider mb-1">Workstation</p>
        <h3 className="text-2xl font-semibold mb-4 tracking-tight">Main Desktop PC</h3>
        
        <div className="grid grid-cols-2 gap-2">
          {['i9-10900K', 'RTX 2070 Super', '32GB Corsair DDR4 3600MHz', 'ASUS Z490-P / 750W', '3.5TB Storage (970EVO+ / 980Pro / HDD)'].map((spec, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs text-white/70 bg-black/20 p-2 rounded-lg border border-white/5 ${i === 4 ? 'col-span-2' : ''}`}>
              <Cpu className="w-3.5 h-3.5 text-white/30 shrink-0" />
              <span className="font-light truncate">{spec}</span>
            </div>
          ))}
        </div>
      </div>
    </BentoCard>
  );
};


