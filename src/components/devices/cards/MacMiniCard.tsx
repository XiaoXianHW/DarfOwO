import { BentoCard } from '../BentoCard';
import { MacMiniIllustration } from '../DeviceIllustrations';

export const MacMiniCard = () => {
  return (
    <BentoCard className="col-span-1 row-span-2" color="from-slate-400/20 to-gray-400/20" delay={0.2}>
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
          <div className="w-32 h-32">
            <MacMiniIllustration />
          </div>
        </div>
      </div>

      <div className="mt-auto relative z-10 text-center">
        <h3 className="text-lg font-semibold tracking-tight">Mac mini M4</h3>
        <p className="text-white/50 text-xs font-mono mt-1">16GB • 256GB SSD</p>
      </div>
    </BentoCard>
  );
};

