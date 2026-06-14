import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMetrics } from '../hooks/useMetrics';
import { TrendChart } from '../components/status/TrendChart';
import { StatusNav } from '../components/status/StatusNav';

export const StatusDetailPage = () => {
  const navigate = useNavigate();
  const { metricId } = useParams<{ metricId: string }>();
  const { metrics, loading, error, latestDataAt, reload } = useMetrics();

  const metric = metrics.find((m) => m.id === metricId);

  // If data finished loading but the id is unknown, fall back to the status page.
  useEffect(() => {
    if (!loading && !error && metrics.length > 0 && !metric) {
      navigate('/status', { replace: true });
    }
  }, [loading, error, metrics.length, metric, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] font-sans text-white selection:bg-green-500/30">
      <StatusNav
        title={metric ? `${metric.label} · 详情` : '健康详情'}
        onBack={() => navigate('/status')}
        latestDataAt={latestDataAt}
        loading={loading}
        onReload={reload}
      />

      {loading && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/50">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">正在拉取真实健康数据…</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-white/60">数据加载失败：{error}</p>
        </div>
      )}

      {!loading && !error && metric && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: 'easeOut' }}
          className="relative flex flex-1 flex-col"
        >
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
            style={{ backgroundColor: metric.color }}
          />

          {/* Hero: headline + full-width chart filling the first screen */}
          <section className="relative z-10 flex flex-col px-6 pb-6 pt-8 sm:px-10 lg:px-16">
            <div className="flex items-center gap-3" style={{ color: metric.color }}>
              <metric.icon className="h-7 w-7" />
              <span className="text-xl font-semibold text-white sm:text-2xl">{metric.label}</span>
              {metric.sublabel && (
                <span className="font-mono text-xs uppercase tracking-widest text-white/30">
                  {metric.sublabel}
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
                {metric.value}
              </span>
              {metric.unit && <span className="text-xl text-white/50">{metric.unit}</span>}
            </div>
            {metric.hint && <p className="mt-2 text-white/40">{metric.hint}</p>}

            <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-white/40">
              {metric.rangeLabel ?? '近 30 天'}趋势
            </p>
            <div className="mt-3 h-[58vh] min-h-[300px] w-full">
              <TrendChart
                data={metric.data}
                type={metric.chartType}
                color={metric.color}
                fill
                detailed
                unit={metric.unit}
              />
            </div>
          </section>

          {/* Stats + daily data below the fold, full width */}
          <section className="relative z-10 px-6 pb-16 sm:px-10 lg:px-16">
            {metric.stats && metric.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {metric.stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                    <p className="text-xs text-white/40">{s.label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="mb-3 mt-10 font-mono text-[11px] uppercase tracking-widest text-white/40">
              每日数据
            </p>
            <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...metric.data].reverse().map((p) => (
                <div
                  key={p.label}
                  className="flex items-center justify-between border-b border-white/5 py-2.5 text-sm"
                >
                  <span className="text-white/50">{p.label}</span>
                  <span className="font-medium text-white">
                    {p.value === null ? '—' : `${p.value}${metric.unit ?? ''}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      )}
    </div>
  );
};
