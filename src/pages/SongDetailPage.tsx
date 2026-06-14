import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, ChevronDown, ListMusic, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, X,
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

// Phone viewport → dedicated Apple Music-style layout.
function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mobile;
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
  const isMobile = useIsMobile();

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
  // sits at the anchor point — vertically centered on desktop, but biased
  // toward the upper third on phones (Apple Music-style top-anchored scroll).
  const lyricAnchor = isMobile ? 0.32 : 0.5;
  useLayoutEffect(() => {
    const box = scrollRef.current;
    const el = lineRefs.current[activeIndex];
    if (!box) return;
    if (!el) { setOffset(0); return; }
    setOffset(box.clientHeight * lyricAnchor - (el.offsetTop + el.clientHeight / 2));
  }, [activeIndex, song, isMobile, lyricAnchor]);

  // Draggable / clickable progress bar.
  const barRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  // Smooth (rAF-driven) progress: update the fill/thumb imperatively so the
  // bar glides instead of stepping with the ~4Hz `timeupdate` event.
  useEffect(() => {
    return player.subscribeTime((t) => {
      const pc = duration ? Math.min(100, (t / duration) * 100) : 0;
      if (fillRef.current) fillRef.current.style.width = `${pc}%`;
      if (thumbRef.current) thumbRef.current.style.left = `${pc}%`;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, player.currentId, player.subscribeTime, isMobile]);

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

  // ── Shared building blocks (mounted by exactly one layout at a time) ──

  const renderLyrics = (alignClass: string) => (
    <div
      ref={scrollRef}
      className={`relative min-h-0 flex-1 overflow-hidden ${alignClass} [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_15%,#000_82%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,#000_15%,#000_82%,transparent)]`}
    >
      {lines.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="font-mono text-sm tracking-wider text-white/40">纯音乐 · 暂无歌词</p>
        </div>
      ) : (
        <div
          ref={innerRef}
          className="will-change-transform"
          style={{ transform: `translateY(${offset}px)`, transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <div style={{ height: '40vh' }} />
          {lines.map((line, i) => {
            const dist = Math.abs(i - activeIndex);
            const active = i === activeIndex;
            const sung = i < activeIndex;
            const blur = active ? 0 : Math.min(3.2, dist * 0.8);
            const opacity = active ? 1 : Math.max(0.22, 1 - dist * 0.16);
            return (
              <div
                key={i}
                ref={(el) => { lineRefs.current[i] = el; }}
                onClick={() => player.seek(line.time)}
                className={`group cursor-pointer select-none px-1 py-2.5 transition-[color,filter,opacity] duration-500 lg:py-3 ${
                  active ? 'text-white' : sung ? 'text-white/40 hover:text-white/70' : 'text-white/30 hover:text-white/60'
                }`}
                style={{ filter: `blur(${blur}px)`, opacity }}
              >
                <p
                  className={`origin-left font-bold leading-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active
                      ? 'scale-100 text-[26px] drop-shadow-[0_2px_24px_rgba(255,255,255,0.18)] lg:text-[40px]'
                      : 'scale-[0.94] text-[21px] lg:text-[30px]'
                  }`}
                >
                  {line.t}
                </p>
                {line.x && (
                  <p className={`mt-1 font-medium leading-snug transition-all duration-500 ${active ? 'text-base text-white/65 lg:text-lg' : 'text-sm text-white/20'}`}>
                    {line.x}
                  </p>
                )}
              </div>
            );
          })}
          <div style={{ height: '40vh' }} />
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div>
      <div
        ref={barRef}
        onPointerDown={onBarDown}
        onPointerMove={onBarMove}
        className="group relative -my-2 cursor-pointer py-2"
      >
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
          <div ref={fillRef} className="h-full w-0 rounded-full bg-white/80" />
        </div>
        <div
          ref={thumbRef}
          className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
        />
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-white/40">
        <span>{fmt(time)}</span>
        <span>{fmt(duration)}</span>
      </div>
    </div>
  );

  const renderControls = (justifyClass: string, trailing: React.ReactNode) => (
    <div className={`flex items-center gap-5 ${justifyClass}`}>
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
      {trailing}
    </div>
  );

  const drawerHeader = (
    <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[11px] tracking-[0.25em] text-white/40">PLAYLIST</span>
        <span className="text-xs text-white/65">{queueTitle}</span>
      </div>
      <button onClick={() => setShowList(false)} className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white" aria-label="关闭">
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  const queueList = (
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
  );

  return (
    <motion.div
      // No entrance fade/scale: when arriving via the widget's expand morph the
      // page is revealed under a fullscreen hero, so animating here would cause
      // a visible flash at the hand-off.
      initial={false}
      className="relative h-[100dvh] overflow-hidden bg-[#070707] font-sans text-white"
    >
      {/* Ambient background: cover, gaussian-blurred + enlarged */}
      <div
        key={track.cover}
        className="pointer-events-none absolute inset-0 scale-125 bg-cover bg-center blur-3xl"
        style={{ backgroundImage: `url(${track.cover})` }}
      />
      {/* Vibrant→dark gradient: left-to-right on desktop, top-to-bottom on mobile */}
      <div className={`pointer-events-none absolute inset-0 ${isMobile ? 'bg-gradient-to-b from-black/35 via-black/55 to-black/85' : 'bg-gradient-to-r from-black/35 via-black/55 to-black/85'}`} />
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {isMobile ? (
        /* ── Mobile: Apple Music-style — cover+meta header, lyrics, bottom controls ── */
        <div className="relative z-10 flex h-[100dvh] flex-col">
          {/* Header: track counter (left) + collapse button (right) on one row,
              then cover + title/artist on the next — uniform px-5 / py rhythm. */}
          <div className="flex items-center justify-between px-5 pb-1 pt-5">
            <span className="font-mono text-[11px] tracking-[0.2em] text-white/40">{pos + 1}/{queue.length}</span>
            <button
              onClick={() => navigate('/music')}
              className="-mr-1 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10"
              aria-label="Back"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center gap-4 px-5 pb-4 pt-2">
            <Cover
              name={track.name}
              cover={track.cover}
              className="aspect-square w-16 shrink-0 rounded-xl shadow-lg shadow-black/50 ring-1 ring-white/10"
              textClass="text-2xl"
            />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xl font-semibold leading-tight">{track.name}</h2>
              <p className="mt-0.5 truncate text-sm text-white/60">{track.artist}</p>
            </div>
          </div>

          {/* Center: lyrics (left-aligned, top-anchored — Apple Music style) */}
          {renderLyrics('px-5 text-left')}

          {/* Bottom: progress + controls/settings */}
          <div className="shrink-0 px-7 pb-7 pt-3">
            {renderProgress()}
            <div className="mt-5">
              {renderControls(
                'justify-between',
                <button
                  onClick={() => setShowList(true)}
                  className={`transition-colors hover:text-white ${showList ? 'text-[#ec4141]' : 'text-white/70'}`}
                  aria-label="播放列表"
                >
                  <ListMusic className="h-[18px] w-[18px]" />
                </button>,
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Desktop / tablet layout ── */
        <>
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

          <div className="relative z-10 flex h-[calc(100dvh-64px)] flex-col gap-8 px-6 pb-8 lg:flex-row lg:items-stretch lg:gap-12 lg:px-14">
            <div className="flex shrink-0 flex-col items-center lg:w-[40%] lg:items-start lg:justify-end lg:pb-6">
              <Cover
                name={track.name}
                cover={track.cover}
                className="aspect-square w-44 shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:w-52 lg:w-72"
                textClass="text-6xl"
              />
              <div className="mt-5 w-full text-center lg:text-left">
                <h2 className="text-2xl font-semibold leading-tight lg:text-3xl">{track.name}</h2>
                <p className="mt-1 text-sm text-white/60">{track.artist}</p>
              </div>

              <div className="mt-5 w-full max-w-sm lg:max-w-none">{renderProgress()}</div>

              <div className="mt-5">
                {renderControls(
                  'justify-center lg:justify-start',
                  <span className="ml-1 font-mono text-[10px] text-white/30">{pos + 1}/{queue.length}</span>,
                )}
              </div>
            </div>

            {renderLyrics('text-center lg:text-left')}
          </div>
        </>
      )}

      {/* Playlist drawer — bottom sheet on mobile, side panel on desktop */}
      {isMobile ? (
        <>
          <div
            onClick={() => setShowList(false)}
            className={`absolute inset-0 z-20 bg-black/50 transition-opacity duration-300 ${showList ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          />
          <div
            className={`absolute inset-x-0 bottom-0 z-30 flex max-h-[78vh] flex-col rounded-t-2xl border-t border-white/10 bg-[#0c0c0c]/95 backdrop-blur-xl transition-transform duration-300 ${
              showList ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div className="flex justify-center pt-2.5">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>
            {drawerHeader}
            {queueList}
          </div>
        </>
      ) : (
        <div
          className={`absolute inset-y-0 right-0 z-30 flex w-80 max-w-[85vw] flex-col border-l border-white/10 bg-[#0c0c0c]/95 backdrop-blur-xl transition-transform duration-300 ${
            showList ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {drawerHeader}
          {queueList}
        </div>
      )}
    </motion.div>
  );
};
