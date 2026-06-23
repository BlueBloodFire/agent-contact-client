# build.md — 项目概述 & 构建运行

## 项目概述

ai-agent-contact-client 是智能客服平台的 Web 前端，对接 ai-agent-contact 后端服务。

- React 19 + Vite 7 + TypeScript 5.8
- Tailwind CSS 4（via @tailwindcss/vite）
- Zustand 5（状态管理）
- react-markdown（AI 回复 Markdown 渲染）
- 端口：5174（Vite dev server）

## 依赖安装

```bash
npm install
```

## 开发运行

```bash
npm run dev
# 访问 http://localhost:5174
# 后端代理 /api → http://localhost:8092
```

## 生产构建

```bash
npm run build
# 产物在 dist/
```

## 后端对接

后端地址默认代理至 `http://localhost:8092`（ai-agent-contact 服务）。
修改 `vite.config.ts` 中 proxy.target 调整。
