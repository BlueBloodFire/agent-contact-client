import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from './stores/authStore'
import { useContactStore } from './stores/contactStore'
import { getRoute, navigate } from './router'
import type { Route } from './router'
import { LoginView } from './views/LoginView'
import { HomeView } from './views/HomeView'
import { BusinessView } from './views/BusinessView'
import { AdminView } from './views/AdminView'
import { ChatView } from './views/ChatView'
import { ProfileView } from './views/ProfileView'
import { MainSidebar } from './components/MainSidebar'

function App() {
  const { isLoggedIn, checkExpiry } = useAuthStore()
  const { fetchAgents } = useContactStore()
  const [route, setRoute] = useState<Route>(getRoute())

  const handleHashChange = useCallback(() => {
    setRoute(getRoute())
  }, [])

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [handleHashChange])

  useEffect(() => {
    if (isLoggedIn) {
      fetchAgents()
      if (!window.location.hash || window.location.hash === '#/') {
        navigate('home')
      }
    }
  }, [isLoggedIn, fetchAgents])

  // 定期检查token是否过期，每分钟一次
  useEffect(() => {
    if (!isLoggedIn) return
    const timer = setInterval(() => {
      checkExpiry()
    }, 60 * 1000)
    return () => clearInterval(timer)
  }, [isLoggedIn, checkExpiry])

  if (!isLoggedIn) {
    return <LoginView />
  }

  const renderView = () => {
    switch (route) {
      case 'home':     return <HomeView />
      case 'chat':     return <ChatView />
      case 'business': return <BusinessView />
      case 'admin':    return <AdminView />
      case 'profile':  return <ProfileView />
      default:         return <HomeView />
    }
  }

  return (
    <div className="flex h-screen bg-[#f8f9fb] overflow-hidden">
      <MainSidebar current={route} />
      <main className="ml-[220px] flex-1 flex flex-col min-h-0 overflow-hidden">
        {renderView()}
      </main>
    </div>
  )
}

export default App
