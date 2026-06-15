import { Menu } from 'lucide-react';

interface TopControlsProps {
  onOpenProfile: () => void;
}

export const TopControls = ({ onOpenProfile }: TopControlsProps) => {
  return (
    <div className="fixed top-6 left-6 pointer-events-auto z-[60] mix-blend-difference text-white">
      <button
        onClick={onOpenProfile}
        className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-white/10"
        title="Profile"
        aria-label="Profile"
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  );
};
