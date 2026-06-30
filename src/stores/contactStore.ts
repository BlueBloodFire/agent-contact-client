import { create } from 'zustand'
import type { AgentConfig, Attachment, ChatMessage, ChatSession } from '../types'
import * as agentApi from '../api/agentApi'
import { useAuthStore } from './authStore'
import { getActiveConfig } from '../components/ModelConfigDialog'

interface ContactStore {
  agents: AgentConfig[]
  currentAgentId: string | null
  fetchAgents: () => Promise<void>
  setCurrentAgentId: (id: string) => void

  webSearchEnabled: boolean
  setWebSearchEnabled: (v: boolean) => void

  showModelConfigPrompt: boolean
  setShowModelConfigPrompt: (v: boolean) => void

  sessions: Map<string, ChatSession>
  currentSessionId: string | null
  createSession: (agentId: string) => Promise<string>
  setCurrentSession: (id: string | null) => void
  fetchSessions: (agentId: string) => Promise<void>
  restoreSession: (sessionId: string) => Promise<void>

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
  webSearchEnabled: false,
  setWebSearchEnabled: (v) => set({ webSearchEnabled: v }),
  showModelConfigPrompt: false,
  setShowModelConfigPrompt: (v) => set({ showModelConfigPrompt: v }),
  stopStream: () => {
    const { _abortFn, currentSessionId } = get()
    if (_abortFn) { _abortFn(); set({ _abortFn: null }) }
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

  fetchSessions: async (agentId) => {
    const userId = useAuthStore.getState().userId
    try {
      const records = await agentApi.getSessions(userId, agentId)
      set((s) => {
        const sessions = new Map(s.sessions)
        for (const r of records) {
          if (!sessions.has(r.sessionId)) {
            sessions.set(r.sessionId, {
              id: r.sessionId,
              agentId: r.agentId,
              name: r.title || `对话 ${sessions.size + 1}`,
              messages: [],
              createdAt: new Date(r.createdAt).getTime(),
            })
          }
        }
        return { sessions }
      })
    } catch {
      // ignore
    }
  },

  restoreSession: async (sessionId) => {
    const { sessions } = get()
    const session = sessions.get(sessionId)
    if (!session || session.messages.length > 0) {
      set({ currentSessionId: sessionId })
      return
    }
    try {
      const records = await agentApi.getSessionMessages(sessionId)
      set((s) => {
        const updated = new Map(s.sessions)
        const existing = updated.get(sessionId)
        if (existing) {
          const messages: ChatMessage[] = records.map((r, i) => ({
            id: `${sessionId}_${i}`,
            role: r.role as 'user' | 'assistant',
            content: r.content,
            timestamp: new Date(r.createdAt).getTime(),
          }))
          updated.set(sessionId, { ...existing, messages })
        }
        return { sessions: updated, currentSessionId: sessionId }
      })
    } catch {
      set({ currentSessionId: sessionId })
    }
  },

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
    const { currentAgentId, currentSessionId, isLoading, pendingFiles, webSearchEnabled } = get()
    const userId = useAuthStore.getState().userId
    if (!currentAgentId || isLoading || !text.trim()) return

    // 检查是否已配置模型
    const activeCfg = getActiveConfig(currentAgentId)
    if (!activeCfg) {
      set({ showModelConfigPrompt: true })
      return
    }

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
      // update session name from first message if still default
      const sess = get().sessions.get(sessionId!)
      if (sess && sess.name.startsWith('对话 ')) {
        const title = text.length > 20 ? text.substring(0, 20) + '…' : text
        set((s) => {
          const sessions = new Map(s.sessions)
          const existing = sessions.get(sessionId!)
          if (existing) sessions.set(sessionId!, { ...existing, name: title })
          return { sessions }
        })
      }
    }
    const onError = (_err: string) => {
      get().updateMessage(sessionId!, aiMsgId, accumulated || '响应失败，请重试', false)
      set({ isLoading: false })
    }

    let abortFn: (() => void) | null = null
    if (files.length > 0) {
      abortFn = agentApi.chatStreamMultimodal(currentAgentId, userId, sessionId, text, files, onChunk, onDone, onError)
    } else {
      abortFn = agentApi.chatStream(currentAgentId, userId, sessionId, text, onChunk, onDone, onError, webSearchEnabled)
    }
    set({ _abortFn: abortFn })
  },
}))
