export interface ApiResponse<T = unknown> {
  code: string
  info: string
  data: T | null
}

const DEFAULT_SERVER_URL = 'http://localhost:8092'

let baseUrl: string = import.meta.env.DEV
  ? ''
  : (localStorage.getItem('contact_server_url') || DEFAULT_SERVER_URL)

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
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
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

export function streamPost(
  path: string,
  body: unknown,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
): () => void {
  const controller = new AbortController()
  const url = `${baseUrl}${path}`

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: controller.signal,
  })
    .then(async (res) => {
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
        if (text) onChunk(text)
      }
      onDone()
    })
    .catch((err: unknown) => {
      const e = err as { name?: string; message?: string }
      if (e?.name !== 'AbortError') onError(e?.message || '流式请求失败')
    })

  return () => controller.abort()
}
