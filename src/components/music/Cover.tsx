// Flat-color monogram fallback when a track/artist/album has no cover image.
// No gradients — a single solid color picked deterministically from the name.
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
  if (cover) {
    return (
      <img
        src={cover}
        alt={name}
        loading="lazy"
        className={`${shape} object-cover ${className}`}
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
