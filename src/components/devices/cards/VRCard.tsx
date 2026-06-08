import { BentoCard } from '../BentoCard';
import { VRIllustration } from '../DeviceIllustrations';

export const VRCard = () => {
  return (
    <BentoCard className="col-span-1 row-span-2" color="from-fuchsia-500/10 to-purple-500/20" delay={0.8}>
      <div className="flex-1 relative mt-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32">
            <VRIllustration />
          </div>
        </div>
      </div>

      <div className="mt-auto relative z-10 text-center">
        <h3 className="text-lg font-semibold tracking-tight">Meta Quest 3</h3>
        <p className="text-white/50 text-xs font-mono mt-1">512GB Storage</p>
      </div>
    </BentoCard>
  );
};

