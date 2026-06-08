import { Battery } from 'lucide-react';
import { BentoCard } from '../BentoCard';
import { AudioIllustration } from '../DeviceIllustrations';

export const AudioCard = () => {
  return (
    <BentoCard className="col-span-1 row-span-1" color="from-white/10 to-white/5" delay={0.9}>
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-1 text-[10px] text-white/50 font-mono">
          <Battery className="w-3 h-3" />
          90%
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        <div className="w-16 h-16">
          <AudioIllustration />
        </div>
      </div>

      <div className="mt-auto text-center">
        <h3 className="text-sm font-semibold tracking-tight">Edifier NeoPods Pro</h3>
        <p className="text-white/50 text-[10px] font-mono mt-0.5">Hi-Res LDAC & LHDC</p>
      </div>
    </BentoCard>
  );
};


