import { motion } from 'motion/react';
import { PixelSprite } from './PixelSprite';
import type { Device } from './inventory';

function OnlineTag() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5">
      <span className="h-2 w-2 bg-[#4ade80] pixel-blink" />
      <span className="font-pixel text-[7px] leading-none tracking-wider text-[#4ade80]">ONLINE</span>
    </span>
  );
}

export function DeviceTile({
  device,
  index,
  hero = false,
}: {
  device: Device;
  index: number;
  hero?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex h-full min-h-0 flex-col overflow-hidden border-2 border-[#262d3b] bg-[#0e1117] p-3 shadow-[3px_3px_0_0_#05070a] transition-colors hover:border-[#39435a] sm:p-4"
    >
      {hero ? (
        <>
          {/* Top: sprite + online */}
          <div className="flex items-start justify-between">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-[#222a38] bg-[#0a0d13]"
              style={{ color: device.accent }}
            >
              <PixelSprite name={device.sprite} className="h-10 w-10" />
            </div>
            <OnlineTag />
          </div>
          <div className="mt-3">
            <h3 className="truncate text-xl font-semibold leading-tight tracking-tight text-white">
              {device.name}
            </h3>
            <span
              className="font-mono text-[10px] uppercase tracking-wider"
              style={{ color: device.accent }}
            >
              {device.type}
            </span>
          </div>
        </>
      ) : (
        // Compact horizontal header so the spec list keeps its vertical room.
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#222a38] bg-[#0a0d13]"
            style={{ color: device.accent }}
          >
            <PixelSprite name={device.sprite} className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold leading-tight tracking-tight text-white">
              {device.name}
            </h3>
            <span
              className="font-mono text-[9px] uppercase tracking-wider"
              style={{ color: device.accent }}
            >
              {device.type}
            </span>
          </div>
          <OnlineTag />
        </div>
      )}

      {/* Spec sheet — pixel-style tags */}
      <div
        className={`mt-2.5 flex min-h-0 flex-1 flex-wrap content-start overflow-hidden ${
          hero ? 'gap-1.5' : 'gap-1'
        }`}
      >
        {device.specs.map((spec, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1.5 border border-[#222a38] bg-[#0a0d13] font-mono text-white/60 ${
              hero ? 'px-2 py-1 text-[11px]' : 'px-1.5 py-0.5 text-[9px]'
            }`}
          >
            <span className="h-1 w-1 shrink-0" style={{ backgroundColor: device.accent }} />
            {spec}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
