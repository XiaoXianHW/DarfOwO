export const APP_CONFIG = {
  // 站点信息
  site: {
    title: 'XiaoXian',
    subtitle: 'Darf / 弧渊',
    author: 'XiaoXian',
    description: '欢迎来到我的个人主页👋',
    keywords: ['个人博客', '前端开发', '技术分享', 'AxT社区', 'Darf主页', 'XiaoXianHW', 'ArcTower']
  },

  // 主题配置
  theme: {
    primaryColor: {
      light: '#5B89D2',
      dark: '#5B89D2'
    },
    accentColor: {
      light: '#80B4EE',
      dark: '#80B4EE'
    },
    backgroundColor: {
      light: '#F8FAFC',
      dark: '#0F0F10'
    }
  },

  // UI组件颜色配置
  uiColors: {
    card: {
      light: '#FEFEFE',
      dark: '#1A1A1C'
    },
    tag: {
      light: '#F1F5F9',
      dark: '#1E1E20'
    },
    tagSecondary: {
      light: '#E2E8F0',
      dark: '#2D2D2F'
    }
  },

  // 导航菜单
  navigation: [
    { name: '主页', path: '/' },
    { name: '文章', path: '/articles' },
    { name: '作品', path: '/projects' },
    { name: '朋友', path: '/friends' }
  ],

  // 主页配置
  home: {
    hello: "Hi, I'm",
    name: 'XiaoXian',
    title: 'You can also call me Darf, or 弧渊',
    subtitle: '欢迎来到我的个人主页👋',
    avatar: 'https://static.axtn.net/img/Darf.jpg'
  },

  // 个人信息配置
  aboutInfo: {
    name: 'XiaoXian',
    aliases: ['Darf', '弧渊'],
    description: 'Age 18 / Developer / INFJ / Furry',
    workTags: [
      { name: 'AxT', link: 'https://www.axtn.net' },
      { name: 'ArcTower', link: 'https://www.axtrk.com' }
    ],
    bio: '试图在理性与情感之间找到平衡。\n喜欢用代码、文字或画笔，将那些无法言说的思绪具象化，\n在创造的秩序与美感中，寻得片刻的宁静。\n人与世界，本应以理解相遇，而非以标签相隔。'
  },

  // 技术栈配置
  techStacks: {
    '语言': ['Java', 'Python', 'JavaScript', 'PHP'],
    '前端开发': [
      ['Vue', 'React'],
      ['Vite', 'Next.js'],
      ['Tailwind CSS', 'Bootstrap', 'Vuetify', 'Electron']
    ],
    '后端开发': [
      ['Node.js', 'SpringBoot', 'Flask API'],
      ['MySQL', 'Redis', 'RabbitMQ']
    ],
    '工具 & 平台': ['VS Code', 'IntelliJ IDEA', 'Linux', 'Git', 'Docker', 'Nginx']
  },

  // 项目统计数据
  projectStats: [
    { label: '下载量', value: '513k+' },
    { label: '用户量', value: '10w+' },
    { label: '贡献量', value: '5,192' },
    { label: '请求量', value: '2,548w+' }
  ],

  // 社交平台配置
  contacts: [
    {
      name: 'QQ',
      value: '1680839 / 2860488343',
      link: 'tencent://message/?uin=1680839',
      icon: 'FaQq'
    },
    {
      name: 'Email',
      value: 'xiaoxian@axtn.net',
      link: 'mailto:xiaoxian@axtn.net',
      icon: 'HiMail'
    },
    {
      name: '网易云音乐',
      value: '@XiaoXianHW',
      link: 'https://music.163.com/#/user/home?id=485765737',
      icon: 'RiNeteaseCloudMusicLine'
    },
    {
      name: 'BiliBili',
      value: '@XiaoXianHW',
      link: 'https://space.bilibili.com/414947108',
      icon: 'SiBilibili'
    },
    {
      name: 'Discord',
      value: '@xiaoxianhw',
      link: 'https://discord.com/users/xiaoxianhw',
      icon: 'FaDiscord'
    },
    {
      name: 'Telegram',
      value: '@ArcOwO',
      link: 'https://t.me/ArcOwO',
      icon: 'FaTelegram'
    },
    {
      name: 'X (Twitter)',
      value: '@ArcDarf',
      link: 'https://x.com/ArcDarf',
      icon: 'FaXTwitter'
    },
    {
      name: 'GitHub',
      value: '@XiaoXianHW',
      link: 'https://github.com/XiaoXianHW',
      icon: 'FaGithub'
    }
  ],

  // 游戏配置
  games: {
    currentlyPlaying: ['The Finals', 'Palworld', 'Minecraft', 'osu!', 'Phigros'],
    previouslyPlayed: [
      'CS GO', 'Cyberpunk 2077',
      'Adofai', 'Muse Dash',
      'Forza Horizon 4/5', 'GTA 5', 'PUBG', 'RDR 2', 
      'Raft', 'Human: Fall Flat', 'Cities: Skylines', 'Portal /2',
      'Teardown', 'Detroit: Become Human', 'Left 4 Dead 2',
      'Minecraft Dungeons', 'Garry\'s Mod', 'Cult Of The Lamb'
    ]
  },

  // 文章配置
  articles: {
    pageSize: 10,
    showCategories: true,
    showTags: true,
    pinnedArticle: {
      title: '本博客简要',
      subtitle: '简要说明本博客实现的功能和技术栈',
      date: '2025-12-01',
      link: '/articles/DarfOwO-README'
    }
  },

  // 项目配置
  projects: {
    // 特色项目 - 显示在标题右侧
    featured: {
      title: 'AxT社区',
      subtitle: '面向创作者与志愿者的公益社区',
      link: 'https://www.axtn.net'
    },
    categories: ['项目', '网站', 'Minecraft', '工具', '其他'],
    list: [
      {
        title: 'AxT社区官网',
        intro: 'AxT Community 官方站点',
        media: [
          {
            type: 'image',
            url: 'img/axt-web.png'
          }
        ],
        category: '网站',
        technologies: ['公益', '开源', '社区'],
        startedAt: '2022-10-15',
        link: 'https://www.axtn.net'
      },
      {
        title: 'UApi',
        intro: '聚合常用公开数据，提供免费/稳定/快速的 REST API 接入体验。',
        media: [
          {
            type: 'image',
            url: 'img/uapi-web.png'
          }
        ],
        category: '项目',
        technologies: ['Go', 'React', 'REST API'],
        startedAt: '2023-05-23',
        link: 'https://uapis.cn'
      },
      {
        title: 'EasyLAN',
        intro: '让 Minecraft 局域网分享更自由，随开随用。',
        media: [
          {
            type: 'image',
            url: 'img/easylan.png'
          }
        ],
        category: 'Minecraft',
        technologies: ['Java', 'Minecraft', 'Forge Mod'],
        startedAt: '2023-07-08',
        link: 'https://github.com/XiaoXianHW/EasyLAN'
      },
      {
        title: '弧塔科技官网',
        intro: 'ArcTower Studio 官方站点',
        media: [
          {
            type: 'image',
            url: 'img/axtrk-web.png'
          }
        ],
        category: '网站',
        technologies: ['公益', '开源', '社区'],
        startedAt: '2025-06-19',
        link: 'https://www.axtrk.com'
      },
      {
        title: 'KeyViewer',
        intro: '一款简洁、实时的键盘输入可视化工具',
        media: [
          {
            type: 'image',
            url: 'img/keyviewer.png'
          }
        ],
        category: '工具',
        technologies: ['公益', '开源', '社区'],
        startedAt: '2025-09-12',
        link: 'https://github.com/XiaoXianHW/KeyViewer'
      }
    ]
  },

// 朋友链接配置
  friends: {
    description: '群除我佬',
    list: [
      {
        name: 'Shuakami',
        alias: '',
        description: 'sdjz.wiki',
        link: 'https://sdjz.wiki',
        avatar: 'https://sdjz.wiki/shuakami.jpg'
      }
    ]
  },

  // 动画配置
  animations: {
    pageTransition: {
      duration: 300,
      easing: 'ease-in-out'
    },
    particlesEnabled: false,
    backgroundEffectsEnabled: true
  },

  // 背景图片配置
  backgroundImages: [
    'https://uapis.cn/static/uploads/016e9b97b4c6f25b5258cebda1c23a74.jpg'
  ]
}
