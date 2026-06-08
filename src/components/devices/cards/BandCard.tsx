import { Battery } from 'lucide-react';
import { BentoCard } from '../BentoCard';
import { BandIllustration } from '../DeviceIllustrations';

export const BandCard = () => {
  return (
    <BentoCard className="col-span-1 row-span-1" color="from-orange-500/20 to-red-500/20" delay={1.0}>
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-1 text-[10px] text-white/50 font-mono">
          <Battery className="w-3 h-3" />
          45%
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        <div className="w-16 h-16">
          <BandIllustration />
        </div>
      </div>

      <div className="mt-auto text-center">
        <h3 className="text-sm font-semibold tracking-tight">Xiaomi Band 10</h3>
      </div>
    </BentoCard>
  );
};


