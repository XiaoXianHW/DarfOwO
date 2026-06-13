import { ArrowLeft } from 'lucide-react';
import { config } from '../config';

export const TopControls = () => {
  return (
    <div className="fixed top-6 left-6 pointer-events-auto z-[60] mix-blend-difference text-white">
      <a
        href={config.links.legacy}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-white/10"
        title="Legacy Portal"
      >
        <ArrowLeft className="w-5 h-5" />
      </a>
    </div>
  );
};
