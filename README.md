# DarfOwORD

一个现代化的个人博客与作品展示网站，基于 React + Vite + Tailwind CSS 构建。

## ✨ 特性

- 🎨 **现代化设计** - 简洁美观的用户界面
- 🌓 **深色模式** - 支持亮色/深色主题切换
- 📱 **响应式布局** - 完美适配移动端和桌面端
- 🎭 **多种背景效果** - 粒子、渐变等多种背景特效
- 📝 **Markdown 支持** - 使用 Markdown 编写文章
- 🚀 **懒加载** - 文章列表懒加载，提升性能
- 🎯 **SEO 优化** - 每个页面独立的 SEO 配置
- ⚡ **快速构建** - 基于 Vite 的极速开发体验

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3000` 查看网站。

### 构建生产版本

```bash
npm run build
```

构建完成后，`dist` 目录包含所有静态文件。

### 预览生产版本

```bash
npm run preview
```

## 📝 文章管理

### 目录结构

```
docs/
├── 技术/               # 分类目录
│   ├── react.md
│   └── typescript.md
├── 生活/
│   └── travel.md
└── welcome.md         # 根目录文章（分类：未分类）
```

### 添加新文章

1. **在 `docs/` 目录下创建分类目录**（可选）
   ```bash
   mkdir docs/技术
   mkdir docs/生活
   ```

2. **创建 Markdown 文件**
   ```bash
   # 在分类目录下
   docs/技术/react-hooks.md
   
   # 或在根目录
   docs/welcome.md
   ```

3. **添加 frontmatter 元数据**
   ```markdown
   ---
   title: "文章标题"
   excerpt: "文章摘要"
   tags: ["React", "JavaScript"]
   date: "2024-01-01"
   author: "作者名"
   ---

   # 文章内容

   正文内容...
   ```

**分类规则：**
- 文章在子目录中 → 使用目录名作为分类（如 `docs/技术/` → 分类为"技术"）
- 文章在根目录中 → 分类为"未分类"
- **分类完全由目录结构决定**，不受 frontmatter 影响

### 预览模式（自动监听与同步）

```bash
npm run build    # 首次构建
npm run preview  # 启动预览
```

预览模式会自动：
- 启动 Vite 预览服务器（http://localhost:4173）
- 监听根目录 `docs/*.md` 文件变化
- 自动复制到 `dist/docs/` 并更新 manifest.json
- 你只需编辑 `docs/` 里的文章，刷新浏览器即可看到更新

## 🎨 配置

所有配置集中在 `src/config.js` 文件中：

- 网站基本信息
- 主题配置
- 导航菜单
- 个人信息
- 技术栈
- 项目统计
- 联系方式
- 游戏信息

## 📦 部署

### 部署流程

1. **构建**
   ```bash
   npm run build
   ```

2. **上传到服务器**
   - 上传 `dist/` 目录到服务器

3. **服务器上运行预览模式（可选）**
   如果需要在服务器上也能自动更新文章：
   ```bash
   npm install
   npm run preview
   ```

## 📂 项目结构

```
DarfOwORD/
├── docs/                  # Markdown 文章源目录（你编辑这里）
│   ├── 技术/             # 分类目录
│   │   └── *.md
│   ├── 生活/
│   │   └── *.md
│   └── *.md              # 根目录文章
├── public/
│   └── manifest.json     # 自动生成的文章索引（不提交）
├── dist/                 # 构建产物（不提交）
│   ├── manifest.json
│   └── docs/            # 构建时从 docs/ 递归复制
│       ├── 技术/
│       └── *.md
├── scripts/
│   ├── generate-articles-manifest.js  # 构建时生成索引
│   └── docs-watcher-service.js       # 预览时监听并同步
├── src/
│   ├── components/       # 通用组件
│   ├── contexts/         # React Context
│   ├── hooks/           # 自定义 Hooks
│   ├── pages/           # 页面组件
│   ├── styles/          # 全局样式
│   ├── utils/           # 工具函数
│   ├── config.js        # 网站配置
│   ├── App.jsx          # 主应用组件
│   └── main.jsx         # 入口文件
├── DEPLOYMENT.md        # 部署指南
└── package.json

## 🛠️ 技术栈

- **框架**: React 18
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **路由**: React Router
- **动画**: Framer Motion
- **图标**: React Icons
- **Markdown**: react-markdown + remark-gfm
- **代码高亮**: highlight.js
- **SEO**: react-helmet-async

## 📜 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产版本（自动监听文章变化） |
| `npm run generate:manifest` | 手动生成文章索引 |

## 🐛 故障排查

### 文章不显示？

1. 检查 `dist/docs/manifest.json` 是否存在
2. 检查 Markdown 文件的 frontmatter 格式
3. 重新构建：`npm run build`

### 构建失败？

1. 删除 `node_modules` 和 `pnpm-lock.yaml`
2. 重新安装依赖：`pnpm install`
3. 清除 Vite 缓存：删除 `.vite` 目录

## 📄 许可

未经授权禁止盗用。

## 👤 作者

XiaoXian (Darf / 弧渊)

---

如有问题或建议，欢迎提出 Issue！

