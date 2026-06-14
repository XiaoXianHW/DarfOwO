import type { SpriteKey } from './PixelSprite';

export interface SpecDetail {
  label: string;
  value: string;
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
      { label: 'CPU', value: 'Intel Core i9-10900K · 10C/20T · 5.3GHz' },
      { label: 'GPU', value: 'NVIDIA RTX 2070 Super · 8GB GDDR6' },
      { label: 'RAM', value: '32GB DDR4 · 3600MHz 双通道' },
      { label: 'Board', value: 'ASUS PRIME Z490-P' },
      { label: 'Storage', value: '512GB NVMe SSD + 3TB HDD' },
      { label: 'Power', value: '750W · 80 PLUS 金牌' },
      { label: 'Cooling', value: '360mm 一体式水冷' },
      { label: 'System', value: 'Windows 11 Pro' },
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
    name: 'AOC CQ27G2',
    type: 'Monitor',
    sprite: 'monitor',
    accent: '#22d3ee',
    specs: ['27" 2K', '144Hz Curved'],
  },
  {
    name: 'Logitech G502',
    type: 'Mouse',
    sprite: 'mouse',
    accent: '#f472b6',
    specs: ['HERO Sensor'],
  },
  {
    name: 'AULA F87',
    type: 'Keyboard',
    sprite: 'keyboard',
    accent: '#fbbf24',
    specs: ['Mechanical'],
  },
  {
    name: 'Meta Quest 3',
    type: 'VR',
    sprite: 'vr',
    accent: '#c084fc',
    specs: ['512GB'],
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
