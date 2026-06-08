import { BentoCard } from '../BentoCard';
import { PhonesIllustration } from '../DeviceIllustrations';

export const PhonesCard = () => {
  return (
    <BentoCard className="col-span-1 row-span-2" color="from-blue-500/10 to-stone-500/20" delay={0.3}>
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono text-white/70">Active</span>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40">
            <PhonesIllustration />
          </div>
        </div>
      </div>

      <div className="mt-auto relative z-10 text-center flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Xiaomi 14 Pro</h3>
          <p className="text-white/50 text-[10px] font-mono mt-0.5">Snapdragon 8 Gen 3 • 16+512G</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">iPhone 14 Pro</h3>
          <p className="text-white/50 text-[10px] font-mono mt-0.5">A16 Bionic • 6+128G</p>
        </div>
      </div>
    </BentoCard>
  );
};


