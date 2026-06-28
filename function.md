# function.md — 已有功能 & 待实现路线图

## 已有功能

### 基础工程（2026-06-22）
- Vite + React 19 + TypeScript 项目骨架
- Tailwind CSS 4 样式系统
- fetch 请求封装（request.ts）：GET/POST/流式请求
- Zustand 状态管理（contactStore）

### UI 功能（2026-06-22 / 2026-06-28）
- 登录页：用户名+密码表单，调用后端验证（admin/rootUser/testUser），错误提示
- 认证：token 持久化、8小时过期自动退出、请求自动携带 Authorization header
- 个人中心：头像、用户名/ID、历史对话数/消息数统计、退出登录
- 左侧导航（MainSidebar）：深色背景（#1a1a1a），五路由导航
- 左侧聊天栏（ChatSidebar）：智能体列表 + 每个 agent 旁的模型配置按钮 + 会话列表 + 知识库面板（RagPanel）
- 对话窗口（ChatWindow）：消息列表 max-w-3xl 居中，参考 Claude Desktop 风格
- 消息气泡（ChatMessage）：用户右对齐蓝色气泡、AI 左对齐无背景 Markdown 渲染
- 输入框（ChatInput）：圆角大，图标发送按钮，支持文件附件
- 模型配置对话框（ModelConfigDialog）：可配置 baseUrl/apiKey/model，调用后端动态更新
- 知识库面板（RagPanel）：折叠式，文档列表 + 上传 pdf/txt/md/docx

### API 集成（2026-06-22）
- `GET /api/v1/query_ai_agent_config_list` 查询智能体列表
- `POST /api/v1/create_session` 创建会话
- `POST /api/v1/chat_stream` 流式对话（逐块追加）

## 待实现功能路线图

| # | 功能 | 说明 | 状态 |
|---|------|------|------|
| F1 | 语音输入 | 浏览器 Web Speech API 语音转文字 | 待实现 |
| F2 | 文件上传 | 支持图片/文档附件，对接 multipart 接口 | ✅ 已完成 |
| F3 | 会话持久化 | localStorage 缓存历史消息，刷新不丢失 | 待实现 |
| F4 | 消息通知 | WebSocket 接收后端主动推送的通知消息 | 待实现 |
| F5 | 情绪指示 | 检测用户文本情绪，显示转人工提示 | 待实现 |
| F6 | 响应式适配 | 移动端布局优化 | 待实现 |
| F7 | 认证强化 | 真实后端密码验证，token 过期自动退出 | ✅ 已完成 |
| F8 | 模型配置 | 对话框内配置 baseUrl/apiKey/model | ✅ 已完成 |
| F9 | RAG 知识库 | 上传文档，知识库管理面板 | ✅ 已完成（前端） |
