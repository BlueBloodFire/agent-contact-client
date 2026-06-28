export interface AgentConfig {
  agentId: string
  agentName: string
  agentDesc: string
}

export interface Attachment {
  name: string
  mimeType: string
  previewUrl?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  streaming?: boolean
  attachments?: Attachment[]
}

export interface ChatSession {
  id: string
  name: string
  agentId: string
  messages: ChatMessage[]
  createdAt: number
}

export interface ModelConfig {
  agentId: string
  baseUrl: string
  apiKey: string
  model: string
}
