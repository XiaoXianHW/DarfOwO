import { BentoCard } from '../BentoCard';
import { PeripheralsIllustration } from '../DeviceIllustrations';

export const PeripheralsCard = () => {
  return (
    <BentoCard className="col-span-1 row-span-2" color="from-pink-500/10 to-rose-500/20" delay={0.7}>
      <div className="flex-1 relative mt-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32">
            <PeripheralsIllustration />
          </div>
        </div>
      </div>

      <div className="mt-auto relative z-10 text-center flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">AOC CQ27G2</h3>
          <p className="text-white/50 text-[10px] font-mono mt-0.5">2K 144Hz Monitor</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Logitech G502</h3>
          <p className="text-white/50 text-[10px] font-mono mt-0.5">Gaming Mouse</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">AULA F87</h3>
          <p className="text-white/50 text-[10px] font-mono mt-0.5">Mechanical Keyboard</p>
        </div>
      </div>
    </BentoCard>
  );
};

