# framework.md — 目录结构 & 组件说明

## 目录结构

```
ai-agent-contact-client/
├── src/
│   ├── api/
│   │   ├── request.ts       ← fetch 封装，含流式请求 streamPost
│   │   └── agentApi.ts      ← queryAgentList / createSession / chat / chatStream
│   ├── stores/
│   │   └── contactStore.ts  ← Zustand store，管理 userId/agents/sessions/messages
│   ├── types/
│   │   └── index.ts         ← AgentConfig / ChatMessage / ChatSession 类型定义
│   ├── components/
│   │   ├── Header.tsx       ← 顶部标题栏，userId 显示与修改
│   │   ├── Sidebar.tsx      ← 左侧：智能体选择 + 会话列表
│   │   ├── ChatWindow.tsx   ← 中间：消息列表
│   │   ├── ChatMessage.tsx  ← 单条消息气泡（User/AI，Markdown 渲染）
│   │   └── ChatInput.tsx    ← 底部：输入框 + 发送按钮
│   ├── App.tsx              ← 主布局（Header + Sidebar + ChatWindow + ChatInput）
│   └── index.css            ← Tailwind + 自定义工具类
```

## 数据流

1. App 启动 → `fetchAgents()` 拉取智能体列表
2. 用户选择智能体 → `setCurrentAgentId()`
3. 用户点击"开始对话"或首次发送 → `createSession(agentId)` → 服务端创建 session
4. 用户发送消息 → `sendMessage(text)` → 调用 `chatStream` 流式接口 → 逐块更新 AI 消息
