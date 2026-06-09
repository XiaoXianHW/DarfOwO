import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { SONGS, getSong } from '../data/musicLibrary';
import { Cover } from '../components/music/Cover';

function fmt(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const SongDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const song = id ? getSong(id) : undefined;

  const index = useMemo(() => SONGS.findIndex((s) => s.id === id), [id]);
  const prevId = index > 0 ? SONGS[index - 1].id : SONGS[SONGS.length - 1].id;
  const nextId = index >= 0 && index < SONGS.length - 1 ? SONGS[index + 1].id : SONGS[0].id;

  // Visual playback simulation (no real audio): drives lyric highlight + progress.
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const duration = useMemo(() => {
    const lines = song?.lines ?? [];
    return lines.length ? lines[lines.length - 1].time + 6 : 0;
  }, [song]);

  // Reset when the song changes.
  useEffect(() => {
    setTime(0);
    setPlaying(true);
  }, [id]);

  useEffect(() => {
    if (!playing || duration === 0) return;
    const t = setInterval(() => {
      setTime((prev) => {
        const next = prev + 0.2;
        if (next >= duration) {
          setPlaying(false);
          return duration;
        }
        return next;
      });
    }, 200);
    return () => clearInterval(t);
  }, [playing, duration]);

  const activeIndex = useMemo(() => {
    const lines = song?.lines ?? [];
    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= time) idx = i;
      else break;
    }
    return idx;
  }, [song, time]);

  // Keep the active lyric line centered.
  useEffect(() => {
    const el = lineRefs.current[activeIndex];
    const box = scrollRef.current;
    if (el && box) {
      box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2, behavior: 'smooth' });
    }
  }, [activeIndex]);

  if (!song) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-white">
        <p className="text-white/60">没有找到这首歌</p>
        <button onClick={() => navigate('/music')} className="rounded-full border border-white/15 px-5 py-2 text-sm hover:bg-white/10">
          返回音乐
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[#070707] font-sans text-white">
      {/* Ambient background: the cover, gaussian-blurred and enlarged. */}
      <div
        className="pointer-events-none absolute inset-0 scale-125 bg-cover bg-center blur-3xl"
        style={{ backgroundImage: `url(${song.cover})` }}
      />
      {/* Left→right gradient: clear/vibrant on the left, darker toward the lyrics on the right. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/55 to-black/85" />
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate('/music')}
          className="-ml-2 flex items-center gap-2 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="font-mono text-[11px] tracking-[0.3em] text-white/40">NOW PLAYING</span>
        <span className="w-6" />
      </div>

      {/* Main: cover + controls (left), lyrics (right) */}
      <div className="relative z-10 flex h-[calc(100vh-64px)] flex-col gap-8 px-6 pb-8 lg:flex-row lg:items-center lg:gap-12 lg:px-14">
        {/* LEFT — sharp cover, title, controls */}
        <div className="flex shrink-0 flex-col items-center lg:w-[42%] lg:items-start">
          <Cover
            name={song.name}
            cover={song.cover}
            className="aspect-square w-44 shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:w-52 lg:w-72"
            textClass="text-6xl"
          />
          <div className="mt-5 w-full text-center lg:text-left">
            <h2 className="text-2xl font-semibold leading-tight lg:text-3xl">{song.name}</h2>
            <p className="mt-1 text-sm text-white/60">{song.artist}</p>
            <p className="mt-0.5 font-mono text-[11px] text-white/35">
              {song.album}{song.year ? ` · ${song.year}` : ''}
            </p>
          </div>

          {/* Progress (visual) */}
          <div className="mt-5 w-full max-w-sm lg:max-w-none">
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white/80"
                style={{ width: `${duration ? Math.min(100, (time / duration) * 100) : 0}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] text-white/40">
              <span>{fmt(time)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 flex items-center justify-center gap-6 lg:justify-start">
            <button onClick={() => navigate(`/music/${prevId}`)} className="text-white/70 transition-colors hover:text-white" aria-label="Previous">
              <SkipBack className="h-6 w-6" fill="currentColor" />
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />}
            </button>
            <button onClick={() => navigate(`/music/${nextId}`)} className="text-white/70 transition-colors hover:text-white" aria-label="Next">
              <SkipForward className="h-6 w-6" fill="currentColor" />
            </button>
          </div>
        </div>

        {/* RIGHT — lyrics with focus blur; click a line to seek */}
        <div className="relative min-h-0 flex-1">
          {/* top / bottom fade so lyrics dissolve at the edges */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          <div ref={scrollRef} className="custom-scrollbar h-full overflow-y-auto py-[30vh] lg:py-[35vh]">
            {song.lines.length === 0 && (
              <p className="text-white/40">纯音乐 · 暂无歌词</p>
            )}
            {song.lines.map((line, i) => {
              const dist = Math.abs(i - activeIndex);
              const active = i === activeIndex;
              const blur = dist === 0 ? 0 : dist === 1 ? 0.6 : dist === 2 ? 1.2 : 2;
              return (
                <div
                  key={i}
                  ref={(el) => { lineRefs.current[i] = el; }}
                  onClick={() => { setTime(line.time); }}
                  className={`cursor-pointer py-2.5 transition-all duration-300 ${
                    active ? 'text-white' : 'text-white/35 hover:text-white/60'
                  }`}
                  style={{ filter: `blur(${blur}px)` }}
                >
                  <p className={`leading-snug ${active ? 'text-xl font-semibold lg:text-2xl' : 'text-lg lg:text-xl'}`}>
                    {line.t}
                  </p>
                  {line.x && (
                    <p className={`mt-0.5 leading-snug ${active ? 'text-sm text-white/70' : 'text-sm text-white/25'}`}>
                      {line.x}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
