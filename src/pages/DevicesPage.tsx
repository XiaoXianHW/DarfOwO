import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeviceTile } from '../components/devices/DeviceRegistry';
import { DEVICES } from '../components/devices/inventory';

// Faint pixel-dot grid (crisp SVG rects, no gradients) for the retro backdrop.
const PIXEL_GRID =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Crect width='1' height='1' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")";

export const DevicesPage = () => {
  const navigate = useNavigate();
  const [hero, ...rest] = DEVICES;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#080a0f] font-mono text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: PIXEL_GRID }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex shrink-0 items-center justify-between border-b-2 border-[#1a2030] px-4 py-3 sm:px-6">
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
        <p className="font-pixel text-[8px] tracking-widest text-white/35">
          {DEVICES.length} UNITS · ALL ONLINE
        </p>
      </div>

      {/* Single-screen auto-fit grid: hero (Main Desktop PC) spans 2×2 so the
          13 devices tile a 4×4 board with no scroll on large screens. */}
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:overflow-hidden">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:h-full lg:auto-rows-fr lg:grid-cols-4 lg:grid-rows-4">
          <div className="col-span-2 row-span-2 min-h-0">
            <DeviceTile device={hero} index={0} hero />
          </div>
          {rest.map((device, i) => (
            <div key={device.name} className="min-h-0">
              <DeviceTile device={device} index={i + 1} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
