import { create } from 'zustand'

interface AuthStore {
  isLoggedIn: boolean
  username: string
  userId: string
  login: (username: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: !!localStorage.getItem('contact_logged_in'),
  username: localStorage.getItem('contact_username') || '',
  userId: localStorage.getItem('contact_user_id') || '',

  login: (username) => {
    const userId = `user_${username}_${Date.now()}`
    localStorage.setItem('contact_logged_in', '1')
    localStorage.setItem('contact_username', username)
    localStorage.setItem('contact_user_id', userId)
    set({ isLoggedIn: true, username, userId })
  },

  logout: () => {
    localStorage.removeItem('contact_logged_in')
    localStorage.removeItem('contact_username')
    localStorage.removeItem('contact_user_id')
    set({ isLoggedIn: false, username: '', userId: '' })
  },
}))
