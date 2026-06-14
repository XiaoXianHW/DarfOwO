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
      {hero && device.details ? (
        // Hero: full labeled spec sheet that breathes across the large tile.
        <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-x-8 gap-y-5 overflow-hidden md:grid-cols-2 lg:grid-cols-[1.4fr_1.1fr_1.1fr]">
          {/* Core spec sheet */}
          <div className="flex flex-col justify-center">
            {device.details.map((d) => (
              <div
                key={d.label}
                className="flex items-baseline gap-3 border-b border-white/[0.06] py-[7px]"
              >
                <span
                  className="w-14 shrink-0 font-pixel text-[8px] uppercase tracking-[0.12em]"
                  style={{ color: device.accent }}
                >
                  {d.label}
                </span>
                <span className="font-mono text-[12px] leading-snug text-white/75">{d.value}</span>
              </div>
            ))}
          </div>

          {/* Storage */}
          {device.storage && (
            <div className="flex flex-col justify-center">
              <span
                className="font-pixel text-[9px] uppercase tracking-[0.15em]"
                style={{ color: device.accent }}
              >
                Storage
              </span>
              <ul className="mt-2.5 space-y-2">
                {device.storage.map((drive) => (
                  <li
                    key={drive}
                    className="flex items-baseline gap-2 font-mono text-[12px] leading-snug text-white/70"
                  >
                    <span className="shrink-0" style={{ color: device.accent }}>
                      ›
                    </span>
                    {drive}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Attached peripherals */}
          {device.peripherals && (
            <div className="flex flex-col justify-center">
              <span
                className="font-pixel text-[9px] uppercase tracking-[0.15em]"
                style={{ color: device.accent }}
              >
                Peripherals
              </span>
              <div className="mt-2.5 space-y-2">
                {device.peripherals.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2.5 border border-dashed border-[#2a3346] p-2"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#222a38] bg-[#0a0d13]"
                      style={{ color: p.accent }}
                    >
                      <PixelSprite name={p.sprite} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold leading-tight text-white/90">
                        {p.name}
                      </p>
                      <p className="truncate font-mono text-[10px] text-white/45">{p.spec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-3">
          {device.specs.map((spec, i) => (
            <span key={i} className="flex items-center gap-2 font-mono text-[10px] text-white/45">
              {i > 0 && <span className="text-white/15">·</span>}
              {spec}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
