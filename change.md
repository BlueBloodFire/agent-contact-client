# change.md — 进度 & 修改记录（最新在上）

## 2026-06-28 · 模型配置入口优化

- `views/AdminView.tsx`：管理后台每个智能体卡片增加"模型配置"按钮，点击打开 ModelConfigDialog
- `components/ChatSidebar.tsx`：齿轮图标加大（w-3.5）并加背景 hover 效果，更易发现

---

## 2026-06-28 · 认证强化 + 模型配置对话框 + RAG面板 + 样式优化

**变更内容**

认证：
- `stores/authStore.ts`：login 改为真实调用 `/api/v1/login`，存储 token + expireAt；新增 checkExpiry（过期自动退出）
- `api/request.ts`：所有请求自动带 `Authorization: Bearer {token}` header；收到 401 自动清除 token 并刷新页面
- `views/LoginView.tsx`：handleLogin 改为 async，真实密码验证；底部提示改为"请联系管理员获取账号"
- `App.tsx`：新增每分钟定期检查 token 是否过期的 effect

模型配置：
- `types/index.ts`：新增 `ModelConfig` 类型
- `components/ModelConfigDialog.tsx`（新增）：模态对话框，支持配置 baseUrl/apiKey/model，调用 `/api/v1/update_model_config`
- `components/ChatSidebar.tsx`：每个智能体旁新增齿轮按钮，点击打开 ModelConfigDialog

RAG 知识库：
- `api/agentApi.ts`：新增 `uploadRagDocument` / `listRagDocuments` API
- `components/RagPanel.tsx`（新增）：折叠式知识库面板，展示文档列表，支持上传 pdf/txt/md/docx
- `components/ChatSidebar.tsx`：底部集成 RagPanel

样式优化（参考 Claude Desktop 风格）：
- `components/MainSidebar.tsx`：侧边栏改为深色（`#1a1a1a`），白色文字，更清晰的导航项
- `components/ChatWindow.tsx`：消息列表加 `max-w-3xl mx-auto` 居中，背景改为 `#fafafa`
- `components/ChatMessage.tsx`：用户消息右对齐蓝色气泡 + AI 消息左对齐无背景，间距优化
- `components/ChatInput.tsx`：输入框改为圆角大（rounded-2xl），发送按钮改为图标，底部居中对齐

## 2026-06-24 · 多模态上传 + 联网搜索（Bing）

**变更内容**

前端：
- `types/index.ts`：新增 `Attachment` 类型，`ChatMessage` 加 `attachments?` 字段
- `api/request.ts`：新增 `streamMultipart`（FormData 流式请求）
- `api/agentApi.ts`：新增 `chatStreamMultimodal`（multipart/form-data 发送文件+消息）
- `stores/contactStore.ts`：新增 `pendingFiles / setPendingFiles`；`sendMessage` 自动路由到多模态或普通 stream
- `components/ChatInput.tsx`：回形针按钮 + 文件选择（图片/PDF，最多5个）+ 预览 chip，可删除
- `components/ChatMessage.tsx`：用户气泡渲染图片缩略图和文件名 chip

后端：
- 新增 `AiTool` 接口 + `BingSearchTool`（Bing Web Search API，env: `BING_SEARCH_API_KEY`）
- `AiAgentConfigTableVO.Module.Agent` 加 `toolNameList` 字段
- `AgentNode`：装配阶段按 `toolNameList` 从 Spring 容器查 `AiTool` bean，注入到 `LlmAgent`
- `IChatService` / `ChatService`：新增 `handleMessageStream(ChatCommandEntity)` 流式多模态方法
- `AgentServiceController`：新增 `POST /api/v1/chat_multimodal_stream`（multipart）
- `contact-web-agent.yml` / `contact-app-agent.yml`：agent 注册 `bingSearchTool`，instruction 加联网搜索说明
- `application-dev.yml`：新增 `bing.search.api-key: ${BING_SEARCH_API_KEY:}`

**使用前提**
- 设置环境变量 `BING_SEARCH_API_KEY=<你的 Bing Search v7 API Key>` 后启动后端，联网搜索功能生效
- 不设置时搜索工具返回提示"未配置API Key"，其他功能正常

## 2026-06-23 · 修复 dev 端口占用

**变更内容**
- `vite.config.ts`：`strictPort` 由 `true` 改为 `false`，5174 被占用时自动尝试下一端口（如 5175）

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
