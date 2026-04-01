import type { SideType } from '../types';
import { config } from '../config';

interface TaglineProps {
  hoveredSide: SideType;
}

export const Tagline = ({ hoveredSide }: TaglineProps) => {
  return (
    <div className={`fixed bottom-24 sm:bottom-12 left-1/2 -translate-x-1/2 z-[50] pointer-events-none text-center transition-opacity duration-500 mix-blend-difference text-white ${hoveredSide ? 'opacity-0' : 'opacity-100'}`}>
      <p className="font-serif italic text-lg sm:text-xl tracking-widest opacity-70">
        {config.profile.tagline.main}
      </p>
      <p className="font-mono text-xs sm:text-sm mt-2 tracking-widest uppercase opacity-50">
        {config.profile.tagline.sub}
      </p>
    </div>
  );
};
