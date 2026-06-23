# change.md — 进度 & 修改记录（最新在上）

## 2026-06-22 · 全面重设计 — 对齐 CSM Intelligent Dashboard 视觉语言

**变更内容**
- 安装 `lucide-react`、`motion` 依赖
- 重写 `src/index.css`：Inter 字体、CSM `@theme` 色彩 token（`#0052cc`/`#4c3398`/`#36b37e`）、`ai-card-glow`/`ai-spark`/`glass-panel` CSS 类
- 新增 `src/components/MainSidebar.tsx`：w-64 固定侧边栏，品牌标题 + 用户块（头像/用户名/AI徽章）+ 新建对话按钮 + 五路由导航项 + 帮助中心
- 新增 `src/components/ChatSidebar.tsx`（原 Sidebar.tsx 升级）：CSM 配色方案，智能体列表 + 会话列表
- 删除 `src/components/NavBar.tsx`、`Header.tsx`、`Sidebar.tsx`（由 MainSidebar/ChatSidebar 替代）
- 重写 `src/App.tsx`：移除 Header，改用 `MainSidebar + pl-64` 布局
- 重写 `src/views/LoginView.tsx`：左侧品牌渐变面板（`#0052cc → #003d9b`）+ 右侧企业风登录卡片
- 重写 `src/views/ProfileView.tsx`：12列网格，左侧（用户卡片+统计+字段+通知开关）+ 右侧（活动日志时间轴）
- 重写 `src/views/HomeView.tsx`：3个 KPI 统计卡 + AI 高亮卡（`ai-card-glow`）+ 4个快速入口卡片
- 重写 `src/views/BusinessView.tsx`：8个服务卡片（lucide 图标替换 emoji）+ 提示横幅
- 重写 `src/views/AdminView.tsx`：4个统计卡 + 智能体列表（`ai-card-glow`）+ 会话历史列表
- 更新 `src/views/ChatView.tsx`：改用 ChatSidebar，聊天区域白色背景
- 更新 `src/components/ChatWindow.tsx`、`ChatInput.tsx`：颜色对齐 CSM（`#0052cc`/`#e5e7eb`）

**设计语言**：`#f8f9fb` 背景、`#0052cc` 品牌蓝、`#4c3398` AI 紫、Inter 字体、`shadow-2xs` 卡片、`border border-[#e5e7eb]` 边框

## 2026-06-22 · 多页面 + 导航体系

**变更内容**
- 新增 `src/router.ts`：hash 路由（#/home|chat|business|admin|profile），无需 react-router
- 新增 `src/components/NavBar.tsx`：左侧图标导航栏（工作台/AI对话/业务大厅/管理后台）
- 新增 `src/views/HomeView.tsx`：工作台主页（问候 + 统计 + 4 快速入口卡片）
- 新增 `src/views/BusinessView.tsx`：业务办理大厅（8 服务卡片，点击进 AI 对话）
- 新增 `src/views/AdminView.tsx`：服务管理后台（统计 + 智能体列表 + 对话记录）
- 新增 `src/views/ChatView.tsx`：AI 对话页（含 pending message 注入）
- 重写 `src/views/LoginView.tsx`：左右分栏，左侧品牌面板 + 右侧登录表单
- 更新 `src/views/ProfileView.tsx`：移除 onBack prop，改用 navigate('home')
- 更新 `src/components/Header.tsx`：移除 onProfileClick prop，直接 navigate('profile')
- 更新 `src/stores/contactStore.ts`：新增 inputText / setInputText
- 更新 `src/components/ChatInput.tsx`：受控输入，读取 store 中的 inputText
- 更新 `src/App.tsx`：全路由体系，hashchange 监听，NavBar + Header + 视图切换

**路由结构**：`#/home` `#/chat` `#/business` `#/admin` `#/profile`，未登录显示 LoginView

## 2026-06-22 · 移除旧后端静态页 + 部署脚本

**变更内容**
- 删除 `docs/dev-ops/nginx/html/index.html`、`login.html`、`js/config.js`（旧 vanilla JS 静态 UI）
- 更新 `docs/dev-ops/nginx/nginx.conf`：改为服务 React SPA（try_files → /index.html），代理端口 8091 → 8092
- 更新 `docs/dev-ops/docker-compose-app.yml`：服务名/容器名/端口统一改为 8092
- 新增 `deploy.sh`：一键 `npm run build` + 复制 dist 到 nginx/html

**访问方式**：开发时 `npm run dev`（5174）；生产时 `bash deploy.sh` → docker-compose 启动

## 2026-06-22 · 登录页 + 个人中心

**变更内容**
- 新增 `src/stores/authStore.ts`：登录态管理（isLoggedIn / username / userId / login / logout），持久化到 localStorage
- 新增 `src/views/LoginView.tsx`：登录页（用户名+密码，首次自动创建账号）
- 新增 `src/views/ProfileView.tsx`：个人中心（头像、统计、退出登录）
- 更新 `src/components/Header.tsx`：替换用户 ID 编辑为头像按钮，点击进入个人中心
- 更新 `src/stores/contactStore.ts`：移除内部 userId，改为从 authStore 读取
- 更新 `src/App.tsx`：加入登录态判断（未登录 → LoginView；view=profile → ProfileView；默认 → 聊天布局）
- 更新 `function.md`：补充登录/个人中心已有功能条目

**路由方式**：无 react-router，用 `view: 'chat' | 'profile'` state 切换，登录态用 authStore.isLoggedIn 判断

## 2026-06-22 · v1 初版

- Vite + React 19 + Tailwind 4 + Zustand 5 项目骨架
- 完整聊天界面（Sidebar / ChatWindow / ChatMessage / ChatInput）
- 流式对话（chat_stream SSE），逐块追加 AI 回复
- 代理 /api → http://localhost:8092
