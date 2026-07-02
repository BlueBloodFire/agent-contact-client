# AI Agent Contact Client

[English](./README.md)

`ai-agent-contact-client` 是 AI Agent Contact 产品的桌面化 Web 工作台前端。

它通过对接 `ai-agent-contact` 后端，提供登录、智能体切换、多会话聊天、模型设置、知识库管理和业务工作台能力，面向内部团队和后台使用场景。

## 项目定位

这个仓库是产品的 **Web 工作台前端**。

相较于 App 风格前端，它更强调：

- 桌面工作台布局
- 多模块导航
- 模型与知识库管理
- 内部运营与后台管理流程

## 核心体验

### 登录与认证

- 登录页
- Token 持久化
- 鉴权请求处理
- 登录过期自动退出

### 智能体与会话管理

- 获取可用智能体
- 切换当前智能体
- 创建新会话
- 恢复历史会话
- 维护多个聊天会话

### AI 对话工作台

- 流式回复展示
- Markdown 回复渲染
- 多轮上下文对话
- 完整的用户 / AI 消息展示
- 支持文件附件输入

### 模型配置

- 为不同智能体配置不同模型
- 保存多套模型配置
- 切换当前启用的模型设置

### 知识库 / RAG 面板

- 按智能体展示知识文档
- 上传知识库文件
- 查看知识状态
- 用资料增强智能体回答能力

## 典型使用场景

- 搭建企业内部 AI 客服工作台
- 让运营、客服、产品、管理员在同一 Web 平台协作
- 在一个界面里切换多个客服智能体
- 按智能体配置不同模型和知识来源
- 演示 AI 客服平台的桌面端产品形态

## 适合谁使用

- 运营人员：管理客服入口和查看对话数据
- 客服主管：评估智能体、模型和知识库效果
- 管理员：维护平台配置和后台使用流程
- 产品经理：从平台视角验证信息架构与交互链路
- 企业内部团队：需要桌面化 Web 工作台做试点或演示

## 相比简单聊天 Demo 的优势

普通聊天 Demo 通常只有输入框和回复区域，本项目更接近真实可运营的平台：

- 支持多智能体，而不是单一 Bot
- 支持会话管理，而不是一次性提问
- 支持模型配置，而不是写死固定模型
- 支持知识库流程，而不是纯模型回答
- 支持工作台式结构，而不是单页聊天界面

## 主要模块

- `HomeView`
- `ChatView`
- `BusinessView`
- `AdminView`
- `ProfileView`
- `MainSidebar`
- `ChatSidebar`
- `ModelConfigDialog`
- `RagPanel`

## 技术栈

- React 19
- TypeScript
- Vite 7
- Zustand
- Tailwind CSS 4
- react-markdown
- recharts

## 快速启动

### 环境要求

- Node.js
- npm
- 已启动的 `ai-agent-contact` 后端

### 安装

```bash
npm install
```

### 开发

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

## 后端依赖

本项目依赖：

- `ai-agent-contact`

开发环境下通常通过 `/api` 代理请求到后端服务。

## 搭配使用

建议配合以下仓库一起使用：

- [`ai-agent-contact`](https://github.com/BlueBloodFire/agent-contact-server)
- [`ai-agent-contact-app`](https://github.com/BlueBloodFire/agent-contact-app)
