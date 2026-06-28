import { useEffect } from 'react'
import { ChatSidebar } from '../components/ChatSidebar'
import { ChatWindow } from '../components/ChatWindow'
import { ChatInput } from '../components/ChatInput'
import { useContactStore } from '../stores/contactStore'

export function ChatView() {
  useEffect(() => {
    const pending = localStorage.getItem('contact_pending_message')
    if (!pending) return
    localStorage.removeItem('contact_pending_message')

    const store = useContactStore.getState()
    // 确保有选中的智能体，没有则自动选第一个
    const ensureAgentAndSend = async () => {
      let agentId = store.currentAgentId
      if (!agentId && store.agents.length > 0) {
        agentId = store.agents[0].agentId
        store.setCurrentAgentId(agentId)
        // 等待状态更新
        await new Promise((r) => setTimeout(r, 50))
      }
      if (agentId) {
        await useContactStore.getState().sendMessage(pending)
      }
    }

    setTimeout(ensureAgentAndSend, 100)
  }, [])

  return (
    <div className="flex flex-1 min-h-0">
      <ChatSidebar />
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        <ChatWindow />
        <ChatInput />
      </div>
    </div>
  )
}
