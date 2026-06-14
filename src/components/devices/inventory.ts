import type { SpriteKey } from './PixelSprite';

export interface SpecDetail {
  label: string;
  value: string;
}

export interface Peripheral {
  name: string;
  type: string;
  spec: string;
  sprite: SpriteKey;
  accent: string;
}

export interface Device {
  name: string;
  type: string;
  sprite: SpriteKey;
  // Flat accent color (no gradients) used for the sprite tint.
  accent: string;
  specs: string[];
  // Optional full, labeled spec sheet — used by the hero tile to fill its
  // larger footprint. Falls back to `specs` when absent.
  details?: SpecDetail[];
  // Optional storage breakdown rendered as its own block on the hero tile.
  storage?: string[];
  // Attached peripherals (monitor / keyboard / mouse) shown as a sub-section.
  peripherals?: Peripheral[];
}

// Flat inventory, ordered so the primary workstation leads the grid.
export const DEVICES: Device[] = [
  {
    name: 'Main Desktop PC',
    type: 'Workstation',
    sprite: 'tower',
    accent: '#38bdf8',
    specs: [
      'i9-10900K',
      'RTX 2070 Super',
      '32GB DDR4 3600MHz',
      'ASUS Z490-P · 750W',
      '3.5TB SSD + HDD',
    ],
    details: [
      { label: 'CPU', value: 'Intel Core i9-10900K' },
      { label: 'GPU', value: 'NVIDIA RTX 2070 Super' },
      { label: 'RAM', value: '32GB DDR4 3600MHz · 16GB×2' },
      { label: 'Board', value: 'ASUS PRIME Z490-PLUS' },
      { label: 'Power', value: 'Great Wall 750W Full-Modular' },
      { label: 'System', value: 'Windows 11 Pro Workstation' },
    ],
    storage: [
      'Samsung 970 EVO Plus 512GB · System',
      'Samsung 980 Pro 1TB · Games',
      'Seagate HDD 7200 2TB · Data',
    ],
    peripherals: [
      { name: 'AOC CQ27G2', type: 'Monitor', spec: '27" 2K · 144Hz Curved', sprite: 'monitor', accent: '#22d3ee' },
      { name: 'AULA F87', type: 'Keyboard', spec: '87-Key Mechanical', sprite: 'keyboard', accent: '#fbbf24' },
      { name: 'Logitech G502', type: 'Mouse', spec: 'HERO 25K Sensor', sprite: 'mouse', accent: '#f472b6' },
    ],
  },
  {
    name: 'Mac mini M4',
    type: 'Mini PC',
    sprite: 'mini',
    accent: '#c0c6d0',
    specs: ['Apple M4', '16GB', '256GB SSD'],
  },
  {
    name: 'Redmi Book 14 Pro',
    type: 'Laptop',
    sprite: 'laptop',
    accent: '#a3a3a3',
    specs: ['i5-12450H', '16GB DDR5', '512GB SSD'],
  },
  {
    name: 'Xiaomi 14 Pro',
    type: 'Phone',
    sprite: 'phone',
    accent: '#fb923c',
    specs: ['Snapdragon 8 Gen 3', '16 + 512GB'],
  },
  {
    name: 'iPhone 14 Pro',
    type: 'Phone',
    sprite: 'phone',
    accent: '#d1d5db',
    specs: ['A16 Bionic', '6 + 128GB'],
  },
  {
    name: 'Xiaomi Pad 6',
    type: 'Tablet',
    sprite: 'tablet',
    accent: '#818cf8',
    specs: ['Snapdragon 870', '8 + 128GB', 'Smart Pen'],
  },
  {
    name: 'Synology DS918+',
    type: 'NAS',
    sprite: 'nas',
    accent: '#34d399',
    specs: ['4× 4TB IronWolf', 'RAID 5'],
  },
  {
    name: 'Meta Quest 3',
    type: 'VR',
    sprite: 'vr',
    accent: '#c084fc',
    specs: ['Snapdragon XR2 Gen 2', '8 + 512GB'],
  },
  {
    name: 'Edifier NeoPods Pro',
    type: 'Earbuds',
    sprite: 'earbuds',
    accent: '#e5e7eb',
    specs: ['Hi-Res', 'LDAC · LHDC'],
  },
  {
    name: 'Xiaomi Band 10',
    type: 'Wearable',
    sprite: 'watch',
    accent: '#fb7185',
    specs: ['Mi Fitness'],
  },
];
