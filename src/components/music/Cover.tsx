// Flat-color monogram fallback when an image is missing or fails to load.
// No gradients — a single solid color picked deterministically from the name.
// Loaded covers are cached in-memory (see imageCache) so switching sort/group
// modes or re-rendering never re-fetches or flickers an already-seen cover.
import { useEffect, useState } from 'react';
import { hasFailed, isLoaded, preload } from './imageCache';

const PALETTE = [
  '#ec4141',
  '#3b82f6',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#06b6d4',
  '#ec4899',
  '#f97316',
  '#64748b',
];

function pickColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

interface CoverProps {
  name: string;
  cover?: string;
  className?: string;
  circle?: boolean;
  /** Tailwind text-size class for the monogram letter */
  textClass?: string;
}

export function Cover({ name, cover, className = '', circle = false, textClass = 'text-2xl' }: CoverProps) {
  const shape = circle ? 'rounded-full' : 'rounded-md';

  // 'ready' once the cover is decoded (either already cached or just loaded).
  const [ready, setReady] = useState(() => isLoaded(cover));
  const [failed, setFailed] = useState(() => hasFailed(cover));

  useEffect(() => {
    if (!cover) return;
    if (isLoaded(cover)) { setReady(true); setFailed(false); return; }
    if (hasFailed(cover)) { setFailed(true); return; }
    setReady(false);
    setFailed(false);
    let alive = true;
    preload(cover).then((ok) => {
      if (!alive) return;
      if (ok) setReady(true);
      else setFailed(true);
    });
    return () => { alive = false; };
  }, [cover]);

  if (cover && !failed) {
    return (
      <img
        src={cover}
        alt={name}
        decoding="async"
        className={`${shape} object-cover transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center ${shape} ${className}`}
      style={{ backgroundColor: pickColor(name) }}
    >
      <span className={`font-semibold text-white/90 ${textClass}`}>
        {[...name][0]?.toUpperCase() ?? '♪'}
      </span>
    </div>
  );
}
