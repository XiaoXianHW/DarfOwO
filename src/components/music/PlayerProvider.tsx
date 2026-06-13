// Global music player state shared across every page.
//
// Playback is driven by a single <audio> element using the current track's
// real audio source (see getAudioSrc / AUDIO_SOURCES in the music library),
// which provides the playhead, seeking and auto-advance. The provider keeps
// the queue / current track / play state so it survives route changes and can
// be driven from both the floating MusicWidget and the immersive detail page.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  FEATURED,
  getAudioSrc,
  getTrack,
  type Track,
} from '../../data/musicLibrary';

export type PlayMode = 'loop' | 'shuffle';

interface PlayerValue {
  queue: string[];
  queueTitle: string;
  index: number;
  currentId: string | null;
  currentTrack: Track | undefined;
  hasTrack: boolean;
  /** True when the current track is backed by a real audio source. */
  hasAudio: boolean;
  playing: boolean;
  time: number;
  duration: number;
  mode: PlayMode;
  /** Whether the floating real-time lyric overlay is enabled site-wide. */
  lyricsOverlay: boolean;
  /** Start (or restart) playback of a track, optionally replacing the queue. */
  play: (id: string, queue?: string[], title?: string) => void;
  toggle: () => void;
  seek: (sec: number) => void;
  next: () => void;
  prev: () => void;
  cycleMode: () => void;
  toggleLyricsOverlay: () => void;
  /**
   * Subscribe to high-frequency (rAF) playhead updates for smooth progress
   * animation. Returns an unsubscribe fn. The callback is invoked immediately
   * with the current time. This avoids re-rendering the whole tree 60x/sec —
   * subscribers update their own DOM imperatively.
   */
  subscribeTime: (cb: (t: number) => void) => () => void;
}

const PlayerContext = createContext<PlayerValue | null>(null);

const defaultQueue = (): string[] => FEATURED.map((t) => t.id);
const DEFAULT_TITLE = '我最常听';

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<string[]>(defaultQueue);
  const [queueTitle, setQueueTitle] = useState(DEFAULT_TITLE);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<PlayMode>('loop');
  const [lyricsOverlay, setLyricsOverlay] = useState(false);
  // Real duration reported by the <audio> element (0 until metadata loads).
  const [realDuration, setRealDuration] = useState(0);

  // rAF playhead subscribers (smooth progress bars) — see subscribeTime.
  const timeListeners = useRef(new Set<(t: number) => void>());
  const emitTime = useCallback((t: number) => {
    timeListeners.current.forEach((cb) => cb(t));
  }, []);
  const subscribeTime = useCallback((cb: (t: number) => void) => {
    timeListeners.current.add(cb);
    cb(audioRef.current?.currentTime ?? 0);
    return () => {
      timeListeners.current.delete(cb);
    };
  }, []);

  const currentId = started ? queue[index] ?? null : null;
  const currentTrack = currentId ? getTrack(currentId) : undefined;
  const src = useMemo(() => getAudioSrc(currentId), [currentId]);
  const hasAudio = !!src;
  const duration = realDuration;

  // Single, persistent <audio> element (created lazily, browser only).
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (audioRef.current === null && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
  }

  const play = useCallback(
    (id: string, q?: string[], title?: string) => {
      let nextQueue = q && q.length ? q : queue.length ? queue : defaultQueue();
      let idx = nextQueue.indexOf(id);
      if (idx < 0) {
        nextQueue = [id, ...nextQueue];
        idx = 0;
      }
      setQueue(nextQueue);
      setQueueTitle(title ?? (q ? DEFAULT_TITLE : queueTitle));
      setIndex(idx);
      setTime(0);
      setRealDuration(0);
      setStarted(true);
      setPlaying(true);
    },
    [queue, queueTitle],
  );

  const pick = useCallback(
    (dir: 1 | -1) => {
      if (queue.length <= 1) return index;
      if (mode === 'shuffle') {
        let n = index;
        while (n === index) n = Math.floor(Math.random() * queue.length);
        return n;
      }
      return (index + dir + queue.length) % queue.length;
    },
    [queue.length, index, mode],
  );

  const next = useCallback(() => {
    setIndex(pick(1));
    setTime(0);
    setRealDuration(0);
    setStarted(true);
    setPlaying(true);
  }, [pick]);

  const prev = useCallback(() => {
    setIndex(pick(-1));
    setTime(0);
    setRealDuration(0);
    setStarted(true);
    setPlaying(true);
  }, [pick]);

  const toggle = useCallback(() => {
    setStarted(true);
    setPlaying((p) => (started ? !p : true));
  }, [started]);

  const seek = useCallback(
    (sec: number) => {
      const clamped = Math.max(0, Math.min(sec, duration || 0));
      const a = audioRef.current;
      if (a && src) a.currentTime = clamped;
      setTime(clamped);
      emitTime(clamped);
    },
    [duration, src],
  );

  const cycleMode = useCallback(
    () => setMode((m) => (m === 'loop' ? 'shuffle' : 'loop')),
    [],
  );

  const toggleLyricsOverlay = useCallback(() => setLyricsOverlay((v) => !v), []);

  // Keep a stable ref to `next` for event handlers / timers.
  const nextRef = useRef(next);
  nextRef.current = next;

  // Wire the <audio> element's events once.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => { setTime(a.currentTime); emitTime(a.currentTime); };
    const onMeta = () => setRealDuration(a.duration || 0);
    const onEnded = () => nextRef.current();
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('durationchange', onMeta);
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('durationchange', onMeta);
      a.removeEventListener('ended', onEnded);
    };
  }, [emitTime]);

  // Smooth playhead: while playing, push the live currentTime to subscribers
  // every animation frame so progress bars move fluidly (the native
  // `timeupdate` event only fires ~4x/sec, which looks stuttery).
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !src || !playing) return;
    let raf = 0;
    const loop = () => {
      emitTime(a.currentTime);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [src, playing, emitTime]);

  // Load the source whenever the current track changes.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (src) {
      if (a.src !== src) {
        a.src = src;
        a.load();
      }
    } else if (a.src) {
      a.pause();
      a.removeAttribute('src');
      a.load();
    }
  }, [src]);

  // Start / stop the real audio element in step with `playing`.
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !src) return;
    if (playing) {
      a.play().catch(() => {
        /* autoplay can be blocked until a user gesture — ignore */
      });
    } else {
      a.pause();
    }
  }, [playing, src]);

  const value: PlayerValue = {
    queue,
    queueTitle,
    index,
    currentId,
    currentTrack,
    hasTrack: !!currentId,
    hasAudio,
    playing,
    time,
    duration,
    mode,
    lyricsOverlay,
    play,
    toggle,
    seek,
    next,
    prev,
    cycleMode,
    toggleLyricsOverlay,
    subscribeTime,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerValue {
  const v = useContext(PlayerContext);
  if (!v) throw new Error('usePlayer must be used within a PlayerProvider');
  return v;
}
