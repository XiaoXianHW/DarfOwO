import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMetrics } from '../hooks/useMetrics';
import { StatusCard } from '../components/status/StatusCard';
import { StatusNav } from '../components/status/StatusNav';

// Bento spans so the 8 cards tile a 4×4 grid with no whitespace on large screens.
const SPAN: Record<string, string> = {
  'heart-rate': 'sm:col-span-2 lg:row-span-2',
  steps: 'sm:col-span-2',
  calories: 'sm:col-span-2',
  sleep: 'sm:col-span-2 lg:row-span-2',
};

export const StatusPage = () => {
  const navigate = useNavigate();
  const { metrics, loading, error, latestDataAt, reload } = useMetrics();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a] font-sans text-white selection:bg-green-500/30">
      <StatusNav
        title="健康状态"
        onBack={() => navigate('/')}
        latestDataAt={latestDataAt}
        loading={loading}
        onReload={reload}
      />

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
          <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:h-full lg:auto-rows-fr lg:grid-cols-4 lg:grid-rows-4">
            {metrics.map((metric, i) => (
              <div key={metric.id} className={`min-h-0 ${SPAN[metric.id] ?? ''}`}>
                <StatusCard
                  metric={metric}
                  index={i}
                  onOpen={(m) => navigate(`/status/${m.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
