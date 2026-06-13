import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownAZ, ArrowLeft, Disc3, Play, Shuffle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { allTracks, ARTISTS, type Track } from '../data/musicLibrary';
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

  // Marquee band content (doubled for a seamless loop).
  const band = useMemo(() => ARTISTS.map((a) => a.name), []);

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
      className="group relative flex w-full items-center gap-4 px-6 py-2.5 text-left transition-colors hover:bg-white/[0.05] lg:px-8"
    >
      <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-[#ec4141] transition-transform duration-200 group-hover:scale-y-100" />
      <span className="w-9 shrink-0 font-mono text-2xl font-black tabular-nums text-white/10 transition-colors group-hover:text-[#ec4141] lg:text-3xl">
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
      {/* ===== Masthead — title beside the back button, total count on the right ===== */}
      <header className="relative shrink-0 px-6 pt-5 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <div className="flex min-w-0 items-end gap-3 lg:gap-4">
            <button
              onClick={() => navigate('/')}
              className="-ml-2 mb-3 shrink-0 rounded-full p-2 transition-colors hover:bg-white/10"
              aria-label="Back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-[56px] font-black leading-[0.82] tracking-tighter lg:text-[88px]">音乐</h1>
            <div className="mb-3 hidden sm:block">
              <div className="h-2 w-16 bg-[#ec4141] lg:w-24" />
              <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-white/40 lg:text-[11px]">
                SOUND&nbsp;LIBRARY
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-5 pt-1 lg:gap-8">
            <div className="text-right">
              <div className="text-3xl font-black leading-none lg:text-4xl">{tracks.length}</div>
              <div className="mt-1 font-mono text-[9px] tracking-[0.25em] text-white/35">首音乐 · SONGS</div>
            </div>
            <MusicWidget />
          </div>
        </div>
      </header>

      {/* ===== Bold marquee band ===== */}
      {band.length > 0 && (
        <div className="relative mt-3 shrink-0 overflow-hidden border-y border-white/10 bg-[#ec4141] py-2">
          <div className="marquee flex w-max whitespace-nowrap">
            {[...band, ...band].map((name, i) => (
              <span key={i} className="mx-5 font-mono text-sm font-bold uppercase tracking-wider text-black">
                {name}
                <span className="ml-10 text-black/40">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===== Body — single full-width editorial list of all songs ===== */}
      <motion.div
        className="flex min-h-0 flex-1 flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Sort / group — underline tabs */}
        <div className="flex shrink-0 items-center gap-1 border-b border-white/10 px-4 pt-4 lg:px-8">
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

        {tracks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6 pb-20 text-center">
            <p className="font-mono text-sm tracking-wider text-white/40">音乐库为空 · 未连接音乐服务</p>
          </div>
        ) : (
          <div className="custom-scrollbar pb-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {groups
              ? groups.map((g) => (
                  <div key={g.title}>
                    <div className="flex items-baseline gap-2 border-t border-white/5 px-6 pb-2 pt-5 first:border-t-0 lg:px-8">
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
