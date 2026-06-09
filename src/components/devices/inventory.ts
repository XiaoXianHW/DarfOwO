import type { SpriteKey } from './PixelSprite';

export type DeviceStatus =
  | 'online'
  | 'active'
  | 'sleeping'
  | 'charging'
  | 'syncing'
  | 'standby';

export interface Device {
  name: string;
  type: string;
  sprite: SpriteKey;
  // Flat accent color (no gradients) used for the sprite + tags.
  accent: string;
  specs: string[];
  status: DeviceStatus;
  battery?: number;
  conn?: string;
}

export interface DeviceGroup {
  id: string;
  label: string;
  hint: string;
  devices: Device[];
}

// Statuses that count as "powered / reachable" for the summary line.
export const ONLINE_STATUSES: DeviceStatus[] = ['online', 'active', 'syncing'];

export const STATUS_META: Record<DeviceStatus, { label: string; color: string }> = {
  online: { label: 'ONLINE', color: '#4ade80' },
  active: { label: 'ACTIVE', color: '#4ade80' },
  syncing: { label: 'SYNCING', color: '#22d3ee' },
  charging: { label: 'CHARGING', color: '#fbbf24' },
  sleeping: { label: 'SLEEP', color: '#fb923c' },
  standby: { label: 'STANDBY', color: '#6b7280' },
};

export const GROUPS: DeviceGroup[] = [
  {
    id: 'compute',
    label: 'COMPUTE',
    hint: '计算',
    devices: [
      {
        name: 'Main Desktop PC',
        type: 'Workstation',
        sprite: 'tower',
        accent: '#38bdf8',
        conn: 'Ethernet',
        status: 'online',
        specs: [
          'i9-10900K',
          'RTX 2070 Super',
          '32GB Corsair DDR4 3600MHz',
          'ASUS Z490-P / 750W',
          '3.5TB (970EVO+ / 980Pro / HDD)',
        ],
      },
      {
        name: 'Mac mini M4',
        type: 'Mini PC',
        sprite: 'mini',
        accent: '#c0c6d0',
        status: 'active',
        specs: ['Apple M4', '16GB Unified', '256GB SSD'],
      },
      {
        name: 'Redmi Book 14 Pro 2022',
        type: 'Laptop',
        sprite: 'laptop',
        accent: '#a3a3a3',
        status: 'sleeping',
        battery: 100,
        specs: ['i5-12450H', '16GB DDR5 5200MHz', '512GB SSD'],
      },
    ],
  },
  {
    id: 'mobile',
    label: 'MOBILE',
    hint: '移动',
    devices: [
      {
        name: 'Xiaomi 14 Pro',
        type: 'Phone',
        sprite: 'phone',
        accent: '#fb923c',
        status: 'active',
        specs: ['Snapdragon 8 Gen 3', '16 + 512GB'],
      },
      {
        name: 'iPhone 14 Pro',
        type: 'Phone',
        sprite: 'phone',
        accent: '#d1d5db',
        status: 'active',
        specs: ['A16 Bionic', '6 + 128GB'],
      },
      {
        name: 'Xiaomi Pad 6',
        type: 'Tablet',
        sprite: 'tablet',
        accent: '#818cf8',
        status: 'charging',
        battery: 100,
        specs: ['Snapdragon 870', '8 + 128GB', 'Xiaomi Smart Pen'],
      },
    ],
  },
  {
    id: 'storage',
    label: 'STORAGE',
    hint: '存储',
    devices: [
      {
        name: 'Synology DS918+',
        type: 'NAS Server',
        sprite: 'nas',
        accent: '#34d399',
        status: 'syncing',
        specs: ['4× 4TB Seagate IronWolf', 'RAID 5'],
      },
    ],
  },
  {
    id: 'peripherals',
    label: 'PERIPHERALS',
    hint: '外设',
    devices: [
      {
        name: 'AOC CQ27G2',
        type: 'Monitor',
        sprite: 'monitor',
        accent: '#22d3ee',
        status: 'online',
        specs: ['27" 2K · 144Hz', 'Curved'],
      },
      {
        name: 'Logitech G502',
        type: 'Mouse',
        sprite: 'mouse',
        accent: '#f472b6',
        status: 'online',
        specs: ['Gaming Mouse'],
      },
      {
        name: 'AULA F87',
        type: 'Keyboard',
        sprite: 'keyboard',
        accent: '#fbbf24',
        status: 'online',
        specs: ['Mechanical'],
      },
    ],
  },
  {
    id: 'av',
    label: 'XR · AUDIO · WEAR',
    hint: '影音穿戴',
    devices: [
      {
        name: 'Meta Quest 3',
        type: 'VR Headset',
        sprite: 'vr',
        accent: '#c084fc',
        status: 'standby',
        specs: ['512GB Storage'],
      },
      {
        name: 'Edifier NeoPods Pro',
        type: 'Earbuds',
        sprite: 'earbuds',
        accent: '#e5e7eb',
        status: 'standby',
        battery: 90,
        specs: ['Hi-Res', 'LDAC & LHDC'],
      },
      {
        name: 'Xiaomi Band 10',
        type: 'Wearable',
        sprite: 'watch',
        accent: '#fb7185',
        status: 'active',
        battery: 45,
        specs: ['Mi Fitness'],
      },
    ],
  },
];
