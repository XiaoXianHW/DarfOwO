import { ArrowLeft, Box } from 'lucide-react';
import { config } from '../config';

interface TopControlsProps {
  is3D: boolean;
  onToggle3D: () => void;
}

export const TopControls = ({ is3D, onToggle3D }: TopControlsProps) => {
  return (
    <>
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

      <div className="fixed top-6 right-6 pointer-events-auto z-[60] mix-blend-difference text-white flex items-center gap-3">
        <button
          onClick={onToggle3D}
          title="Toggle 3D"
          className={`p-2 rounded-full transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-white/10 ${is3D ? 'ring-2 ring-white' : ''}`}
        >
          <Box className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};
