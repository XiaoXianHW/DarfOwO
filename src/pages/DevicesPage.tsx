import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeviceSection } from '../components/devices/DeviceRegistry';
import { PixelSprite } from '../components/devices/PixelSprite';
import { GROUPS, ONLINE_STATUSES } from '../components/devices/inventory';

// Faint pixel-dot grid (crisp SVG rects, no gradients) for the retro backdrop.
const PIXEL_GRID =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Crect width='1' height='1' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")";

export const DevicesPage = () => {
  const navigate = useNavigate();

  const devices = GROUPS.flatMap((g) => g.devices);
  const total = devices.length;
  const online = devices.filter((d) => ONLINE_STATUSES.includes(d.status)).length;
  const onBattery = devices.filter((d) => d.battery !== undefined).length;

  const summary: [string, string][] = [
    ['host', 'xiaoxian.org'],
    ['units', `${total} registered`],
    ['online', `${online} / ${total}`],
    ['on batt', `${onBattery} units`],
    ['uplink', 'ethernet · wi-fi'],
  ];

  return (
    <div className="min-h-screen bg-[#080a0f] font-mono text-white">
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: PIXEL_GRID }}
      />

      <div className="relative z-10 mx-auto max-w-[1100px] px-4 py-8 sm:px-8 sm:py-12">
        {/* Terminal prompt header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-between gap-4"
        >
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
              <h1 className="font-pixel text-sm tracking-wider sm:text-base">DEVICES</h1>
              <span className="h-4 w-2 bg-[#4ade80] pixel-blink" />
            </div>
          </div>
          <p className="hidden font-pixel text-[8px] tracking-widest text-white/30 sm:block">
            {online} / {total} ONLINE
          </p>
        </motion.div>

        {/* Neofetch-style summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mb-8 flex items-center gap-5 border-2 border-[#262d3b] bg-[#0e1117] px-4 py-5 shadow-[5px_5px_0_0_#05070a] sm:gap-8 sm:px-6"
        >
          <div className="flex h-20 w-20 shrink-0 items-center justify-center border-2 border-[#222a38] bg-[#0a0d13] text-[#38bdf8] sm:h-24 sm:w-24">
            <PixelSprite name="tower" className="h-12 w-12 sm:h-14 sm:w-14" />
          </div>
          <div className="min-w-0">
            <div className="mb-1 text-sm font-semibold text-[#4ade80]">darf@xiaoxian</div>
            <div className="mb-2 h-px w-full bg-[#262d3b]" />
            <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
              {summary.map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 text-[12px]">
                  <span className="w-16 shrink-0 text-white/35">{k}</span>
                  <span className="text-white/30">::</span>
                  <span className="truncate text-white/80">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Device registry */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {GROUPS.map((group, i) => (
            <div key={group.id} className={group.id === 'compute' ? 'lg:col-span-2' : ''}>
              <DeviceSection group={group} delay={0.1 + i * 0.06} />
            </div>
          ))}
        </div>

        {/* Footer command line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex items-center gap-1.5 text-[12px] text-white/30"
        >
          <span className="text-[#4ade80]">$</span>
          <span>end of inventory</span>
          <span className="h-3.5 w-1.5 bg-white/30 pixel-blink" />
        </motion.div>
      </div>
    </div>
  );
};
