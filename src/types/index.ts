export interface AgentConfig {
  agentId: string
  agentName: string
  agentDesc: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  streaming?: boolean
}

export interface ChatSession {
  id: string
  name: string
  agentId: string
  messages: ChatMessage[]
  createdAt: number
}
