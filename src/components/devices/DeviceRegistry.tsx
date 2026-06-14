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
      className="flex h-full flex-col border-2 border-[#262d3b] bg-[#0e1117] p-4 shadow-[3px_3px_0_0_#05070a] transition-colors hover:border-[#39435a] sm:p-5"
    >
      {/* Header: sprite + name/type + online */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex shrink-0 items-center justify-center border-2 border-[#222a38] bg-[#0a0d13] ${
              hero ? 'h-16 w-16' : 'h-12 w-12'
            }`}
            style={{ color: device.accent }}
          >
            <PixelSprite name={device.sprite} className={hero ? 'h-10 w-10' : 'h-7 w-7'} />
          </div>
          <div className="min-w-0">
            <h3
              className={`truncate font-semibold leading-tight tracking-tight text-white ${
                hero ? 'text-xl' : 'text-base'
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
        </div>
        <OnlineTag />
      </div>

      {/* Bulleted spec sheet */}
      <ul className={`mt-4 ${hero ? 'grid gap-x-8 gap-y-2 sm:grid-cols-2' : 'space-y-2'}`}>
        {device.specs.map((spec, i) => (
          <li
            key={i}
            className="flex items-start gap-2 font-mono text-[12px] leading-snug text-white/55"
          >
            <span className="select-none leading-snug" style={{ color: device.accent }}>
              -
            </span>
            <span className="min-w-0">{spec}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
