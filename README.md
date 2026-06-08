# XiaoXian.org · 双重人格个人主页

晓贤（XiaoXian）的个人主页：一个左右分屏、双重人格风格的单页应用，并附带设备、音乐、健康状态等子页面。健康状态页接入真实的 Mi Fitness（小米运动健康）数据。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | React 19 + TypeScript |
| 构建 | Vite 6 |
| 路由 | React Router v7（`BrowserRouter`） |
| 样式 | Tailwind CSS 4（`@tailwindcss/vite`） |
| 动画 | Motion（`motion/react`） |
| 图表 | Recharts |
| 图标 | lucide-react |

## 页面 / 路由

| 路由 | 组件 | 说明 |
| --- | --- | --- |
| `/` | `App.tsx` | 首页，左右分屏的双重人格交互（含 3D 视差、移动端布局、资料浮层） |
| `/devices` | `pages/DevicesPage.tsx` | 设备生态，Bento 网格卡片展示硬件 |
| `/music` | `pages/MusicPage.tsx` | 音乐页，正在播放 / 歌单 / 最近播放 |
| `/status` | `pages/StatusPage.tsx` | 健康状态，接入真实健康数据，点击卡片查看 7 天历史 |

三个子页面统一采用一致的卡片风格：深色卡片底色 `#1a1a1a`、`rounded-3xl` 圆角、`border-white/5` 描边。

## 目录结构

```
src/
├── main.tsx                 # 入口，定义路由
├── App.tsx                  # 首页
├── index.css                # 全局样式 / Tailwind
├── config.js                # 站点集中配置
├── types/                   # 全局类型
├── pages/                   # 子页面（Devices / Music / Status）
├── components/
│   ├── *.tsx                # 首页相关组件
│   ├── devices/             # 设备页 Bento 卡片
│   └── status/              # 状态页卡片、图表、详情弹窗
├── hooks/                   # useResponsive / useHeartRate / useHealthData
├── services/                # miFitness.ts —— 健康数据 API 客户端
└── utils/                   # animations.ts / format.ts
```

## 健康数据（Mi Fitness / DarfAPI）

状态页的数据来自 [DarfAPI](https://github.com/XiaoXianHW/DarfAPI) 的 `mi-fitness` 接口（经 `https://api.xiaoxian.org` 代理）。该接口**不支持 CORS 且需要 Bearer Token**，因此前端不直接请求上游，而是请求同源路径 `/api/mifitness/*`，由代理在服务端注入密钥后转发，密钥**不会进入前端产物**。

- 开发 / 预览：`vite.config.ts` 内置代理，将 `/api/mifitness/*` → `https://api.xiaoxian.org/api/v1/mi-fitness/*`，并附带 `Authorization` 头。
- 生产部署：需在反向代理（如 Nginx）配置等价规则，把 `/api/mifitness/*` 转发到上游并补上 `Authorization: Bearer <key>`。

涉及的接口：`data/overview`（当日总览）、`data/heart-rate`、`data/steps`、`data/sleep`、`data/calories/history`、`data/spo2/history`、`data/intensity/history`、`data/valid-stand/history`、`data/weight/history`（`?days=7` 取 7 天）。

## 本地运行

前置：Node.js（建议 v22）。

```bash
npm install
cp .env.example .env.local   # 填入下方变量
npm run dev                  # http://localhost:3000
```

`.env.local`（已被 `.gitignore` 忽略，请勿提交）：

```
MIFITNESS_API_KEY=你的密钥        # 由 Vite 代理在服务端注入
MIFITNESS_API_BASE=https://api.xiaoxian.org
VITE_MIFITNESS_UID=2767148408    # 展示数据的家庭成员 uid
```

## 常用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（:3000） |
| `npm run build` | 生产构建到 `dist/` |
| `npm run preview` | 预览构建产物（含代理） |
| `npm run lint` | `tsc --noEmit` 类型检查 |
