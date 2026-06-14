export const config = {
  profile: {
    name: 'XiaoXian',
    displayName: 'XIAOXIAN',
    title: 'XiaoXian - Dual Persona Homepage',
    tagline: {
      main: 'Two Realms, One Soul.',
      sub: 'Choose Your Perspective'
    },
    bio: 'I exist at the intersection of rigorous logic and boundless creativity. Navigating the world through multiple lenses, constantly seeking the underlying patterns that connect disparate ideas.',
    tags: ['INFJ-A', 'Developer', 'Designer']
  },

  avatars: {
    default: 'https://static.xiaoxian.org/DarfOwO.jpg',
    side1: 'https://static.xiaoxian.org/Darf.jpg',
    side2: 'https://static.xiaoxian.org/DeepArc.png'
  },

  links: {
    side1: {
      url: 'https://darf.dev',
      label: 'DARF.DEV'
    },
    side2: {
      url: 'https://arcyuan.cn',
      label: 'ARCYUAN.CN'
    },
    legacy: 'https://v2.xiaoxian.org',
    legacyMobile: 'https://legacy.darf.dev'
  },

  social: [
    { name: 'QQ', url: '#', icon: 'MessageCircle' },
    { name: 'Bilibili', url: '#', icon: 'Tv' },
    { name: 'GitHub', url: '#', icon: 'Github' },
    { name: 'Email', url: '#', icon: 'Mail' },
    { name: 'Telegram', url: '#', icon: 'Send' },
    { name: 'X (Twitter)', url: '#', icon: 'Twitter' },
    { name: 'Discord', url: '#', icon: 'MessageSquare' },
    { name: 'Netease Cloud Music', url: '#', icon: 'Music' }
  ],

  side1: {
    title: 'Rationality',
    items: [
      { title: '个人技术栈', icon: 'Cpu' },
      { title: '维护的项目', icon: 'GitBranch' },
      { title: '技术性博客', icon: 'Terminal' },
      { title: '合作开发者', icon: 'Users' }
    ]
  },

  side2: {
    title: 'Sensibility',
    heading: {
      main: 'Crafting',
      accent: 'Experiences'
    },
    items: [
      { title: '个人OC介绍', icon: 'Sparkles' },
      { title: '艺术性作品', icon: 'Palette' },
      { title: '随笔&生活类博客', icon: 'Coffee' },
      { title: '性格及个人简介', icon: 'Heart' }
    ]
  },

  profileCards: [
    {
      title: '设备 (Devices)',
      subtitle: 'Gear & workspace',
      icon: 'Monitor',
      color: 'slate',
      path: '/devices'
    },
    {
      title: '音乐 (Music)',
      subtitle: 'Playlists & vibes',
      icon: 'Music',
      color: 'purple',
      path: '/music'
    },
    {
      title: '状态 (Status)',
      subtitle: 'Live metrics & current activity',
      icon: 'Activity',
      color: 'green',
      path: '/status'
    },
    {
      title: '朋友 (Friends)',
      subtitle: 'Friends & blogroll',
      icon: 'Users',
      color: 'rose',
      path: '/friends'
    }
  ]
};
