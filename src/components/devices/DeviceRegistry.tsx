import { motion } from 'motion/react';
import { PixelSprite } from './PixelSprite';
import {
  STATUS_META,
  type Device,
  type DeviceGroup,
} from './inventory';

function batteryColor(pct: number): string {
  if (pct <= 20) return '#f87171';
  if (pct <= 50) return '#fbbf24';
  return '#4ade80';
}

function BatteryBar({ pct }: { pct: number }) {
  const cells = 10;
  const filled = Math.max(0, Math.min(cells, Math.round((pct / 100) * cells)));
  const color = batteryColor(pct);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-[2px]">
        {Array.from({ length: cells }).map((_, i) => (
          <span
            key={i}
            className="h-3 w-[5px]"
            style={{ backgroundColor: i < filled ? color : '#22262f' }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] tabular-nums" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

function StatusTag({ status }: { status: Device['status'] }) {
  const meta = STATUS_META[status];
  const live = status === 'online' || status === 'active' || status === 'syncing' || status === 'charging';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`h-2 w-2 ${live ? 'pixel-blink' : ''}`}
        style={{ backgroundColor: meta.color }}
      />
      <span
        className="font-pixel text-[8px] leading-none tracking-wider"
        style={{ color: meta.color }}
      >
        {meta.label}
      </span>
    </span>
  );
}

function DeviceRow({ device, index }: { device: Device; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group flex items-center gap-4 px-3 py-3 transition-colors hover:bg-[#141a26] sm:px-4"
    >
      {/* Sprite slot */}
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[#222a38] bg-[#0a0d13]"
        style={{ color: device.accent }}
      >
        <PixelSprite name={device.sprite} className="h-7 w-7" />
      </div>

      {/* Name + specs */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="truncate font-semibold tracking-tight text-white">{device.name}</h3>
          <span
            className="font-mono text-[10px] uppercase tracking-wider"
            style={{ color: device.accent }}
          >
            {device.type}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-white/45">
          {device.specs.map((spec, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/15">·</span>}
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Status + battery */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusTag status={device.status} />
        {device.battery !== undefined ? (
          <BatteryBar pct={device.battery} />
        ) : device.conn ? (
          <span className="font-mono text-[10px] text-white/35">{device.conn}</span>
        ) : null}
      </div>
    </motion.div>
  );
}

export function DeviceSection({ group, delay }: { group: DeviceGroup; delay: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="border-2 border-[#262d3b] bg-[#0e1117] shadow-[5px_5px_0_0_#05070a]"
    >
      {/* Section header bar */}
      <div className="flex items-center justify-between border-b-2 border-[#262d3b] bg-[#11161f] px-3 py-2 sm:px-4">
        <div className="flex items-baseline gap-2">
          <span className="font-pixel text-[10px] tracking-wider text-white/80">
            {group.label}
          </span>
          <span className="font-mono text-[11px] text-white/30">{group.hint}</span>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-white/30">
          {String(group.devices.length).padStart(2, '0')}
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#1a2030]">
        {group.devices.map((device, i) => (
          <DeviceRow key={device.name} device={device} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
