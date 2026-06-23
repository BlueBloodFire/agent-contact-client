import { create } from 'zustand'
import type { AgentConfig, ChatMessage, ChatSession } from '../types'
import * as agentApi from '../api/agentApi'
import { useAuthStore } from './authStore'

interface ContactStore {
  agents: AgentConfig[]
  currentAgentId: string | null
  fetchAgents: () => Promise<void>
  setCurrentAgentId: (id: string) => void

  sessions: Map<string, ChatSession>
  currentSessionId: string | null
  createSession: (agentId: string) => Promise<string>
  setCurrentSession: (id: string | null) => void

  isLoading: boolean
  setLoading: (v: boolean) => void

  inputText: string
  setInputText: (text: string) => void

  addMessage: (sessionId: string, msg: ChatMessage) => void
  updateMessage: (sessionId: string, msgId: string, content: string, streaming?: boolean) => void

  sendMessage: (text: string) => Promise<void>
}

export const useContactStore = create<ContactStore>((set, get) => ({
  agents: [],
  currentAgentId: null,

  fetchAgents: async () => {
    const list = await agentApi.queryAgentList()
    set({ agents: list })
    if (list.length > 0 && !get().currentAgentId) {
      set({ currentAgentId: list[0].agentId })
    }
  },

  setCurrentAgentId: (id) => set({ currentAgentId: id }),

  sessions: new Map(),
  currentSessionId: null,

  createSession: async (agentId) => {
    const userId = useAuthStore.getState().userId
    const sessionId = await agentApi.createSession(agentId, userId)
    if (!sessionId) throw new Error('创建会话失败')
    const newSession: ChatSession = {
      id: sessionId,
      agentId,
      name: `对话 ${get().sessions.size + 1}`,
      messages: [],
      createdAt: Date.now(),
    }
    set((s) => {
      const sessions = new Map(s.sessions)
      sessions.set(sessionId, newSession)
      return { sessions, currentSessionId: sessionId }
    })
    return sessionId
  },

  setCurrentSession: (id) => set({ currentSessionId: id }),

  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),

  inputText: '',
  setInputText: (text) => set({ inputText: text }),

  addMessage: (sessionId, msg) =>
    set((s) => {
      const sessions = new Map(s.sessions)
      const session = sessions.get(sessionId)
      if (session) sessions.set(sessionId, { ...session, messages: [...session.messages, msg] })
      return { sessions }
    }),

  updateMessage: (sessionId, msgId, content, streaming) =>
    set((s) => {
      const sessions = new Map(s.sessions)
      const session = sessions.get(sessionId)
      if (session) {
        const messages = session.messages.map((m) =>
          m.id === msgId ? { ...m, content, streaming: streaming ?? false } : m,
        )
        sessions.set(sessionId, { ...session, messages })
      }
      return { sessions }
    }),

  sendMessage: async (text) => {
    const { currentAgentId, currentSessionId, isLoading } = get()
    const userId = useAuthStore.getState().userId
    if (!currentAgentId || isLoading || !text.trim()) return

    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = await get().createSession(currentAgentId)
    }

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    get().addMessage(sessionId, userMsg)
    set({ isLoading: true })

    const aiMsgId = `msg_${Date.now()}_ai`
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    }
    get().addMessage(sessionId, aiMsg)

    let accumulated = ''
    agentApi.chatStream(
      currentAgentId,
      userId,
      sessionId,
      text,
      (chunk) => {
        accumulated += chunk
        get().updateMessage(sessionId!, aiMsgId, accumulated, true)
      },
      () => {
        get().updateMessage(sessionId!, aiMsgId, accumulated, false)
        set({ isLoading: false })
      },
      (_err) => {
        get().updateMessage(sessionId!, aiMsgId, accumulated || '响应失败，请重试', false)
        set({ isLoading: false })
      },
    )
  },
}))
