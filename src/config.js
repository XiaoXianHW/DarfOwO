export const APP_CONFIG = {
  // 站点信息
  site: {
    title: 'XiaoXian',
    subtitle: 'Darf / 弧渊',
    author: 'XiaoXian',
    description: '欢迎来到我的个人主页👋',
    keywords: ['个人博客', '前端开发', '技术分享', 'AxT社区']
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
      light: '#FEFEFE', // 比背景色稍微浅一些
      dark: '#1A1A1C'   // 比背景色稍微浅一些
    },
    tag: {
      light: '#F1F5F9', // 比背景色稍微深一些
      dark: '#1E1E20'   // 比背景色稍微深一些
    },
    tagSecondary: {
      light: '#E2E8F0', // 游玩过的标签，更深一些
      dark: '#2D2D2F'   // 游玩过的标签，更深一些
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
      value: '@Accky',
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
    currentlyPlaying: ['The Finals', 'Minecraft', 'osu!', 'Phigros'],
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
      title: '置顶文章示例',
      subtitle: '这是一篇置顶的重要文章',
      date: '2024-11-13',
      link: 'https://example.com/pinned-article'
    }
  },

  // 项目配置
  projects: {
    featured: [],
    categories: ['项目', '网站', 'Minecraft', '工具', '其他'],
    list: [
      {
        id: '1',
        title: 'AxT社区',
        intro: '面向创作者与志愿者的公益社区，聚焦资源互助与开源共建。',
        description: '致力于推动公益和开源项目发展的社区，提供各种资源和平台',
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
            caption: 'AxT社区主页'
          },
          {
            type: 'image', 
            url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
            caption: '社区交流'
          }
        ],
        category: '项目',
        technologies: ['公益', '开源', '社区'],
        startedAt: '2018-06',
        achievement: '5000+ 活跃成员',
        features: ['多角色协作', '自动化任务派发', '知识库共建'],
        stats: '5000+用户',
        link: 'https://axtn.net',
        logo: 'https://static.axtn.net/logo/AxT.png',
        subtitle: '面向创作者与志愿者的公益社区'
      },
      {
        id: '2',
        title: 'UApi',
        intro: '聚合常用公开数据，提供统一的 REST API 接入体验。',
        description: '集合了常见公开数据的REST API接口平台',
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
            caption: 'UApi接口文档'
          },
          {
            type: 'video',
            url: 'https://sample-videos.com/zip/10/mp4/mp4-example.mp4',
            caption: 'API使用演示'
          }
        ],
        category: '网站',
        technologies: ['Go', 'Vue', 'REST API'],
        startedAt: '2021-03',
        achievement: '120+ 开放接口',
        features: ['多语言 SDK', '密钥用量监控', '一键沙箱'],
        stats: '开放平台',
        link: ''
      },
      {
        id: '3',
        title: 'EasyLAN',
        intro: '让 Minecraft 局域网分享更自由，随开随用。',
        description: '用于自定义Minecraft LAN局域网配置的Forge Mod',
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80',
            caption: 'Minecraft游戏截图'
          },
          {
            type: 'gif',
            url: 'https://media.giphy.com/media/example-minecraft.gif',
            caption: '功能演示'
          }
        ],
        category: 'Minecraft',
        technologies: ['Java', 'Minecraft', 'Forge Mod'],
        startedAt: '2019-11',
        achievement: '30k+ 下载',
        features: ['端口白名单', '一键广播', '好友直连'],
        stats: '自定义局域网',
        link: ''
      },
      {
        id: '4',
        title: 'AxTBot',
        intro: 'AxT 社区的 QQ 机器人助手，覆盖查询与娱乐插件。',
        description: '基于QQBot的AxT社区官方机器人，提供各种数据查询，娱乐功能服务',
        media: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=80',
            caption: '机器人界面'
          }
        ],
        category: '工具',
        technologies: ['Python', 'QQBot', '信息查询'],
        startedAt: '2017-08',
        achievement: '3000+ 群服务',
        features: ['指令插件系统', '服务状态播报', '社区运营辅助'],
        stats: '3000+群活跃',
        link: ''
      }
    ]
  },

// 朋友链接配置
  friends: {
    description: '一些优秀的朋友们',
    list: [
      {
        id: '1',
        name: 'GitHub',
        alias: 'Git',
        description: '全球最大的开源社区和代码托管平台',
        link: 'https://github.com',
        avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
      },
      {
        id: '2',
        name: 'MDN Web Docs',
        alias: 'MDN',
        description: 'Web 开发者的权威技术文档和学习资源',
        link: 'https://developer.mozilla.org',
        avatar: 'https://developer.mozilla.org/favicon-48x48.png'
      },
      {
        id: '3',
        name: 'React',
        alias: '反应',
        description: '用于构建用户界面的 JavaScript 库',
        link: 'https://react.dev',
        avatar: 'https://react.dev/favicon-32x32.png'
      },
      {
        id: '4',
        name: 'Tailwind CSS',
        description: '实用优先的 CSS 框架',
        link: 'https://tailwindcss.com',
        avatar: 'https://tailwindcss.com/favicons/apple-touch-icon.png'
      },
      {
        id: '5',
        name: 'Vite',
        alias: '闪电',
        description: '下一代前端构建工具',
        link: 'https://vitejs.dev',
        avatar: 'https://vitejs.dev/logo.svg'
      },
      {
        id: '6',
        name: 'TypeScript',
        description: 'JavaScript 的超集，添加了类型系统',
        link: 'https://www.typescriptlang.org'
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
    'https://uapis.cn/static/uploads/016e9b97b4c6f25b5258cebda1c23a74.jpg',
    'https://images.unsplash.com/photo-1517621804845-22d565cecd1f?auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=2070&q=80'
  ]
}
