# AI Agent Contact Client

[中文文档](./README.zh-CN.md)

`ai-agent-contact-client` is the desktop-style web workspace of the AI Agent Contact product.

It connects to the `ai-agent-contact` backend and provides login, agent switching, multi-session chat, model settings, knowledge base management, and operational views for internal teams.

## What It Is

This repository is the **web workbench frontend** of the product.

Compared with the app-style frontend, it puts more emphasis on:

- desktop workspace layout
- multi-module navigation
- model and knowledge management
- internal operations and management workflows

## Core Experience

### Login and Authentication

- Login page
- Token persistence
- Authenticated request handling
- Auto logout on expired auth state

### Agent and Session Management

- Fetch available agents
- Switch the current agent
- Create new sessions
- Restore historical sessions
- Maintain multiple chat sessions

### AI Conversation Workspace

- Streaming response rendering
- Markdown reply rendering
- Multi-turn contextual conversation
- Full user / assistant message display
- File attachment input support

### Model Configuration

- Configure different models for different agents
- Save multiple model configurations
- Switch active model settings

### Knowledge Base / RAG Panel

- Show knowledge documents by agent
- Upload knowledge files
- Inspect knowledge status
- Extend agent answers with reference material

## Typical Use Cases

- Build an internal AI customer service workspace
- Let operations, support, product, and admin roles use one web platform
- Switch among multiple customer service agents in one interface
- Configure different models and knowledge sources per agent
- Demonstrate the desktop-side product form of an AI customer service platform

## Who It Is For

- Operations staff managing customer service entry flows and conversations
- Support leads evaluating agent, model, and knowledge-base quality
- Administrators maintaining platform configuration and usage workflow
- Product managers validating product structure and interaction design from a platform view
- Internal teams that need a desktop-style web workspace for pilots or demos

## Why It Is Better Than a Simple Chat Demo

Traditional chat demos usually expose only an input box and a response area. This project is closer to a real operational platform:

- Multiple agents instead of a single bot
- Session management instead of one-off prompts
- Configurable models instead of hard-coded settings
- Knowledge base workflows instead of model-only replies
- Workspace-style product structure instead of a single chat page

## Main Modules

- `HomeView`
- `ChatView`
- `BusinessView`
- `AdminView`
- `ProfileView`
- `MainSidebar`
- `ChatSidebar`
- `ModelConfigDialog`
- `RagPanel`

## Tech Stack

- React 19
- TypeScript
- Vite 7
- Zustand
- Tailwind CSS 4
- react-markdown
- recharts

## Quick Start

### Requirements

- Node.js
- npm
- a running `ai-agent-contact` backend

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## Backend Dependency

This frontend depends on:

- `ai-agent-contact`

By default, `/api` requests are proxied to the backend service in development.

## Recommended Pairing

Use this repository together with:

- [`ai-agent-contact`](https://github.com/BlueBloodFire/agent-contact-server)
- [`ai-agent-contact-app`](https://github.com/BlueBloodFire/agent-contact-app)

## License

Licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for details.
