import { motion } from 'motion/react';
import { TrendChart } from './TrendChart';
import type { MetricDescriptor } from './types';

interface StatusCardProps {
  metric: MetricDescriptor;
  index: number;
  onSelect: (metric: MetricDescriptor) => void;
}

export const StatusCard = ({ metric, index, onSelect }: StatusCardProps) => {
  const hasData = metric.data.some((p) => p.value !== null);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(metric)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#1a1a1a] p-6 text-left transition-colors hover:border-white/15 ${
        metric.hero ? 'sm:col-span-2 xl:col-span-2' : ''
      }`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-[70px] opacity-40 transition-opacity group-hover:opacity-70"
        style={{ backgroundColor: metric.color }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-2" style={{ color: metric.color }}>
          <metric.icon className="h-5 w-5" />
          <span className="font-medium text-white/90">{metric.label}</span>
        </div>
        {metric.sublabel && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            {metric.sublabel}
          </span>
        )}
      </div>

      <div className="relative z-10 mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-white">{metric.value}</span>
        {metric.unit && <span className="font-medium text-white/50">{metric.unit}</span>}
      </div>
      {metric.hint && <p className="relative z-10 mt-1 text-sm text-white/40">{metric.hint}</p>}

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

      <div className={`relative z-10 ${metric.hero ? 'mt-6 h-44' : 'mt-5 h-14'}`}>
        {hasData ? (
          <TrendChart
            data={metric.data}
            type={metric.chartType}
            color={metric.color}
            height={metric.hero ? 176 : 56}
            detailed={metric.hero}
            unit={metric.unit}
          />
        ) : (
          <div className="flex h-full items-center text-xs text-white/30">暂无近 7 天数据</div>
        )}
      </div>

      <span className="relative z-10 mt-4 font-mono text-[10px] uppercase tracking-widest text-white/25 transition-colors group-hover:text-white/50">
        点击查看 7 天 →
      </span>
    </motion.button>
  );
};
