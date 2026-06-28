export interface ApiResponse<T = unknown> {
  code: string
  info: string
  data: T | null
}

const DEFAULT_SERVER_URL = 'http://localhost:8092'

let baseUrl: string = localStorage.getItem('contact_server_url') || ''

export function getBaseUrl(): string {
  return baseUrl || DEFAULT_SERVER_URL
}

export function setBaseUrl(url: string): void {
  const trimmed = url.trim().replace(/\/+$/, '')
  baseUrl = import.meta.env.DEV
    ? (!trimmed || trimmed === DEFAULT_SERVER_URL ? '' : trimmed)
    : (trimmed || DEFAULT_SERVER_URL)
  if (trimmed && trimmed !== DEFAULT_SERVER_URL) {
    localStorage.setItem('contact_server_url', trimmed)
  } else {
    localStorage.removeItem('contact_server_url')
  }
}

function handleUnauth() {
  localStorage.removeItem('contact_token')
  localStorage.removeItem('contact_username')
  localStorage.removeItem('contact_user_id')
  localStorage.removeItem('contact_expire_at')
  window.location.reload()
}

const TIMEOUT_MS = 30000

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const url = `${baseUrl}${path}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const headers: Record<string, string> = {}
  if (body) headers['Content-Type'] = 'application/json'
  const token = localStorage.getItem('contact_token')
  if (token) headers['Authorization'] = `Bearer ${token}`
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
    if (res.status === 401) {
      handleUnauth()
      return { code: 'E_UNAUTH', info: '登录已过期，请重新登录', data: null }
    }
    if (!res.ok) return { code: String(res.status), info: res.statusText, data: null }
    return (await res.json()) as ApiResponse<T>
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string }
    if (e?.name === 'AbortError') return { code: 'TIMEOUT', info: '请求超时', data: null }
    return { code: 'NETWORK_ERROR', info: e?.message || '网络错误', data: null }
  } finally {
    clearTimeout(timer)
  }
}

export function get<T>(path: string) {
  return request<T>('GET', path)
}

export function post<T>(path: string, body?: unknown) {
  return request<T>('POST', path, body)
}

export function streamMultipart(
  path: string,
  formData: FormData,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): () => void {
  const controller = new AbortController()
  const url = `${baseUrl}${path}`
  const token = localStorage.getItem('contact_token')
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`

  fetch(url, {
    method: 'POST',
    headers,
    body: formData,
    signal: controller.signal,
  })
    .then(async (res) => {
      if (res.status === 401) { handleUnauth(); return }
      if (!res.ok) { onError(`HTTP ${res.status}`); return }
      const reader = res.body?.getReader()
      if (!reader) { onError('No response body'); return }
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        if (text) {
          if (text.includes('[TIMEOUT]')) {
            onError('响应超时，请稍后重试')
            reader.cancel()
            return
          }
          onChunk(text)
        }
      }
      onDone()
    })
    .catch((err: unknown) => {
      const e = err as { name?: string; message?: string }
      if (e?.name !== 'AbortError') onError(e?.message || '多模态请求失败')
    })

  return () => controller.abort()
}

export function streamPost(
  path: string,
  body: unknown,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): () => void {
  const controller = new AbortController()
  const url = `${baseUrl}${path}`
  const token = localStorage.getItem('contact_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (res.status === 401) { handleUnauth(); return }
      if (!res.ok) {
        onError(`HTTP ${res.status}`)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) {
        onError('No response body')
        return
      }
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        if (text) {
          if (text.includes('[TIMEOUT]')) {
            onError('响应超时，请稍后重试')
            reader.cancel()
            return
          }
          onChunk(text)
        }
      }
      onDone()
    })
    .catch((err: unknown) => {
      const e = err as { name?: string; message?: string }
      if (e?.name !== 'AbortError') onError(e?.message || '流式请求失败')
    })

  return () => controller.abort()
}
