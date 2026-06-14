import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeviceTile } from '../components/devices/DeviceRegistry';
import { DEVICES } from '../components/devices/inventory';
import { MusicWidget } from '../components/music/MusicWidget';

// Faint pixel-dot grid (crisp SVG rects, no gradients) for the retro backdrop.
const PIXEL_GRID =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Crect width='1' height='1' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")";

export const DevicesPage = () => {
  const navigate = useNavigate();
  const [hero, ...rest] = DEVICES;

  return (
    <div className="flex min-h-screen flex-col bg-[#080a0f] font-mono text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: PIXEL_GRID }}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b-2 border-[#1a2030] bg-[#080a0f]/90 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-9 w-9 items-center justify-center border-2 border-[#262d3b] bg-[#0e1117] text-white/70 shadow-[3px_3px_0_0_#05070a] transition-colors hover:bg-[#141a26] hover:text-white"
            aria-label="Back home"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm text-[#4ade80]">$</span>
            <h1 className="font-pixel text-sm tracking-wider">DEVICES</h1>
            <span className="h-4 w-2 bg-[#4ade80] pixel-blink" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden font-pixel text-[8px] tracking-widest text-white/35 sm:block">
            {DEVICES.length} UNITS · ALL ONLINE
          </p>
          <MusicWidget />
        </div>
      </div>

      {/* Responsive card board: the workstation hero spans two columns; every
          card lists its full spec sheet as a bulleted rundown. */}
      <div className="relative z-10 flex-1 p-4 sm:p-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2">
            <DeviceTile device={hero} index={0} hero />
          </div>
          {rest.map((device, i) => (
            <DeviceTile key={device.name} device={device} index={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};
