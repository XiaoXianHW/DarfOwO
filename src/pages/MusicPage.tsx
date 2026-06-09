import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALBUMS, ARTISTS, FEATURED, type Track } from '../data/musicLibrary';
import { Cover } from '../components/music/Cover';

function fmt(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return '';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Small mono section label in the status page's technical style.
function Label({ en, zh, count }: { en: string; zh: string; count?: number }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[11px] tracking-[0.25em] text-white/40">{en}</span>
      <span className="text-xs text-white/65">{zh}</span>
      {count != null && <span className="font-mono text-[10px] text-white/25">/ {count}</span>}
    </div>
  );
}

type Selection =
  | { kind: 'featured' }
  | { kind: 'artist'; id: string }
  | { kind: 'album'; id: string };

export const MusicPage = () => {
  const navigate = useNavigate();
  const [sel, setSel] = useState<Selection>({ kind: 'featured' });

  const view = useMemo<{ en: string; zh: string; tracks: Track[] }>(() => {
    if (sel.kind === 'artist') {
      const a = ARTISTS.find((x) => x.id === sel.id);
      return { en: 'ARTIST', zh: `${a?.name ?? ''} · 热门`, tracks: a?.hot ?? [] };
    }
    if (sel.kind === 'album') {
      const al = ALBUMS.find((x) => x.id === sel.id);
      return { en: 'ALBUM', zh: al?.name ?? '', tracks: al?.tracks ?? [] };
    }
    return { en: 'MOST PLAYED', zh: '我最常听', tracks: FEATURED };
  }, [sel]);

  const openSong = (t: Track) => {
    navigate(`/music/${t.id}`, {
      state: { queue: view.tracks.map((x) => x.id), title: view.zh },
    });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a] font-sans text-white selection:bg-white/20">
      {/* Header — mirrors the status page */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-6 py-3.5">
        <button
          onClick={() => navigate('/')}
          className="-ml-2 rounded-full p-2 transition-colors hover:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex min-w-0 flex-col items-center text-center">
          <h1 className="text-base font-medium">音乐 · Music</h1>
          <p className="mt-0.5 truncate text-[11px] text-white/40">
            我喜欢的歌手 · 专辑 · 单曲 · 数据源自网易云音乐
          </p>
        </div>
        <span className="w-6" />
      </div>

      {/* Body — full-screen two-pane: left list, right (artists top / albums bottom) */}
      <motion.div
        className="grid min-h-0 flex-1 grid-rows-[1fr_auto] gap-0 lg:grid-cols-[1.15fr_1fr] lg:grid-rows-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* LEFT — track / playlist list */}
        <section className="flex min-h-0 flex-col border-white/5 lg:border-r">
          <div className="flex shrink-0 items-center justify-between px-6 pb-3 pt-5">
            <Label en={view.en} zh={view.zh} count={view.tracks.length} />
            {sel.kind !== 'featured' && (
              <button
                onClick={() => setSel({ kind: 'featured' })}
                className="font-mono text-[10px] tracking-wider text-white/40 transition-colors hover:text-white/80"
              >
                ← 最常听
              </button>
            )}
          </div>
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-6">
            {view.tracks.map((t, i) => (
              <button
                key={t.id}
                onClick={() => openSong(t)}
                className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-white/[0.06]"
              >
                <span className="w-5 shrink-0 text-right font-mono text-[11px] text-white/30 group-hover:hidden">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Play className="hidden h-3.5 w-3.5 shrink-0 translate-x-0.5 text-[#ec4141] group-hover:block" fill="currentColor" />
                <Cover name={t.name} cover={t.cover} className="h-9 w-9 shrink-0 ring-1 ring-white/10" textClass="text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{t.name}</p>
                  <p className="truncate text-[11px] text-white/40">{t.artist}</p>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-white/30">{fmt(t.dur)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* RIGHT — artists (top) + albums (bottom) */}
        <section className="grid min-h-0 grid-rows-[1.1fr_1fr] overflow-hidden">
          {/* ARTISTS */}
          <div className="flex min-h-0 flex-col border-b border-white/5">
            <div className="shrink-0 px-6 pb-3 pt-5">
              <Label en="ARTISTS" zh="常听歌手" count={ARTISTS.length} />
            </div>
            <div className="custom-scrollbar grid min-h-0 flex-1 grid-cols-3 content-start gap-x-2 gap-y-4 overflow-y-auto px-5 pb-4 sm:grid-cols-4 lg:grid-cols-5">
              {ARTISTS.map((a) => {
                const on = sel.kind === 'artist' && sel.id === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setSel({ kind: 'artist', id: a.id })}
                    className="flex flex-col items-center text-center"
                  >
                    <Cover
                      name={a.name}
                      cover={a.cover}
                      circle
                      className={`aspect-square w-full max-w-[72px] transition-all ${on ? 'ring-2 ring-[#ec4141]' : 'ring-1 ring-white/10 hover:ring-white/30'}`}
                      textClass="text-2xl"
                    />
                    <p className={`mt-1.5 line-clamp-1 text-[12px] ${on ? 'text-white' : 'text-white/75'}`}>{a.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ALBUMS */}
          <div className="flex min-h-0 flex-col">
            <div className="shrink-0 px-6 pb-3 pt-4">
              <Label en="ALBUMS" zh="专辑 / 合辑" count={ALBUMS.length} />
            </div>
            <div className="custom-scrollbar grid min-h-0 flex-1 grid-cols-2 content-start gap-3 overflow-y-auto px-5 pb-5 sm:grid-cols-4">
              {ALBUMS.map((al) => {
                const on = sel.kind === 'album' && sel.id === al.id;
                return (
                  <div key={al.id} className="flex flex-col">
                    <button
                      onClick={() => setSel({ kind: 'album', id: al.id })}
                      className="group relative block overflow-hidden rounded-md"
                    >
                      <Cover
                        name={al.name}
                        cover={al.cover}
                        className={`aspect-square w-full transition-all ${on ? 'ring-2 ring-[#ec4141]' : 'ring-1 ring-white/10 group-hover:ring-white/30'}`}
                      />
                      <a
                        href={`https://music.163.com/album?id=${al.id}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white/80 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
                        aria-label="在网易云打开"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </button>
                    <p className={`mt-1.5 line-clamp-1 text-[12px] ${on ? 'text-white' : 'text-white/80'}`}>{al.name}</p>
                    <p className="line-clamp-1 text-[10px] text-white/40">
                      {al.artist}{al.year ? ` · ${al.year}` : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};
