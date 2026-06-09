import { motion } from 'motion/react';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALBUMS, ARTISTS, SONGS } from '../data/musicLibrary';
import { Cover } from '../components/music/Cover';

// Section label in the status page's technical/mono style.
function Label({ en, zh, count }: { en: string; zh: string; count?: number }) {
  return (
    <div className="mb-4 flex items-baseline gap-2 border-b border-white/5 pb-2">
      <span className="font-mono text-xs tracking-[0.25em] text-white/40">{en}</span>
      <span className="text-sm text-white/70">{zh}</span>
      {count != null && <span className="font-mono text-[11px] text-white/25">/ {count}</span>}
    </div>
  );
}

export const MusicPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a] font-sans text-white selection:bg-white/20">
      {/* Top navigation — mirrors the status page header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 px-6 py-4 backdrop-blur-xl">
        <button
          onClick={() => navigate('/')}
          className="-ml-2 rounded-full p-2 transition-colors hover:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex min-w-0 flex-col items-center text-center">
          <h1 className="text-lg font-medium">音乐 · Music</h1>
          <p className="mt-0.5 truncate text-[11px] text-white/40">
            我喜欢的歌手 · 专辑 · 单曲 · 数据源自网易云音乐
          </p>
        </div>
        <span className="w-6" />
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 lg:px-12">
        <motion.div
          className="mx-auto max-w-5xl space-y-12"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* ARTISTS — round avatar wall */}
          <section>
            <Label en="ARTISTS" zh="常听歌手" count={ARTISTS.length} />
            <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-5">
              {ARTISTS.map((a) => (
                <div key={a.id} className="flex flex-col items-center text-center">
                  <Cover
                    name={a.name}
                    cover={a.cover}
                    circle
                    className="aspect-square w-full max-w-[88px] ring-1 ring-white/10"
                    textClass="text-3xl"
                  />
                  <p className="mt-2 line-clamp-1 text-sm font-medium">{a.name}</p>
                  {a.bio && <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-white/35">{a.bio}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* ALBUMS / COLLECTIONS — square covers, click opens source */}
          <section>
            <Label en="ALBUMS" zh="专辑 / 歌单" count={ALBUMS.length} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ALBUMS.map((al) => {
                const href = al.id.length > 9
                  ? `https://music.163.com/playlist?id=${al.id}`
                  : `https://music.163.com/album?id=${al.id}`;
                return (
                  <a
                    key={al.id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col"
                  >
                    <div className="relative overflow-hidden rounded-md ring-1 ring-white/10">
                      <Cover name={al.name} cover={al.cover} className="aspect-square w-full" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <ExternalLink className="h-5 w-5 text-white/90" />
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-1 text-sm font-medium">{al.name}</p>
                    <p className="line-clamp-1 text-[11px] text-white/40">
                      {al.artist}{al.year ? ` · ${al.year}` : ''}
                    </p>
                    {al.note && <p className="mt-0.5 line-clamp-1 text-[11px] text-white/25">{al.note}</p>}
                  </a>
                );
              })}
            </div>
          </section>

          {/* SONGS — clean list, click opens immersive detail */}
          <section>
            <Label en="TRACKS" zh="精选单曲" count={SONGS.length} />
            <div className="divide-y divide-white/5">
              {SONGS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/music/${s.id}`)}
                  className="group flex w-full items-center gap-4 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <span className="w-5 shrink-0 text-center font-mono text-xs text-white/30 group-hover:hidden">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Play className="hidden h-4 w-5 shrink-0 text-white/80 group-hover:block" fill="currentColor" />
                  <Cover name={s.name} cover={s.cover} className="h-11 w-11 shrink-0" textClass="text-base" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{s.name}</p>
                    <p className="line-clamp-1 text-[11px] text-white/40">{s.artist}</p>
                  </div>
                  <p className="hidden min-w-0 max-w-[40%] truncate text-right text-[11px] text-white/30 sm:block">
                    {s.album}{s.year ? ` · ${s.year}` : ''}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};
