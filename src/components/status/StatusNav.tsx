import { ArrowLeft, RefreshCw } from 'lucide-react';
import { formatClock } from '../../utils/format';
import { MusicWidget } from '../music/MusicWidget';

interface StatusNavProps {
  title: string;
  onBack: () => void;
  latestDataAt: string | null;
  loading: boolean;
  onReload: () => void;
}

// Shared top bar for the status grid and its detail pages so both stay in sync.
export const StatusNav = ({ title, onBack, latestDataAt, loading, onReload }: StatusNavProps) => (
  <div className="sticky top-0 z-50 flex shrink-0 items-center justify-between gap-3 border-b border-white/5 bg-[#0a0a0a]/80 px-6 py-4 backdrop-blur-xl">
    <div className="flex min-w-0 items-center gap-2">
      <button
        onClick={onBack}
        className="-ml-2 shrink-0 rounded-full p-2 transition-colors hover:bg-white/10"
        aria-label="Back"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <div className="min-w-0">
        <h1 className="text-lg font-medium leading-tight">{title}</h1>
        <p className="mt-0.5 truncate text-[11px] text-white/40">
          {latestDataAt ? `最后更新 ${formatClock(latestDataAt)}` : '最后更新 —'} · 小米手环 10
        </p>
      </div>
      <button
        onClick={onReload}
        disabled={loading}
        className="ml-1 shrink-0 rounded-full p-2 transition-colors hover:bg-white/10 disabled:opacity-40"
        aria-label="Refresh"
      >
        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
    <MusicWidget />
  </div>
);
