import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ARTISTS, ALBUMS, SONGS, type Song } from '../data/musicLibrary';
import { Cover } from '../components/music/Cover';

const ACCENT = '#ec4141';

// Strip LRC timestamps (e.g. "[00:12.34]") so plain text and LRC both render.
function parseLyrics(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((line) => line.replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/g, '').trim());
}

function SectionTitle({ cn, en }: { cn: string; en: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-2">
      <h2 className="text-lg font-semibold tracking-tight">{cn}</h2>
      <span className="text-xs uppercase tracking-widest text-white/30">{en}</span>
    </div>
  );
}

export const MusicPage = () => {
  const navigate = useNavigate();
  const [songId, setSongId] = useState(SONGS[0]?.id);
  const [playing, setPlaying] = useState(false);

  const song: Song | undefined = SONGS.find((s) => s.id === songId) ?? SONGS[0];
  const lyrics = useMemo(() => parseLyrics(song?.lyrics), [song]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a] font-sans text-white">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="-ml-1 rounded-full p-2 transition-colors hover:bg-white/10"
            aria-label="Back home"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-baseline gap-2">
            <span className="h-4 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
            <h1 className="text-base font-semibold tracking-tight">音乐 · Music</h1>
          </div>
        </div>
        <p className="hidden text-[11px] text-white/35 sm:block">本地精选 · 手动编辑歌单</p>
      </div>

      {/* Library + Player */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_400px]">
        {/* Library */}
        <div className="custom-scrollbar order-2 min-h-0 overflow-y-auto px-5 py-6 sm:px-8 lg:order-1">
          {/* Artists */}
          <section className="mb-10">
            <SectionTitle cn="歌手" en="Artists" />
            <div className="flex flex-wrap gap-x-7 gap-y-5">
              {ARTISTS.map((a) => (
                <div key={a.id} className="flex w-16 flex-col items-center gap-2 text-center">
                  <Cover name={a.name} cover={a.cover} circle className="h-16 w-16" textClass="text-xl" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-white/85">{a.name}</p>
                    {a.enName && <p className="truncate text-[10px] text-white/35">{a.enName}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Albums */}
          <section className="mb-10">
            <SectionTitle cn="专辑" en="Albums" />
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {ALBUMS.map((al) => (
                <div key={al.id} className="flex items-center gap-3">
                  <Cover name={al.title} cover={al.cover} className="h-14 w-14 shrink-0" textClass="text-lg" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{al.title}</p>
                    <p className="truncate text-xs text-white/40">
                      {al.artist}
                      {al.year ? ` · ${al.year}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Songs */}
          <section>
            <SectionTitle cn="歌曲" en="Songs" />
            <div className="flex flex-col">
              {SONGS.map((s, i) => {
                const active = s.id === song?.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSongId(s.id)}
                    className={`group flex items-center gap-3 border-b border-white/[0.04] py-2 pl-2 pr-3 text-left transition-colors hover:bg-white/[0.04] ${
                      active ? 'bg-white/[0.05]' : ''
                    }`}
                  >
                    <span
                      className="w-5 shrink-0 text-center text-xs tabular-nums"
                      style={{ color: active ? ACCENT : 'rgba(255,255,255,0.3)' }}
                    >
                      {i + 1}
                    </span>
                    <Cover name={s.title} cover={s.cover} className="h-10 w-10 shrink-0" textClass="text-sm" />
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-medium"
                        style={active ? { color: ACCENT } : undefined}
                      >
                        {s.title}
                      </p>
                      <p className="truncate text-xs text-white/40">{s.artist}</p>
                    </div>
                    <span className="hidden truncate text-xs text-white/30 sm:block">{s.album}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Player / Lyrics */}
        <div className="order-1 flex min-h-0 flex-col border-b border-white/10 bg-[#0c0c0c] lg:order-2 lg:border-b-0 lg:border-l">
          {song && (
            <>
              {/* Cover + meta */}
              <div className="flex shrink-0 flex-col items-center px-6 pt-6">
                <Cover
                  name={song.title}
                  cover={song.cover}
                  className="aspect-square w-40 shadow-lg shadow-black/40 lg:w-52"
                  textClass="text-5xl"
                />
                <h2 className="mt-4 max-w-full truncate text-center text-lg font-semibold">{song.title}</h2>
                <p className="mt-0.5 truncate text-sm text-white/45">
                  {song.artist}
                  {song.album ? ` · ${song.album}` : ''}
                </p>
              </div>

              {/* Lyrics */}
              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
                {lyrics.length > 0 ? (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-2 text-center"
                  >
                    {lyrics.map((line, i) =>
                      line ? (
                        <p key={i} className="text-sm leading-relaxed text-white/70">
                          {line}
                        </p>
                      ) : (
                        <div key={i} className="h-3" />
                      ),
                    )}
                  </motion.div>
                ) : (
                  <p className="mt-6 text-center text-sm text-white/30">暂无歌词</p>
                )}
              </div>

              {/* Controls (visual) */}
              <div className="shrink-0 border-t border-white/10 px-6 py-4">
                <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: ACCENT }} />
                </div>
                <div className="flex items-center justify-center gap-6">
                  <button className="text-white/60 transition-colors hover:text-white" aria-label="Previous">
                    <SkipBack className="h-5 w-5 fill-current" />
                  </button>
                  <button
                    onClick={() => setPlaying((p) => !p)}
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                    style={{ backgroundColor: ACCENT }}
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    )}
                  </button>
                  <button className="text-white/60 transition-colors hover:text-white" aria-label="Next">
                    <SkipForward className="h-5 w-5 fill-current" />
                  </button>
                  <button className="ml-2 text-white/40 transition-colors hover:text-white" aria-label="Like">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
