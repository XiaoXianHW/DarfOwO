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

  // Unique artist names for the scrolling marquee under the sort tabs.
  const artists = useMemo(() => {
    const set = new Set<string>();
    for (const t of tracks) {
      for (const a of t.artist.split(/[\/、,]/)) {
        const n = a.trim();
        if (n) set.add(n);
      }
    }
    return [...set];
  }, [tracks]);

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

  // Editorial list row: big tabular-nums index + cover + meta.
  const Row = (t: Track, n: number, label: string) => (
    <button
      key={t.id}
      onClick={() => openSong(t)}
      className="group relative flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05] lg:gap-3 lg:px-5"
    >
      <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-[#ec4141] transition-transform duration-200 group-hover:scale-y-100" />
      <span className="w-6 shrink-0 text-right font-mono text-base font-black tabular-nums text-white/15 transition-colors group-hover:text-[#ec4141] lg:w-8 lg:text-lg">
        {String(n).padStart(2, '0')}
      </span>
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
      {/* ===== Masthead ===== */}
      <header className="shrink-0 px-6 pt-7 lg:px-12 lg:pt-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 lg:gap-4">
            <button
              onClick={() => navigate('/')}
              className="-ml-1 shrink-0 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-black tracking-tight lg:text-4xl">音乐</h1>
            <span className="hidden translate-y-[3px] font-mono text-[10px] tracking-[0.4em] text-white/25 sm:inline lg:text-[11px]">
              SOUND&nbsp;LIBRARY
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5">
              <span className="font-mono text-sm font-bold tabular-nums text-white/90">{tracks.length}</span>
              <span className="text-xs text-white/45">首音乐</span>
            </div>
            <MusicWidget />
          </div>
        </div>
      </header>

      {/* ===== Body — single full-width editorial list of all songs ===== */}
      <motion.div
        className="flex min-h-0 flex-1 flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Sort / group — underline tabs */}
        <div className="mt-5 flex shrink-0 items-center gap-1 border-b border-white/10 px-4 lg:mt-7 lg:px-8">
          {SORTS.map(({ key, label, icon: Icon }) => {
            const active = mode === key;
            return (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`group relative flex items-center gap-1.5 px-3 pb-3 pt-1 font-mono text-[11px] tracking-[0.2em] transition-colors ${
                  active ? 'text-white' : 'text-white/35 hover:text-white/70'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                <span
                  className={`absolute -bottom-px left-0 h-[2px] w-full origin-left bg-[#ec4141] transition-transform duration-200 ${
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Scrolling artist marquee */}
        {artists.length > 0 && (
          <div className="group relative shrink-0 overflow-hidden bg-[#ec4141] py-2">
            <div className="marquee-artists flex w-max items-center whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]">
              {[...artists, ...artists].map((a, i) => (
                <span key={i} className="flex items-center font-mono text-[11px] font-medium tracking-[0.15em] text-white/85">
                  <span className="px-4 transition-colors hover:text-white">{a}</span>
                  <span className="text-white/35">/</span>
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#ec4141] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#ec4141] to-transparent" />
          </div>
        )}

        {tracks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 pb-20 text-center">
            <p className="font-mono text-sm tracking-wider text-white/40">音乐库为空 · 未连接音乐服务</p>
          </div>
        ) : (
          <div className="custom-scrollbar pb-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {groups
              ? groups.map((g) => (
                  <div key={g.title}>
                    <div className="flex items-baseline gap-2 border-t border-white/5 px-3 pb-2 pt-5 first:border-t-0 lg:px-5">
                      <h2 className="truncate text-base font-bold">{g.title}</h2>
                      <span className="font-mono text-[10px] text-white/25">/ {g.tracks.length}</span>
                    </div>
                    {g.tracks.map((t, i) => Row(t, i + 1, mode === 'artist' ? t.album : t.artist))}
                  </div>
                ))
              : flat.map((t, i) => Row(t, i + 1, `${t.artist} · ${t.album}`))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
