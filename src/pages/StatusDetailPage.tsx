import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMetrics } from '../hooks/useMetrics';
import { TrendChart } from '../components/status/TrendChart';

export const StatusDetailPage = () => {
  const navigate = useNavigate();
  const { metricId } = useParams<{ metricId: string }>();
  const { metrics, loading, error } = useMetrics();

  const metric = metrics.find((m) => m.id === metricId);

  // If data finished loading but the id is unknown, fall back to the status page.
  useEffect(() => {
    if (!loading && !error && metrics.length > 0 && !metric) {
      navigate('/status', { replace: true });
    }
  }, [loading, error, metrics.length, metric, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] font-sans text-white selection:bg-green-500/30">
      <div className="sticky top-0 z-50 flex shrink-0 items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 px-6 py-4 backdrop-blur-xl">
        <button
          onClick={() => navigate('/status')}
          className="-ml-2 flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-white/10"
          aria-label="Back to status"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="text-sm text-white/70">返回</span>
        </button>
        <h1 className="text-lg font-medium">
          {metric ? `${metric.label} · 详情` : '健康详情'}
        </h1>
        <span className="w-16" />
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {loading && (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-white/50">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">正在拉取真实健康数据…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <p className="text-white/60">数据加载失败：{error}</p>
          </div>
        )}

        {!loading && !error && metric && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#1a1a1a] p-6"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-[80px]"
              style={{ backgroundColor: metric.color }}
            />

            <div className="relative z-10 flex items-center gap-2" style={{ color: metric.color }}>
              <metric.icon className="h-6 w-6" />
              <span className="text-lg font-semibold text-white">{metric.label}</span>
              {metric.sublabel && (
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/30">
                  {metric.sublabel}
                </span>
              )}
            </div>
            <div className="relative z-10 mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{metric.value}</span>
              {metric.unit && <span className="text-white/50">{metric.unit}</span>}
            </div>
            {metric.hint && <p className="relative z-10 mt-1 text-sm text-white/40">{metric.hint}</p>}

            <div className="relative z-10 mt-6">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/40">
                近 7 天趋势
              </p>
              <div className="h-64 w-full sm:h-72">
                <TrendChart
                  data={metric.data}
                  type={metric.chartType}
                  color={metric.color}
                  fill
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
                  <div
                    key={p.label}
                    className="flex items-center justify-between px-4 py-2.5 text-sm"
                  >
                    <span className="text-white/50">{p.label}</span>
                    <span className="font-medium text-white">
                      {p.value === null ? '—' : `${p.value}${metric.unit ?? ''}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
