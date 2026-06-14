import type { SpriteKey } from './PixelSprite';

export interface Device {
  name: string;
  type: string;
  sprite: SpriteKey;
  // Flat accent color (no gradients) used for the sprite tint.
  accent: string;
  // Full spec sheet, rendered as a bulleted list on the card.
  specs: string[];
}

// Flat inventory, ordered so the primary workstation leads the grid.
export const DEVICES: Device[] = [
  {
    name: 'Main Desktop PC',
    type: 'Workstation',
    sprite: 'tower',
    accent: '#38bdf8',
    specs: [
      'Intel Core i9-10900K · 10C/20T',
      'NVIDIA RTX 2070 Super · 8GB',
      '32GB DDR4 3600MHz',
      'ASUS PRIME Z490-P',
      '750W 80+ 金牌电源',
      '3.5TB SSD + HDD',
    ],
  },
  {
    name: 'Mac mini M4',
    type: 'Mini PC',
    sprite: 'mini',
    accent: '#c0c6d0',
    specs: ['Apple M4 · 10 核 CPU', '10 核 GPU', '16GB 统一内存', '256GB SSD', 'macOS'],
  },
  {
    name: 'Redmi Book 14 Pro',
    type: 'Laptop',
    sprite: 'laptop',
    accent: '#a3a3a3',
    specs: ['Intel Core i5-12450H', '16GB LPDDR5', '512GB SSD', '14 英寸 高分屏', 'Windows 11'],
  },
  {
    name: 'Xiaomi 14 Pro',
    type: 'Phone',
    sprite: 'phone',
    accent: '#fb923c',
    specs: [
      '骁龙 8 Gen 3',
      '16GB + 512GB',
      '6.73" 2K 120Hz',
      '徕卡光学三摄',
      '4880mAh · 120W 快充',
      'Xiaomi HyperOS',
    ],
  },
  {
    name: 'iPhone 14 Pro',
    type: 'Phone',
    sprite: 'phone',
    accent: '#d1d5db',
    specs: ['Apple A16 Bionic', '6GB + 128GB', '6.1" 120Hz 灵动岛', '4800 万像素主摄', 'iOS'],
  },
  {
    name: 'Xiaomi Pad 6',
    type: 'Tablet',
    sprite: 'tablet',
    accent: '#818cf8',
    specs: ['骁龙 870', '8GB + 128GB', '11" 2.8K 144Hz', '配套手写笔', '8840mAh · 33W'],
  },
  {
    name: 'Synology DS918+',
    type: 'NAS',
    sprite: 'nas',
    accent: '#34d399',
    specs: ['Intel Celeron J3455 四核', '4 × 4TB IronWolf', 'RAID 5 · 12TB 可用', 'DSM 7 系统', '双千兆网口'],
  },
  {
    name: 'AOC CQ27G2',
    type: 'Monitor',
    sprite: 'monitor',
    accent: '#22d3ee',
    specs: ['27" 2K · 2560×1440', '144Hz 刷新率', '1500R 曲面', '1ms VA 面板', 'FreeSync'],
  },
  {
    name: 'Logitech G502',
    type: 'Mouse',
    sprite: 'mouse',
    accent: '#f472b6',
    specs: ['HERO 25K 传感器', '11 个可编程按键', '可调配重', '有线连接'],
  },
  {
    name: 'AULA F87',
    type: 'Keyboard',
    sprite: 'keyboard',
    accent: '#fbbf24',
    specs: ['87 键 · 80% 配列', '客制化机械轴', '热插拔轴座', 'Gasket 结构', 'RGB 背光'],
  },
  {
    name: 'Meta Quest 3',
    type: 'VR',
    sprite: 'vr',
    accent: '#c084fc',
    specs: ['骁龙 XR2 Gen 2', '512GB 存储', '4K+ 彩色透视', '混合现实 (MR)', '110° 视场角'],
  },
  {
    name: 'Edifier NeoPods Pro',
    type: 'Earbuds',
    sprite: 'earbuds',
    accent: '#e5e7eb',
    specs: ['Hi-Res 无线认证', 'LDAC · LHDC', '主动降噪 (ANC)', '入耳式', '蓝牙 5.x'],
  },
  {
    name: 'Xiaomi Band 10',
    type: 'Wearable',
    sprite: 'watch',
    accent: '#fb7185',
    specs: ['1.72" AMOLED', '小米运动健康', '心率 · 血氧 · 睡眠', '21 天长续航', '5ATM 防水'],
  },
];
