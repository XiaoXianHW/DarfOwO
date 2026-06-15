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
      label: 'DARF.DEV',
      desc: '个人开发站 · 技术博客'
    },
    side2: {
      url: 'https://arcyuan.cn',
      label: 'ARCYUAN.CN',
      desc: '艺术创作 · 作品展示'
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
    subtitle: 'The Logical Realm',
    heading: {
      main: 'Developer',
      accent: '/>'
    },
    description: '以逻辑构建世界 —— 工程实践、开源项目，以及藏在代码里的彩蛋。',
    items: [
      { title: '个人技术栈', desc: 'Languages · Frameworks · Tools', icon: 'Cpu' },
      { title: '维护的项目', desc: 'Open-source & personal builds', icon: 'GitBranch' },
      { title: '或许有彩蛋', desc: 'Hidden surprises, if you look', icon: 'Terminal' }
    ]
  },

  side2: {
    title: 'Sensibility',
    subtitle: 'The Creative Realm',
    heading: {
      main: 'Crafting',
      accent: 'Experiences'
    },
    description: '以感性表达自我 —— 原创角色、艺术作品，以及构成「我」的那些故事。',
    items: [
      { title: '个人OC介绍', desc: 'Original characters & lore', icon: 'Sparkles' },
      { title: '艺术性作品', desc: 'Illustrations & visual works', icon: 'Palette' },
      { title: '性格及个人简介', desc: 'Personality & about me', icon: 'Heart' }
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
  ],

  friends: {
    description: '群除我佬',
    list: [
      {
        name: 'Shuakami',
        description: 'sdjz.wiki',
        link: 'https://sdjz.wiki',
        avatar: 'https://sdjz.wiki/shuakami.jpg'
      },
      {
        name: '量子猫步',
        description: 'shanshui.site',
        link: 'https://shanshui.site/',
        avatar: 'https://static.shanshui.site/logo/avatar.webp'
      },
      {
        name: '幻歆',
        description: 'blog.huanxinbot.com',
        link: 'https://blog.huanxinbot.com/',
        avatar: 'https://q1.qlogo.cn/g?b=qq&nk=3485462167&s=100'
      },
      {
        name: '自孤',
        description: 'zigu.me',
        link: 'https://zigu.me/',
        avatar: 'https://q1.qlogo.cn/g?b=qq&nk=1772270306&s=100'
      },
      {
        name: 'Rainbow SPY',
        description: 'github.com/Rainbow-SPY',
        link: 'https://github.com/Rainbow-SPY',
        avatar: 'https://avatars.githubusercontent.com/u/141826358?v=4'
      }
    ],
    links: [
      { name: 'AxT', url: 'https://www.axtn.net' },
      { name: 'ArcTower', url: 'https://www.axtrk.com' },
      { name: 'DarfDEV', url: 'https://darf.dev' },
      { name: 'DeepArc', url: 'https://arcyuan.cn' },
      { name: 'UApi', url: 'https://uapis.cn' },
      { name: 'Blog', url: 'https://blog.xiaoxian.org' },
      { name: 'ArcLibrary', url: 'https://wiki.darf.dev' }
    ]
  }
};
