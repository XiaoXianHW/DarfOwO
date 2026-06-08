import { motion } from 'motion/react';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Heart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const img = (seed: string, size = 500) => `https://picsum.photos/seed/${seed}/${size}/${size}`;

const artists = [
  { id: 'a1', name: 'The Weeknd', seed: 'weeknd' },
  { id: 'a2', name: 'Daft Punk', seed: 'daftpunk' },
  { id: 'a3', name: 'M83', seed: 'm83' },
  { id: 'a4', name: 'HOME', seed: 'homeband' },
  { id: 'a5', name: 'Tame Impala', seed: 'tameimpala' },
  { id: 'a6', name: 'ODESZA', seed: 'odesza' },
  { id: 'a7', name: 'Glass Animals', seed: 'glassanimals' },
  { id: 'a8', name: 'RÜFÜS', seed: 'rufus' },
];

const albums = [
  { id: 'al1', title: 'After Hours', artist: 'The Weeknd', seed: 'afterhours' },
  { id: 'al2', title: 'Random Access Memories', artist: 'Daft Punk', seed: 'ram' },
  { id: 'al3', title: "Hurry Up, We're Dreaming", artist: 'M83', seed: 'hurryup' },
  { id: 'al4', title: 'Odyssey', artist: 'HOME', seed: 'odyssey' },
  { id: 'al5', title: 'Currents', artist: 'Tame Impala', seed: 'currents' },
  { id: 'al6', title: 'A Moment Apart', artist: 'ODESZA', seed: 'momentapart' },
  { id: 'al7', title: 'Dreamland', artist: 'Glass Animals', seed: 'dreamland' },
  { id: 'al8', title: 'Atlas', artist: 'RÜFÜS', seed: 'atlas' },
  { id: 'al9', title: 'Starboy', artist: 'The Weeknd', seed: 'starboy' },
  { id: 'al10', title: 'Discovery', artist: 'Daft Punk', seed: 'discovery' },
  { id: 'al11', title: 'Junk', artist: 'M83', seed: 'junk' },
  { id: 'al12', title: 'Resonance', artist: 'HOME', seed: 'resonance' },
];

const playlists = [
  { id: 'p1', name: 'Coding Focus', tracks: 142, seed: 'codingfocus' },
  { id: 'p2', name: 'Late Night Drives', tracks: 86, seed: 'latenight' },
  { id: 'p3', name: 'Synthwave Essentials', tracks: 215, seed: 'synthwave' },
  { id: 'p4', name: 'Chill Vibes', tracks: 94, seed: 'chillvibes' },
  { id: 'p5', name: 'Morning Coffee', tracks: 58, seed: 'morningcoffee' },
  { id: 'p6', name: 'Deep Work', tracks: 173, seed: 'deepwork' },
];

const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-5 flex items-end justify-between">
    <div>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-white/40">{sub}</p>}
    </div>
    <button className="flex items-center gap-1 text-sm font-medium text-white/50 transition-colors hover:text-white">
      查看全部 <ChevronRight className="h-4 w-4" />
    </button>
  </div>
);

export const MusicPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const current = albums[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white selection:bg-pink-500/30">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 z-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-fuchsia-900/20 blur-[140px]" />

      {/* Sticky header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]/70 px-6 py-4 backdrop-blur-xl sm:px-10 lg:px-16">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="group rounded-full border border-white/10 bg-white/5 p-2.5 transition-colors hover:bg-white/10"
            aria-label="Back home"
          >
            <ArrowLeft className="h-5 w-5 text-white/70 group-hover:text-white" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">音乐 · Music</h1>
        </div>
        <p className="hidden font-mono text-xs uppercase tracking-widest text-white/30 sm:block">
          Listening Library
        </p>
      </header>

      <main className="relative z-10 mx-auto max-w-[1600px] px-6 pb-32 pt-8 sm:px-10 lg:px-16">
        {/* Artists */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <SectionHeader title="歌手" sub="Artists you love" />
          <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {artists.map((a) => (
              <button key={a.id} className="group flex flex-col items-center gap-3 text-center">
                <div className="relative aspect-square w-full overflow-hidden rounded-full shadow-lg shadow-black/40 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={img(a.seed, 300)}
                    alt={a.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className="w-full truncate text-sm font-medium text-white/80 group-hover:text-white">
                  {a.name}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Albums */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-14"
        >
          <SectionHeader title="专辑" sub="Albums in your collection" />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {albums.map((al) => (
              <button key={al.id} className="group text-left">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl shadow-black/40 ring-1 ring-white/5">
                  <img
                    src={img(al.seed)}
                    alt={al.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Play className="ml-0.5 h-5 w-5 fill-current" />
                  </div>
                </div>
                <h3 className="mt-3 truncate text-sm font-semibold text-white">{al.title}</h3>
                <p className="truncate text-xs text-white/40">{al.artist}</p>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Playlists */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SectionHeader title="歌单" sub="Your playlists" />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {playlists.map((pl) => (
              <button key={pl.id} className="group text-left">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl shadow-black/40 ring-1 ring-white/5">
                  <img
                    src={img(pl.seed)}
                    alt={pl.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="truncate text-sm font-bold text-white">{pl.name}</h3>
                    <p className="text-xs text-white/60">{pl.tracks} 首</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Now playing bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#101010]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-6 py-3 sm:px-10 lg:px-16">
          <img
            src={img(current.seed, 120)}
            alt={current.title}
            className="h-12 w-12 rounded-lg object-cover shadow-md"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{current.title}</p>
            <p className="truncate text-xs text-white/50">{current.artist}</p>
          </div>
          <button className="hidden text-white/50 transition-colors hover:text-pink-500 sm:block">
            <Heart className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-5">
            <button className="text-white/70 transition-colors hover:text-white">
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              )}
            </button>
            <button className="text-white/70 transition-colors hover:text-white">
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
