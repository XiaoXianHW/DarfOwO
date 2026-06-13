// Flat-color monogram fallback when an image is missing or fails to load.
// No gradients — a single solid color picked deterministically from the name.
// Covers are lazy-loaded natively (loading="lazy") so only visible rows fetch.
// A small in-memory set (see imageCache) records covers that already finished
// loading so they render instantly without re-playing the fade-in when their
// row remounts after a sort/group switch.
import { useState } from 'react';
import { hasFailed, isLoaded, markFailed, markLoaded } from './imageCache';

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

  // Covers already loaded earlier this session render at full opacity right
  // away (no fade-in replay); first-time covers fade in once decoded.
  const [ready, setReady] = useState(() => isLoaded(cover));
  const [failed, setFailed] = useState(() => hasFailed(cover));

  if (cover && !failed) {
    return (
      <img
        src={cover}
        alt={name}
        loading="lazy"
        decoding="async"
        onLoad={() => { markLoaded(cover); setReady(true); }}
        onError={() => { markFailed(cover); setFailed(true); }}
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
