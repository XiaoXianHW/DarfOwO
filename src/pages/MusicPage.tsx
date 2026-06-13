import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownAZ, ArrowLeft, Disc3, Play, Shuffle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allTracks, type Track } from '../data/musicLibrary';
import { Cover } from '../components/music/Cover';
import { MusicWidget } from '../components/music/MusicWidget';

function fmt(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return '';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

type SortMode = 'shuffle' | 'az' | 'artist' | 'album';

const SORTS: { key: SortMode; label: string; icon: typeof Shuffle }[] = [
  { key: 'shuffle', label: '打乱', icon: Shuffle },
  { key: 'az', label: 'A–Z', icon: ArrowDownAZ },
  { key: 'artist', label: '按歌手', icon: Users },
  { key: 'album', label: '按专辑', icon: Disc3 },
];

interface Group {
  title: string;
  tracks: Track[];
}

const byName = (a: Track, b: Track) => a.name.localeCompare(b.name, 'zh');

export const MusicPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SortMode>('shuffle');

  const tracks = useMemo(() => allTracks(), []);

  // Shuffle once per mount so the default order is randomized but stable while
  // browsing (re-selecting 打乱 keeps the same order until the page reloads).
  const shuffled = useMemo(() => {
    const a = [...tracks];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [tracks]);

  const { flat, groups } = useMemo<{ flat: Track[]; groups: Group[] | null }>(() => {
    if (mode === 'shuffle') return { flat: shuffled, groups: null };
    if (mode === 'az') return { flat: [...tracks].sort(byName), groups: null };

    const keyOf = (t: Track) =>
      mode === 'artist' ? t.artist || '未知歌手' : t.album || '未知专辑';
    const map = new Map<string, Track[]>();
    for (const t of tracks) {
      const k = keyOf(t);
      const arr = map.get(k);
      if (arr) arr.push(t);
      else map.set(k, [t]);
    }
    const grouped: Group[] = [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], 'zh'))
      .map(([title, ts]) => ({ title, tracks: ts.sort(byName) }));
    return { flat: grouped.flatMap((g) => g.tracks), groups: grouped };
  }, [mode, tracks, shuffled]);

  const queueIds = useMemo(() => flat.map((t) => t.id), [flat]);
  const openSong = (t: Track) =>
    navigate(`/music/${t.id}`, { state: { queue: queueIds, title: '全部音乐' } });

  const Row = (t: Track, label: string) => (
    <button
      key={t.id}
      onClick={() => openSong(t)}
      className="group relative flex w-full items-center gap-4 px-2 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
    >
      <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-[#ec4141] transition-transform duration-200 group-hover:scale-y-100" />
      <Cover name={t.name} cover={t.cover} className="h-11 w-11 shrink-0 ring-1 ring-white/10" textClass="text-base" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold lg:text-base">{t.name}</p>
        <p className="truncate text-[11px] text-white/40">{label}</p>
      </div>
      <Play className="hidden h-4 w-4 shrink-0 text-[#ec4141] group-hover:block" fill="currentColor" />
      <span className="shrink-0 font-mono text-[10px] text-white/30 group-hover:hidden">{fmt(t.dur)}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#0a0a0a] font-sans text-white selection:bg-[#ec4141]/30 lg:h-screen lg:overflow-hidden">
      {/* ===== Header — title beside the back button, total count on the right ===== */}
      <header className="relative shrink-0 px-6 pt-5 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="-ml-2 shrink-0 rounded-full p-2 transition-colors hover:bg-white/10"
              aria-label="Back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-4xl font-black tracking-tighter lg:text-5xl">音乐</h1>
            <span className="hidden h-7 w-1.5 shrink-0 bg-[#ec4141] sm:block" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black leading-none lg:text-3xl">{tracks.length}</div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.25em] text-white/35">首音乐 · SONGS</div>
            </div>
            <MusicWidget />
          </div>
        </div>

        {/* Sort / group toolbar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {SORTS.map(({ key, label, icon: Icon }) => {
            const active = mode === key;
            return (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'border-[#ec4141] bg-[#ec4141] text-white'
                    : 'border-white/10 bg-white/[0.03] text-white/55 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ===== Body — single list of all songs ===== */}
      <motion.div
        className="mt-4 min-h-0 flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {tracks.length === 0 ? (
          <div className="flex h-full items-center justify-center px-6 pb-20 text-center">
            <p className="font-mono text-sm tracking-wider text-white/40">音乐库为空 · 未连接音乐服务</p>
          </div>
        ) : (
          <div className="custom-scrollbar h-full overflow-y-auto px-4 pb-10 lg:px-8">
            {groups
              ? groups.map((g) => (
                  <div key={g.title}>
                    <div className="sticky top-0 z-[1] flex items-baseline gap-2 bg-[#0a0a0a]/92 px-2 py-2 backdrop-blur">
                      <h2 className="truncate text-sm font-bold">{g.title}</h2>
                      <span className="font-mono text-[10px] text-white/30">/ {g.tracks.length}</span>
                    </div>
                    {g.tracks.map((t) => Row(t, mode === 'artist' ? t.album : t.artist))}
                  </div>
                ))
              : flat.map((t) => Row(t, `${t.artist} · ${t.album}`))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
