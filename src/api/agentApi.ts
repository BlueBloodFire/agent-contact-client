import { get, post, streamPost, streamMultipart } from './request'
import type { AgentConfig } from '../types'

export async function queryAgentList(): Promise<AgentConfig[]> {
  const res = await get<AgentConfig[]>('/api/v1/query_ai_agent_config_list')
  return res.data ?? []
}

export async function createSession(agentId: string, userId: string): Promise<string | null> {
  const res = await post<{ sessionId: string }>('/api/v1/create_session', { agentId, userId })
  return res.data?.sessionId ?? null
}

export async function getModelConfig(
  agentId: string,
  userId: string,
): Promise<{ baseUrl: string; apiKey: string; model: string } | null> {
  const res = await get<{ baseUrl: string; apiKey: string; model: string }>(
    `/api/v1/model_config?agentId=${encodeURIComponent(agentId)}&userId=${encodeURIComponent(userId)}`,
  )
  return res.data ?? null
}

export async function chat(
  agentId: string,
  userId: string,
  sessionId: string,
  message: string,
): Promise<string> {
  const res = await post<{ content: string }>('/api/v1/chat', { agentId, userId, sessionId, message })
  return res.data?.content ?? ''
}

export function chatStreamMultimodal(
  agentId: string,
  userId: string,
  sessionId: string,
  message: string,
  files: File[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): () => void {
  const formData = new FormData()
  formData.append('agentId', agentId)
  formData.append('userId', userId)
  formData.append('sessionId', sessionId)
  formData.append('message', message)
  files.forEach((f) => formData.append('files', f))
  return streamMultipart('/api/v1/chat_multimodal_stream', formData, onChunk, onDone, onError)
}

export async function uploadRagDocument(agentId: string, file: File): Promise<{ success: boolean; message: string }> {
  const formData = new FormData()
  formData.append('agentId', agentId)
  formData.append('file', file)
  const token = localStorage.getItem('contact_token')
  try {
    const res = await fetch('/api/v1/rag/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
    const json = await res.json()
    return { success: json.code === '0000', message: json.info || '' }
  } catch {
    return { success: false, message: '上传失败' }
  }
}

export async function listRagDocuments(agentId: string): Promise<string[]> {
  const res = await get<string[]>(`/api/v1/rag/documents?agentId=${agentId}`)
  return res.data ?? []
}

export function chatStream(
  agentId: string,
  userId: string,
  sessionId: string,
  message: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): () => void {
  return streamPost(
    '/api/v1/chat_stream',
    { agentId, userId, sessionId, message },
    onChunk,
    onDone,
    onError,
  )
}
