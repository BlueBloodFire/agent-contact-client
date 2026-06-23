# function.md — 已有功能 & 待实现路线图

## 已有功能

### 基础工程（2026-06-22）
- Vite + React 19 + TypeScript 项目骨架
- Tailwind CSS 4 样式系统
- fetch 请求封装（request.ts）：GET/POST/流式请求
- Zustand 状态管理（contactStore）

### UI 功能（2026-06-22）
- 登录页：用户名+密码表单，首次自动注册
- 个人中心：头像、用户名/ID、历史对话数/消息数统计、退出登录
- 顶部栏：平台 Logo + 用户头像（点击进入个人中心）
- 左侧栏：智能体列表 + 会话列表 + 新建对话
- 对话窗口：消息气泡（User/AI）+ Markdown 渲染
- 输入框：多行输入、Enter 发送、Shift+Enter 换行

### API 集成（2026-06-22）
- `GET /api/v1/query_ai_agent_config_list` 查询智能体列表
- `POST /api/v1/create_session` 创建会话
- `POST /api/v1/chat_stream` 流式对话（逐块追加）

## 待实现功能路线图

| # | 功能 | 说明 | 状态 |
|---|------|------|------|
| F1 | 语音输入 | 浏览器 Web Speech API 语音转文字 | 待实现 |
| F2 | 文件上传 | 支持图片/文档附件，对接 multipart 接口 | 待实现 |
| F3 | 会话持久化 | localStorage 缓存历史消息，刷新不丢失 | 待实现 |
| F4 | 消息通知 | WebSocket 接收后端主动推送的通知消息 | 待实现 |
| F5 | 情绪指示 | 检测用户文本情绪，显示转人工提示 | 待实现 |
| F6 | 响应式适配 | 移动端布局优化 | 待实现 |
