import { create } from 'zustand'
import type { AgentConfig, Attachment, ChatMessage, ChatSession } from '../types'
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

  pendingFiles: File[]
  setPendingFiles: (files: File[]) => void

  addMessage: (sessionId: string, msg: ChatMessage) => void
  updateMessage: (sessionId: string, msgId: string, content: string, streaming?: boolean) => void

  sendMessage: (text: string) => Promise<void>
  stopStream: () => void
  _abortFn: (() => void) | null
}

export const useContactStore = create<ContactStore>((set, get) => ({
  agents: [],
  currentAgentId: null,
  _abortFn: null,
  stopStream: () => {
    const { _abortFn, currentSessionId } = get()
    if (_abortFn) { _abortFn(); set({ _abortFn: null }) }
    // 找到正在流式的消息，标记为已完成
    if (currentSessionId) {
      set((s) => {
        const sessions = new Map(s.sessions)
        const session = sessions.get(currentSessionId)
        if (session) {
          const messages = session.messages.map((m) =>
            m.streaming ? { ...m, streaming: false } : m
          )
          sessions.set(currentSessionId, { ...session, messages })
        }
        return { sessions, isLoading: false }
      })
    }
  },

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

  pendingFiles: [],
  setPendingFiles: (files) => set({ pendingFiles: files }),

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
    const { currentAgentId, currentSessionId, isLoading, pendingFiles } = get()
    const userId = useAuthStore.getState().userId
    if (!currentAgentId || isLoading || !text.trim()) return

    const files = [...pendingFiles]
    set({ pendingFiles: [] })

    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = await get().createSession(currentAgentId)
    }

    const attachments: Attachment[] = files.map((f) => ({
      name: f.name,
      mimeType: f.type,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }))

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined,
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
    const onChunk = (chunk: string) => {
      accumulated += chunk
      get().updateMessage(sessionId!, aiMsgId, accumulated, true)
    }
    const onDone = () => {
      get().updateMessage(sessionId!, aiMsgId, accumulated, false)
      set({ isLoading: false })
    }
    const onError = (_err: string) => {
      get().updateMessage(sessionId!, aiMsgId, accumulated || '响应失败，请重试', false)
      set({ isLoading: false })
    }

    let abortFn: (() => void) | null = null
    if (files.length > 0) {
      abortFn = agentApi.chatStreamMultimodal(currentAgentId, userId, sessionId, text, files, onChunk, onDone, onError)
    } else {
      abortFn = agentApi.chatStream(currentAgentId, userId, sessionId, text, onChunk, onDone, onError)
    }
    set({ _abortFn: abortFn })
  },
}))
