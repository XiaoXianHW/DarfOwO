import { motion } from 'motion/react';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMetrics } from '../hooks/useMetrics';
import { StatusCard } from '../components/status/StatusCard';
import { MusicWidget } from '../components/music/MusicWidget';
import { formatClock } from '../utils/format';

// Bento spans so the 8 cards tile a 4×4 grid with no whitespace on large screens.
const SPAN: Record<string, string> = {
  'heart-rate': 'sm:col-span-2 lg:row-span-2',
  steps: 'sm:col-span-2',
  calories: 'sm:col-span-2',
  sleep: 'sm:col-span-2 lg:row-span-2',
};

export const StatusPage = () => {
  const navigate = useNavigate();
  const { metrics, loading, error, updatedAt, reload } = useMetrics();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a] font-sans text-white selection:bg-green-500/30">
      {/* Top navigation — `relative z-30` keeps this bar's stacking context
          (it creates one via backdrop-blur) above the content grid, so the
          nested fixed music popup isn't painted beneath the cards. */}
      <div className="relative z-30 flex shrink-0 items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 px-6 py-4 backdrop-blur-xl">
        <button
          onClick={() => navigate('/')}
          className="-ml-2 rounded-full p-2 transition-colors hover:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex min-w-0 flex-col items-center text-center">
          <h1 className="text-lg font-medium">健康状态 · Health Status</h1>
          <p className="mt-0.5 truncate text-[11px] text-white/40">
            {updatedAt ? `最后刷新 ${formatClock(updatedAt)}` : '最后刷新 —'} · 数据源自小米运动健康 · 小米手环 10
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={reload}
            disabled={loading}
            className="rounded-full p-2 transition-colors hover:bg-white/10 disabled:opacity-40"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <MusicWidget />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:overflow-hidden">
        {loading && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-white/50">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">正在拉取真实健康数据…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-white/60">数据加载失败：{error}</p>
            <button
              onClick={reload}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm transition-colors hover:bg-white/10"
            >
              重试
            </button>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:h-full lg:auto-rows-fr lg:grid-cols-4 lg:grid-rows-4"
            initial="hidden"
            animate="show"
          >
            {metrics.map((metric, i) => (
              <div key={metric.id} className={`min-h-0 ${SPAN[metric.id] ?? ''}`}>
                <StatusCard
                  metric={metric}
                  index={i}
                  onOpen={(m) => navigate(`/status/${m.id}`)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
