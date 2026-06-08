import { PCCard } from './cards/PCCard';
import { MacMiniCard } from './cards/MacMiniCard';
import { PhonesCard } from './cards/PhonesCard';
import { LaptopCard } from './cards/LaptopCard';
import { PadCard } from './cards/PadCard';
import { NASCard } from './cards/NASCard';
import { PeripheralsCard } from './cards/PeripheralsCard';
import { VRCard } from './cards/VRCard';
import { AudioCard } from './cards/AudioCard';
import { BandCard } from './cards/BandCard';

export const BentoGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-6 w-full max-w-6xl mx-auto">
      <PCCard />
      <MacMiniCard />
      <PhonesCard />
      <LaptopCard />
      <PadCard />
      <NASCard />
      <PeripheralsCard />
      <VRCard />
      <AudioCard />
      <BandCard />
    </div>
  );
};

