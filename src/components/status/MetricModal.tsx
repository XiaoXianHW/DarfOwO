import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { TrendChart } from './TrendChart';
import type { MetricDescriptor } from './types';

interface MetricModalProps {
  metric: MetricDescriptor | null;
  onClose: () => void;
}

export const MetricModal = ({ metric, onClose }: MetricModalProps) => {
  return (
    <AnimatePresence>
      {metric && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#1a1a1a] p-6 sm:rounded-3xl"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-[80px]"
              style={{ backgroundColor: metric.color }}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2" style={{ color: metric.color }}>
                  <metric.icon className="h-6 w-6" />
                  <span className="text-lg font-semibold text-white">{metric.label}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{metric.value}</span>
                  {metric.unit && <span className="text-white/50">{metric.unit}</span>}
                </div>
                {metric.hint && <p className="mt-1 text-sm text-white/40">{metric.hint}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative z-10 mt-6">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
                近 7 天趋势
              </p>
              <div className="h-64 w-full">
                <TrendChart
                  data={metric.data}
                  type={metric.chartType}
                  color={metric.color}
                  height={256}
                  detailed
                  unit={metric.unit}
                />
              </div>
            </div>

            {metric.stats && metric.stats.length > 0 && (
              <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {metric.stats.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/5 p-3">
                    <p className="text-xs text-white/40">{s.label}</p>
                    <p className="mt-1 font-semibold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="relative z-10 mt-6">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
                每日数据
              </p>
              <div className="divide-y divide-white/5 overflow-hidden rounded-2xl bg-white/5">
                {metric.data.map((p) => (
                  <div key={p.label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-white/50">{p.label}</span>
                    <span className="font-medium text-white">
                      {p.value === null ? '—' : `${p.value}${metric.unit ?? ''}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
