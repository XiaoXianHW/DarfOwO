// Site-wide floating lyric overlay. When enabled from the mini-player
// (player.lyricsOverlay), the current lyric line floats near the bottom of
// every page in real time. Hidden on the immersive song detail page, which
// already renders the full lyrics.
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { getSong } from '../../data/musicLibrary';
import { usePlayer } from './PlayerProvider';

export function FloatingLyric() {
  const p = usePlayer();
  const { pathname } = useLocation();

  const song = p.currentId ? getSong(p.currentId) : undefined;
  const lines = song?.lines ?? [];

  const activeIndex = useMemo(() => {
    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= p.time) idx = i;
      else break;
    }
    return idx;
  }, [lines, p.time]);

  // The immersive detail page (`/music/:id`, but not /artist or /album) shows
  // full lyrics already, so suppress the overlay there.
  const onDetailPage =
    /^\/music\/[^/]+$/.test(pathname) &&
    !pathname.startsWith('/music/artist') &&
    !pathname.startsWith('/music/album');

  const line = activeIndex >= 0 ? lines[activeIndex] : undefined;
  const show = p.lyricsOverlay && p.hasTrack && lines.length > 0 && !!line && !onDetailPage;

  return createPortal(
    <AnimatePresence>
      {show && line && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed bottom-24 left-1/2 z-[85] flex w-[min(92vw,720px)] -translate-x-1/2 flex-col items-center text-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-black/35 px-6 py-3 shadow-xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-xl"
            >
              <p className="text-lg font-semibold leading-snug text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.5)] lg:text-xl">
                {line.t}
              </p>
              {line.x && (
                <p className="mt-1 text-sm font-medium leading-snug text-white/55">{line.x}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
