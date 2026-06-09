import { motion } from 'motion/react';
import { PixelSprite } from './PixelSprite';
import type { Device } from './inventory';

function OnlineTag() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 bg-[#4ade80] pixel-blink" />
      <span className="font-pixel text-[7px] leading-none tracking-wider text-[#4ade80]">
        ONLINE
      </span>
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
      className="flex h-full min-h-0 flex-col border-2 border-[#262d3b] bg-[#0e1117] p-3 shadow-[3px_3px_0_0_#05070a] transition-colors hover:border-[#39435a] sm:p-4"
    >
      {/* Top: sprite + online */}
      <div className="flex items-start justify-between">
        <div
          className={`flex shrink-0 items-center justify-center border-2 border-[#222a38] bg-[#0a0d13] ${
            hero ? 'h-16 w-16' : 'h-11 w-11'
          }`}
          style={{ color: device.accent }}
        >
          <PixelSprite name={device.sprite} className={hero ? 'h-10 w-10' : 'h-6 w-6'} />
        </div>
        <OnlineTag />
      </div>

      {/* Name + type */}
      <div className="mt-3">
        <h3
          className={`truncate font-semibold leading-tight tracking-tight text-white ${
            hero ? 'text-xl' : 'text-sm'
          }`}
        >
          {device.name}
        </h3>
        <span
          className="font-mono text-[10px] uppercase tracking-wider"
          style={{ color: device.accent }}
        >
          {device.type}
        </span>
      </div>

      {/* Specs */}
      <div
        className={`mt-auto pt-3 ${
          hero
            ? 'grid grid-cols-2 gap-1.5'
            : 'flex flex-wrap items-center gap-x-2 gap-y-0.5'
        }`}
      >
        {device.specs.map((spec, i) =>
          hero ? (
            <div
              key={i}
              className="border border-[#222a38] bg-[#0a0d13] px-2 py-1 font-mono text-[11px] text-white/55"
            >
              {spec}
            </div>
          ) : (
            <span key={i} className="flex items-center gap-2 font-mono text-[10px] text-white/45">
              {i > 0 && <span className="text-white/15">·</span>}
              {spec}
            </span>
          ),
        )}
      </div>
    </motion.div>
  );
}
