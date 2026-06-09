import { motion } from 'motion/react';
import { TrendChart } from './TrendChart';
import type { MetricDescriptor } from './types';

interface StatusCardProps {
  metric: MetricDescriptor;
  index: number;
  onOpen: (metric: MetricDescriptor) => void;
}

export const StatusCard = ({ metric, index, onOpen }: StatusCardProps) => {
  const hasData = metric.data.some((p) => p.value !== null);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(metric)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="group relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#1a1a1a] p-5 text-left transition-colors hover:border-white/15"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-[70px] transition-opacity group-hover:opacity-70"
        style={{ backgroundColor: metric.color }}
      />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2" style={{ color: metric.color }}>
          <metric.icon className="h-5 w-5 shrink-0" />
          <span className="truncate font-medium text-white/90">{metric.label}</span>
        </div>
        {metric.sublabel && (
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-widest text-white/30 sm:block">
            {metric.sublabel}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-3 flex flex-wrap items-baseline gap-x-1">
        <span className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
          {metric.value}
        </span>
        {metric.unit && <span className="font-medium text-white/50">{metric.unit}</span>}
      </div>
      {metric.hint && (
        <p className="relative z-10 mt-1 text-xs leading-snug text-white/40 sm:text-sm">{metric.hint}</p>
      )}

      {typeof metric.progress === 'number' && (
        <div className="relative z-10 mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(metric.progress * 100, 100)}%`,
              backgroundColor: metric.color,
            }}
          />
        </div>
      )}

      {/* Chart grows to fill all remaining card height */}
      <div className="relative z-10 mt-4 min-h-[2.5rem] flex-1">
        {hasData ? (
          <TrendChart
            data={metric.data}
            type={metric.chartType}
            color={metric.color}
            fill
            detailed={metric.hero}
            unit={metric.unit}
          />
        ) : (
          <div className="flex h-full items-center text-xs text-white/30">
            暂无{metric.rangeLabel ?? '近 30 天'}数据
          </div>
        )}
      </div>
    </motion.button>
  );
};
