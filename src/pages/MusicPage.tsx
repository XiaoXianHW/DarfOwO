import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALBUMS, ARTISTS, FEATURED, type Track } from '../data/musicLibrary';
import { Cover } from '../components/music/Cover';
import { MusicWidget } from '../components/music/MusicWidget';

function fmt(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return '';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const MusicPage = () => {
  const navigate = useNavigate();

  const openSong = (t: Track) =>
    navigate(`/music/${t.id}`, {
      state: { queue: FEATURED.map((x) => x.id), title: '我最常听' },
    });

  // Marquee band content (doubled for a seamless loop).
  const band = ARTISTS.map((a) => a.name);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a] font-sans text-white selection:bg-[#ec4141]/30">
      {/* ===== Masthead — oversized editorial header ===== */}
      <header className="relative shrink-0 px-6 pt-5 lg:px-10">
        <div className="flex items-start justify-between">
          <button
            onClick={() => navigate('/')}
            className="-ml-2 rounded-full p-2 transition-colors hover:bg-white/10"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-start gap-6 pt-1 lg:gap-10">
            {[
              { n: ARTISTS.length, l: 'ARTISTS' },
              { n: ALBUMS.length, l: 'ALBUMS' },
              { n: FEATURED.length, l: 'TRACKS' },
            ].map((s) => (
              <div key={s.l} className="text-right">
                <div className="text-2xl font-black leading-none lg:text-3xl">
                  {String(s.n).padStart(2, '0')}
                </div>
                <div className="mt-1 font-mono text-[9px] tracking-[0.25em] text-white/35">{s.l}</div>
              </div>
            ))}
            <MusicWidget />
          </div>
        </div>

        <div className="mt-1 flex items-end gap-4">
          <h1 className="text-[64px] font-black leading-[0.82] tracking-tighter lg:text-[104px]">
            音乐
          </h1>
          <div className="mb-2 lg:mb-3">
            <div className="h-2 w-16 bg-[#ec4141] lg:w-24" />
            <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-white/40 lg:text-[11px]">
              SOUND&nbsp;LIBRARY
            </p>
            <p className="text-[11px] text-white/45">我喜欢的歌手 · 专辑 · 单曲</p>
          </div>
        </div>
      </header>

      {/* ===== Bold marquee band ===== */}
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

      {/* ===== Body — asymmetric: big featured index (left) + artists/albums (right) ===== */}
      <motion.div
        className="grid min-h-0 flex-1 grid-rows-[1.2fr_1fr] gap-0 lg:grid-cols-[1.5fr_1fr] lg:grid-rows-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* LEFT — MOST PLAYED, big numbered editorial list */}
        <section className="flex min-h-0 flex-col border-white/5 lg:border-r">
          <div className="flex shrink-0 items-baseline gap-2 px-6 pb-2 pt-5 lg:px-8">
            <span className="font-mono text-[11px] tracking-[0.25em] text-white/40">MOST&nbsp;PLAYED</span>
            <span className="text-xs text-white/65">我最常听</span>
            <span className="font-mono text-[10px] text-white/25">/ {FEATURED.length}</span>
          </div>
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pb-6">
            {FEATURED.map((t, i) => (
              <button
                key={t.id}
                onClick={() => openSong(t)}
                className="group relative flex w-full items-center gap-4 px-6 py-2.5 text-left transition-colors hover:bg-white/[0.05] lg:px-8"
              >
                <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-[#ec4141] transition-transform duration-200 group-hover:scale-y-100" />
                <span className="w-9 shrink-0 font-mono text-2xl font-black tabular-nums text-white/10 transition-colors group-hover:text-[#ec4141] lg:text-3xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Cover name={t.name} cover={t.cover} className="h-11 w-11 shrink-0 ring-1 ring-white/10" textClass="text-base" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold lg:text-base">{t.name}</p>
                  <p className="truncate text-[11px] text-white/40">{t.artist}</p>
                </div>
                <Play className="hidden h-4 w-4 shrink-0 text-[#ec4141] group-hover:block" fill="currentColor" />
                <span className="shrink-0 font-mono text-[10px] text-white/30 group-hover:hidden">{fmt(t.dur)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* RIGHT — artists (small-image list) + albums (cover strip) */}
        <section className="grid min-h-0 grid-rows-[1.4fr_1fr] overflow-hidden border-t border-white/5 lg:border-t-0">
          {/* ARTISTS — compact small-image list, click → detail */}
          <div className="flex min-h-0 flex-col border-b border-white/5">
            <div className="flex shrink-0 items-baseline gap-2 px-6 pb-2 pt-5">
              <span className="font-mono text-[11px] tracking-[0.25em] text-white/40">ARTISTS</span>
              <span className="text-xs text-white/65">常听歌手</span>
              <span className="font-mono text-[10px] text-white/25">/ {ARTISTS.length}</span>
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-3">
              {ARTISTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/music/artist/${a.id}`)}
                  className="group flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-left transition-colors hover:bg-white/[0.06]"
                >
                  <Cover name={a.name} cover={a.cover} circle className="h-9 w-9 shrink-0 ring-1 ring-white/10" textClass="text-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm group-hover:text-white">{a.name}</p>
                    {(a.alias || a.bio) && (
                      <p className="truncate text-[10px] text-white/35">{a.alias || a.bio}</p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/15 transition-colors group-hover:text-[#ec4141]" />
                </button>
              ))}
            </div>
          </div>

          {/* ALBUMS — bold horizontal cover strip, click → detail */}
          <div className="flex min-h-0 flex-col">
            <div className="flex shrink-0 items-baseline gap-2 px-6 pb-2 pt-4">
              <span className="font-mono text-[11px] tracking-[0.25em] text-white/40">ALBUMS</span>
              <span className="text-xs text-white/65">专辑 / 合辑</span>
              <span className="font-mono text-[10px] text-white/25">/ {ALBUMS.length}</span>
            </div>
            <div className="custom-scrollbar flex min-h-0 flex-1 items-start gap-3 overflow-x-auto px-6 pb-4">
              {ALBUMS.map((al) => (
                <button
                  key={al.id}
                  onClick={() => navigate(`/music/album/${al.id}`)}
                  className="group w-28 shrink-0 text-left lg:w-32"
                >
                  <Cover
                    name={al.name}
                    cover={al.cover}
                    className="aspect-square w-full ring-1 ring-white/10 transition-all group-hover:ring-2 group-hover:ring-[#ec4141]"
                  />
                  <p className="mt-1.5 line-clamp-1 text-xs group-hover:text-white">{al.name}</p>
                  <p className="line-clamp-1 font-mono text-[10px] text-white/35">
                    {al.artist}{al.year ? ` · ${al.year}` : ''}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};
