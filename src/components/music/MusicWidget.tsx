// Global, site-wide music entry point: a small top-right button (current cover
// or a music note) that opens a popup mini-player — playlist, draggable
// progress, play/pause and track skipping. Rendered on every primary page; the
// playback state itself lives in PlayerProvider so it persists across routes.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Maximize2, Music, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, X,
} from 'lucide-react';
import { getTrack } from '../../data/musicLibrary';
import { usePlayer } from './PlayerProvider';
import { Cover } from './Cover';

function fmt(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function MusicWidget() {
  const [open, setOpen] = useState(false);
  // While expanding, the popup morphs to fullscreen and then routes to the
  // immersive lyric page, so the zoom feels continuous.
  const [expanding, setExpanding] = useState(false);
  const p = usePlayer();
  const navigate = useNavigate();
  const barRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Anchor the (body-portaled) popup to the trigger button's real position so
  // its top-right corner lines up just under the button on every page,
  // regardless of that page's header padding.
  const [anchor, setAnchor] = useState({ top: 64, right: 12 });
  const updateAnchor = () => {
    const b = triggerRef.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    setAnchor({ top: Math.round(r.bottom + 10), right: Math.max(8, Math.round(window.innerWidth - r.right)) });
  };
  useLayoutEffect(() => {
    if (open && !expanding) updateAnchor();
  }, [open, expanding]);
  useEffect(() => {
    if (!open) return;
    const onResize = () => updateAnchor();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  const expand = () => {
    if (!p.currentId) return;
    setExpanding(true);
  };
  const onExpandDone = () => {
    if (!expanding) return;
    const id = p.currentId;
    setOpen(false);
    setExpanding(false);
    if (id) navigate(`/music/${id}`);
  };

  const pct = p.duration ? Math.min(100, (p.time / p.duration) * 100) : 0;

  const seekFromClientX = (clientX: number) => {
    const bar = barRef.current;
    if (!bar || !p.duration) return;
    const r = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    p.seek(ratio * p.duration);
  };
  const onBarDown = (e: React.PointerEvent) => {
    if (!p.hasTrack) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    seekFromClientX(e.clientX);
  };
  const onBarMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) seekFromClientX(e.clientX);
  };

  return (
    <>
      {/* ===== Trigger button (top-right on every page) ===== */}
      <button
        ref={triggerRef}
        onClick={() => { updateAnchor(); setOpen((o) => !o); }}
        aria-label="音乐播放器"
        title="音乐播放器"
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/40 text-white ring-1 ring-white/15 backdrop-blur-md transition-all hover:bg-black/60 ${
          open ? 'ring-2 ring-[#ec4141]' : ''
        }`}
      >
        {p.currentTrack?.cover ? (
          <Cover name={p.currentTrack.name} cover={p.currentTrack.cover} className="h-full w-full" textClass="text-sm" />
        ) : (
          <Music className="h-5 w-5" />
        )}
        {p.playing && (
          <span className="absolute bottom-1 right-1 flex h-2.5 items-end gap-[1.5px]">
            <span className="eq-bar w-[2px] bg-[#ec4141]" style={{ animationDelay: '0ms' }} />
            <span className="eq-bar w-[2px] bg-[#ec4141]" style={{ animationDelay: '150ms' }} />
            <span className="eq-bar w-[2px] bg-[#ec4141]" style={{ animationDelay: '300ms' }} />
          </span>
        )}
      </button>

      {/* ===== Popup mini-player — portaled to <body> so it escapes any host
          page's stacking / backdrop-filter context, keeping the z-order and
          the gaussian-blur backdrop working consistently on every page. ===== */}
      {createPortal(
        <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.div
              layout
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              onLayoutAnimationComplete={onExpandDone}
              className={
                expanding
                  ? 'fixed inset-0 z-[110] flex flex-col overflow-hidden border-0 bg-[#070707] text-white'
                  : 'fixed z-[100] flex max-h-[min(560px,calc(100vh-5rem))] w-[330px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]/70 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl'
              }
              style={expanding ? undefined : { top: anchor.top, right: anchor.right }}
            >
              {expanding ? (
                <ExpandHero name={p.currentTrack?.name ?? '♪'} cover={p.currentTrack?.cover} artist={p.currentTrack?.artist} />
              ) : (
              <>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-white/40">PLAYLIST</span>
                  <span className="truncate text-xs text-white/65">{p.queueTitle}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={expand}
                    disabled={!p.hasTrack}
                    className="rounded-full p-1.5 text-white/55 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="展开全屏"
                    title="展开播放页"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full p-1.5 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="关闭"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Now playing */}
              <div className="shrink-0 px-4 pb-3 pt-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => p.currentId && navigate(`/music/${p.currentId}`)}
                    disabled={!p.hasTrack}
                    className="shrink-0 disabled:cursor-default"
                    title={p.hasTrack ? '打开歌词页' : undefined}
                  >
                    <Cover
                      name={p.currentTrack?.name ?? '♪'}
                      cover={p.currentTrack?.cover}
                      className="h-14 w-14 ring-1 ring-white/10"
                      textClass="text-xl"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {p.currentTrack?.name ?? '未在播放'}
                    </p>
                    <p className="truncate text-[11px] text-white/45">
                      {p.currentTrack?.artist || '点击下方歌单开始播放'}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div
                  ref={barRef}
                  onPointerDown={onBarDown}
                  onPointerMove={onBarMove}
                  className={`group relative mt-3 -my-1.5 py-1.5 ${p.hasTrack ? 'cursor-pointer' : ''}`}
                >
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-[#ec4141]" style={{ width: `${pct}%` }} />
                  </div>
                  <div
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                    style={{ left: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between font-mono text-[10px] text-white/40">
                  <span>{fmt(p.time)}</span>
                  <span>{fmt(p.duration)}</span>
                </div>

                {/* Controls */}
                <div className="mt-2 flex items-center justify-center gap-5">
                  <button
                    onClick={p.cycleMode}
                    className="text-white/55 transition-colors hover:text-white"
                    title={p.mode === 'loop' ? '列表循环' : '随机播放'}
                    aria-label={p.mode === 'loop' ? '列表循环' : '随机播放'}
                  >
                    {p.mode === 'loop'
                      ? <Repeat className="h-[18px] w-[18px]" />
                      : <Shuffle className="h-[18px] w-[18px] text-[#ec4141]" />}
                  </button>
                  <button onClick={p.prev} className="text-white/75 transition-colors hover:text-white" aria-label="上一首">
                    <SkipBack className="h-5 w-5" fill="currentColor" />
                  </button>
                  <button
                    onClick={p.toggle}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105"
                    aria-label={p.playing ? '暂停' : '播放'}
                  >
                    {p.playing
                      ? <Pause className="h-5 w-5" fill="currentColor" />
                      : <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />}
                  </button>
                  <button onClick={p.next} className="text-white/75 transition-colors hover:text-white" aria-label="下一首">
                    <SkipForward className="h-5 w-5" fill="currentColor" />
                  </button>
                  <button
                    onClick={() => { setOpen(false); navigate('/music'); }}
                    className="text-white/55 transition-colors hover:text-white"
                    title="音乐库"
                    aria-label="音乐库"
                  >
                    <Music className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </div>

              {/* Queue list */}
              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-white/5 px-2 py-2">
                {p.queue.map((qid, i) => {
                  const t = getTrack(qid);
                  if (!t) return null;
                  const cur = qid === p.currentId;
                  return (
                    <button
                      key={qid}
                      onClick={() => p.play(qid, p.queue, p.queueTitle)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-white/[0.06] ${
                        cur ? 'bg-white/[0.05]' : ''
                      }`}
                    >
                      <span className={`w-5 shrink-0 text-right font-mono text-[11px] ${cur ? 'text-[#ec4141]' : 'text-white/30'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <Cover name={t.name} cover={t.cover} className="h-8 w-8 shrink-0 ring-1 ring-white/10" textClass="text-xs" />
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm ${cur ? 'text-[#ec4141]' : ''}`}>{t.name}</p>
                        <p className="truncate text-[11px] text-white/40">{t.artist}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              </>
              )}
            </motion.div>
          </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

// Transitional fullscreen view shown while the popup grows into the lyric page.
// Mirrors the SongDetailPage hero (blurred cover backdrop + sharp centered
// cover) so the hand-off to the route is seamless.
function ExpandHero({ name, cover, artist }: { name: string; cover?: string; artist?: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {cover && (
        <div
          className="pointer-events-none absolute inset-0 scale-125 bg-cover bg-center blur-3xl"
          style={{ backgroundImage: `url(${cover})` }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-black/55 to-black/85" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <Cover name={name} cover={cover} className="aspect-square w-56 shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:w-64" textClass="text-6xl" />
        <h2 className="mt-6 text-2xl font-semibold">{name}</h2>
        {artist && <p className="mt-1 text-sm text-white/60">{artist}</p>}
      </motion.div>
    </div>
  );
}
