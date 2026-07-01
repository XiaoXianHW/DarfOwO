# DarfOwO · 个人主页

我的个人主页：一个左右分屏、双重人格风格的单页应用，并附带设备、音乐、健康状态等子页面。健康状态页接入真实的 Mi Fitness（小米运动健康）数据。

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

状态页的数据来自 [DarfAPI](https://github.com/XiaoXianHW/DarfAPI) 的 `mi-fitness` 接口（经 `https://api.xiaoxian.org` 代理）。该接口**不支持 CORS 且需要 Bearer Token**，因此前端不直接请求上游，而是请求同源路径 `/api/mifitness/*`，由代理在服务端注入密钥、`uid` 与 `sessionId` 后转发。密钥、uid、sessionId **都不会进入前端产物，也不会出现在浏览器请求里**。

- 开发 / 预览：`vite.config.ts` 内置代理，将 `/api/mifitness/*` → `https://api.xiaoxian.org/api/v1/mi-fitness/*`，附带 `Authorization` 头并补上 `uid` / `sessionId` 查询参数。
- 生产部署：需在反向代理（如 Nginx）配置等价规则，把 `/api/mifitness/*` 转发到上游，补上 `Authorization: Bearer <key>` 以及 `uid` / `sessionId`。

涉及的接口：`data/overview`（当日总览）、`data/heart-rate`、`data/steps`、`data/sleep`、`data/calories/history`、`data/spo2/history`、`data/intensity/history`、`data/valid-stand/history`（`?days=30` 取近 30 天）、`data/weight/history`（`?days=180` 取近半年，体重测量较稀疏）。

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
MIFITNESS_UID=xxx         # 展示数据的家庭成员 uid（服务端注入）
MIFITNESS_SESSION_ID=xxx  # 可选，小米登录会话 ID（服务端注入）
```

## 常用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（:3000） |
| `npm run build` | 生产构建到 `dist/` |
| `npm run preview` | 预览构建产物（含代理） |
| `npm run lint` | `tsc --noEmit` 类型检查 |
