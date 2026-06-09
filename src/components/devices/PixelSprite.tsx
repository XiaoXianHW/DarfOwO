// Tiny pixel-art sprites for the device inventory. Each sprite is authored as a
// matrix of strings where any non-space character is a filled pixel. The sprite
// is rendered as 1x1 SVG <rect>s on an integer grid with crisp (non-antialiased)
// edges, so it scales up as chunky pixels in `currentColor`.

const SPRITES = {
  tower: [
    'XXXXXXX',
    'X     X',
    'X XXX X',
    'X     X',
    'X     X',
    'X X   X',
    'X X   X',
    'X     X',
    'X XXX X',
    'X     X',
    'XXXXXXX',
  ],
  mini: [
    'XXXXXXXXXX',
    'X        X',
    'X        X',
    'X   XX   X',
    'X        X',
    'XXXXXXXXXX',
  ],
  laptop: [
    '  XXXXXXXX  ',
    '  X      X  ',
    '  X      X  ',
    '  X      X  ',
    '  XXXXXXXX  ',
    'XXXXXXXXXXXX',
    'X          X',
    'XXXXXXXXXXXX',
  ],
  phone: [
    ' XXXXXX ',
    ' X    X ',
    ' X    X ',
    ' X    X ',
    ' X    X ',
    ' X    X ',
    ' X XX X ',
    ' XXXXXX ',
  ],
  tablet: [
    'XXXXXXXXXX',
    'X        X',
    'X        X',
    'X        X',
    'X        X',
    'X       XX',
    'XXXXXXXXXX',
  ],
  nas: [
    'XXXXXXXX',
    'X XXXX X',
    'X     X',
    'X XXXX X',
    'X     X',
    'X XXXX X',
    'X     X',
    'XXXXXXXX',
  ],
  monitor: [
    'XXXXXXXXXX',
    'X        X',
    'X        X',
    'X        X',
    'X        X',
    'XXXXXXXXXX',
    '   XXXX   ',
    '  XXXXXX  ',
  ],
  mouse: [
    '  XXXX  ',
    ' XX  XX ',
    ' X X  X ',
    ' X X  X ',
    ' X    X ',
    ' XX  XX ',
    '  XXXX  ',
  ],
  keyboard: [
    'XXXXXXXXXXXX',
    'X XXXXXXXX X',
    'X XXXXXXXX X',
    'X   XXXX   X',
    'XXXXXXXXXXXX',
  ],
  vr: [
    'XXXXXXXXXX',
    'X        X',
    'X XX  XX X',
    'X XX  XX X',
    'X        X',
    ' XXXXXXXX ',
    '  X    X  ',
  ],
  earbuds: [
    ' XX  XX ',
    ' XX  XX ',
    ' XX  XX ',
    '  X  X  ',
    '  X  X  ',
    '  X  X  ',
  ],
  watch: [
    '  XXXX  ',
    '  X  X  ',
    ' XXXXXX ',
    ' X    X ',
    ' X XX X ',
    ' X    X ',
    ' XXXXXX ',
    '  X  X  ',
    '  XXXX  ',
  ],
} as const;

export type SpriteKey = keyof typeof SPRITES;

interface PixelSpriteProps {
  name: SpriteKey;
  className?: string;
}

export function PixelSprite({ name, className }: PixelSpriteProps) {
  const grid = SPRITES[name];
  const height = grid.length;
  const width = grid.reduce((max, row) => Math.max(max, row.length), 0);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`pixelated ${className ?? ''}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {grid.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === ' ' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />,
        ),
      )}
    </svg>
  );
}
