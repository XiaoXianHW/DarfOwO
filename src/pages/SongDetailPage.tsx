import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, ListMusic, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, X,
} from 'lucide-react';
import { getSong, getTrack, type LyricLine } from '../data/musicLibrary';
import { Cover } from '../components/music/Cover';
import { usePlayer } from '../components/music/PlayerProvider';

function fmt(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const SongDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const player = usePlayer();

  const track = id ? getTrack(id) : undefined;
  const song = id ? getSong(id) : undefined;
  const lines: LyricLine[] = song?.lines ?? [];

  const launchState = location.state as { queue?: string[]; title?: string } | null;

  // Drive the shared global player: start this track if it isn't already the
  // one playing (e.g. opened directly or from the library list).
  useEffect(() => {
    if (!id || !track) return;
    if (player.currentId !== id) {
      player.play(id, launchState?.queue, launchState?.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Follow the player when it advances on its OWN (auto-skip / next / prev).
  // `follow` only arms once the player has caught up to this route, so the
  // initial mount (when currentId is still the previous track) can't bounce us
  // back to whatever was playing before.
  const follow = useRef(false);
  useEffect(() => {
    follow.current = false;
  }, [id]);
  useEffect(() => {
    if (!id) return;
    if (player.currentId === id) {
      follow.current = true;
    } else if (follow.current && player.currentId) {
      navigate(`/music/${player.currentId}`, { state: location.state, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.currentId, id]);

  const { time, duration, playing, mode, queue, queueTitle } = player;
  const pos = player.index;

  const [showList, setShowList] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [offset, setOffset] = useState(0);

  const activeIndex = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= time) idx = i;
      else break;
    }
    return idx;
  }, [lines, time]);

  // Smooth transform-based lyric scroll: translate the list so the active line
  // sits at the vertical center of the viewport.
  useLayoutEffect(() => {
    const box = scrollRef.current;
    const el = lineRefs.current[activeIndex];
    if (!box) return;
    if (!el) { setOffset(0); return; }
    setOffset(box.clientHeight / 2 - (el.offsetTop + el.clientHeight / 2));
  }, [activeIndex, song]);

  // Draggable / clickable progress bar.
  const barRef = useRef<HTMLDivElement | null>(null);
  const seekFromClientX = (clientX: number) => {
    const bar = barRef.current;
    if (!bar || !duration) return;
    const r = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    player.seek(ratio * duration);
  };
  const onBarDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    seekFromClientX(e.clientX);
  };
  const onBarMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) seekFromClientX(e.clientX);
  };

  if (!track) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#0a0a0a] text-white">
        <p className="text-white/60">没有找到这首歌</p>
        <button onClick={() => navigate('/music')} className="rounded-full border border-white/15 px-5 py-2 text-sm hover:bg-white/10">
          返回音乐
        </button>
      </div>
    );
  }

  const pct = duration ? Math.min(100, (time / duration) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-screen overflow-hidden bg-[#070707] font-sans text-white"
    >
      {/* Ambient background: cover, gaussian-blurred + enlarged */}
      <div
        key={track.cover}
        className="pointer-events-none absolute inset-0 scale-125 bg-cover bg-center blur-3xl"
        style={{ backgroundImage: `url(${track.cover})` }}
      />
      {/* Left→right gradient: vibrant left, darker toward the lyrics */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-black/55 to-black/85" />
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate('/music')}
          className="-ml-2 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="font-mono text-[11px] tracking-[0.3em] text-white/40">NOW PLAYING</span>
        <button
          onClick={() => setShowList((s) => !s)}
          className={`rounded-full p-2 transition-colors hover:bg-white/10 ${showList ? 'text-[#ec4141]' : 'text-white/80'}`}
          aria-label="播放列表"
        >
          <ListMusic className="h-5 w-5" />
        </button>
      </div>

      {/* Main: cover + controls (left), lyrics (right) */}
      <div className="relative z-10 flex h-[calc(100vh-64px)] flex-col gap-8 px-6 pb-8 lg:flex-row lg:items-center lg:gap-12 lg:px-14">
        {/* LEFT — sharp cover, title, progress, controls */}
        <div className="flex shrink-0 flex-col items-center lg:w-[40%] lg:items-start">
          <Cover
            name={track.name}
            cover={track.cover}
            className="aspect-square w-44 shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:w-52 lg:w-72"
            textClass="text-6xl"
          />
          <div className="mt-5 w-full text-center lg:text-left">
            <h2 className="text-2xl font-semibold leading-tight lg:text-3xl">{track.name}</h2>
            <p className="mt-1 text-sm text-white/60">{track.artist}</p>
            <p className="mt-0.5 font-mono text-[11px] text-white/35">
              {track.album}{song?.year ? ` · ${song.year}` : ''}
            </p>
          </div>

          {/* Draggable progress */}
          <div className="mt-5 w-full max-w-sm lg:max-w-none">
            <div
              ref={barRef}
              onPointerDown={onBarDown}
              onPointerMove={onBarMove}
              className="group relative -my-2 cursor-pointer py-2"
            >
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-white/80" style={{ width: `${pct}%` }} />
              </div>
              <div
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                style={{ left: `${pct}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] text-white/40">
              <span>{fmt(time)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 flex items-center justify-center gap-5 lg:justify-start">
            <button
              onClick={player.cycleMode}
              className="text-white/55 transition-colors hover:text-white"
              aria-label={mode === 'loop' ? '列表循环' : '随机播放'}
              title={mode === 'loop' ? '列表循环' : '随机播放'}
            >
              {mode === 'loop'
                ? <Repeat className="h-[18px] w-[18px]" />
                : <Shuffle className="h-[18px] w-[18px] text-[#ec4141]" />}
            </button>
            <button onClick={player.prev} className="text-white/70 transition-colors hover:text-white" aria-label="Previous">
              <SkipBack className="h-6 w-6" fill="currentColor" />
            </button>
            <button
              onClick={player.toggle}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />}
            </button>
            <button onClick={player.next} className="text-white/70 transition-colors hover:text-white" aria-label="Next">
              <SkipForward className="h-6 w-6" fill="currentColor" />
            </button>
            <span className="ml-1 font-mono text-[10px] text-white/30">{pos + 1}/{queue.length}</span>
          </div>
        </div>

        {/* RIGHT — lyrics with focus blur + smooth transform scroll */}
        <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-hidden text-center">
          {lines.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="font-mono text-sm tracking-wider text-white/40">纯音乐 · 暂无歌词</p>
            </div>
          ) : (
            <div
              ref={innerRef}
              className="will-change-transform"
              style={{ transform: `translateY(${offset}px)`, transition: 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)' }}
            >
              {/* top padding so the first line can reach center */}
              <div style={{ height: '42vh' }} />
              {lines.map((line, i) => {
                const dist = Math.abs(i - activeIndex);
                const active = i === activeIndex;
                const blur = active ? 0 : dist === 1 ? 0.8 : dist === 2 ? 1.6 : 2.6;
                return (
                  <div
                    key={i}
                    ref={(el) => { lineRefs.current[i] = el; }}
                    onClick={() => player.seek(line.time)}
                    className={`cursor-pointer py-2 transition-all duration-300 lg:py-2.5 ${
                      active ? 'text-white' : 'text-white/35 hover:text-white/60'
                    }`}
                    style={{ filter: `blur(${blur}px)` }}
                  >
                    <p className={`leading-snug ${active ? 'text-2xl font-semibold lg:text-[26px]' : 'text-lg lg:text-xl'}`}>
                      {line.t}
                    </p>
                    {line.x && (
                      <p className={`mt-0.5 leading-snug ${active ? 'text-base text-white/70' : 'text-sm text-white/25'}`}>
                        {line.x}
                      </p>
                    )}
                  </div>
                );
              })}
              <div style={{ height: '42vh' }} />
            </div>
          )}
        </div>
      </div>

      {/* Playlist drawer */}
      <div
        className={`absolute inset-y-0 right-0 z-30 flex w-80 max-w-[85vw] flex-col border-l border-white/10 bg-[#0c0c0c]/95 backdrop-blur-xl transition-transform duration-300 ${
          showList ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[11px] tracking-[0.25em] text-white/40">PLAYLIST</span>
            <span className="text-xs text-white/65">{queueTitle}</span>
          </div>
          <button onClick={() => setShowList(false)} className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white" aria-label="关闭">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {queue.map((qid, i) => {
            const t = getTrack(qid);
            if (!t) return null;
            const cur = qid === player.currentId;
            return (
              <button
                key={qid}
                onClick={() => player.play(qid, queue, queueTitle)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-white/[0.06] ${cur ? 'bg-white/[0.05]' : ''}`}
              >
                <span className={`w-5 shrink-0 text-right font-mono text-[11px] ${cur ? 'text-[#ec4141]' : 'text-white/30'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm ${cur ? 'text-[#ec4141]' : ''}`}>{t.name}</p>
                  <p className="truncate text-[11px] text-white/40">{t.artist}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
