import { create } from 'zustand'
import { post } from '../api/request'

interface AuthStore {
  isLoggedIn: boolean
  username: string
  userId: string
  token: string
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkExpiry: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggedIn: (() => {
    const token = localStorage.getItem('contact_token')
    const expireAt = Number(localStorage.getItem('contact_expire_at') || '0')
    if (!token || Date.now() > expireAt) {
      localStorage.removeItem('contact_token')
      localStorage.removeItem('contact_username')
      localStorage.removeItem('contact_user_id')
      localStorage.removeItem('contact_expire_at')
      return false
    }
    return true
  })(),
  username: localStorage.getItem('contact_username') || '',
  userId: localStorage.getItem('contact_user_id') || '',
  token: localStorage.getItem('contact_token') || '',

  login: async (username, password) => {
    try {
      const res = await post<{ token: string; username: string; expireAt: number }>(
        '/api/v1/login',
        { username, password },
      )
      if (res.code !== '0000') {
        return { success: false, error: res.info || '登录失败' }
      }
      const { token, expireAt } = res.data!
      const userId = `user_${username}`
      localStorage.setItem('contact_token', token)
      localStorage.setItem('contact_username', username)
      localStorage.setItem('contact_user_id', userId)
      localStorage.setItem('contact_expire_at', String(expireAt))
      set({ isLoggedIn: true, username, userId, token })
      return { success: true }
    } catch {
      return { success: false, error: '网络错误，请重试' }
    }
  },

  logout: async () => {
    const token = get().token
    try {
      await fetch('/api/v1/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {}
    localStorage.removeItem('contact_token')
    localStorage.removeItem('contact_username')
    localStorage.removeItem('contact_user_id')
    localStorage.removeItem('contact_expire_at')
    set({ isLoggedIn: false, username: '', userId: '', token: '' })
  },

  checkExpiry: () => {
    const expireAt = Number(localStorage.getItem('contact_expire_at') || '0')
    if (expireAt && Date.now() > expireAt) {
      get().logout()
      return false
    }
    return true
  },
}))
