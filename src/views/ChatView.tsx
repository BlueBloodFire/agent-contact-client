import { useEffect, useState } from 'react'
import { ChatSidebar } from '../components/ChatSidebar'
import { ChatWindow } from '../components/ChatWindow'
import { ChatInput } from '../components/ChatInput'
import { ModelConfigDialog, getActiveConfig } from '../components/ModelConfigDialog'
import { useContactStore } from '../stores/contactStore'

export function ChatView() {
  const { showModelConfigPrompt, setShowModelConfigPrompt, currentAgentId, agents } = useContactStore()
  const [configAgentName, setConfigAgentName] = useState('')

  useEffect(() => {
    const pending = localStorage.getItem('contact_pending_message')
    if (!pending) return
    localStorage.removeItem('contact_pending_message')

    const store = useContactStore.getState()
    const ensureAgentAndSend = async () => {
      let agentId = store.currentAgentId
      if (!agentId && store.agents.length > 0) {
        agentId = store.agents[0].agentId
        store.setCurrentAgentId(agentId)
        await new Promise((r) => setTimeout(r, 50))
      }
      if (agentId) await useContactStore.getState().sendMessage(pending)
    }
    setTimeout(ensureAgentAndSend, 100)
  }, [])

  // 切换智能体时主动探测模型配置
  useEffect(() => {
    if (!currentAgentId) return
    const agent = agents.find((a) => a.agentId === currentAgentId)
    setConfigAgentName(agent?.agentName ?? '智能体')
    if (!getActiveConfig(currentAgentId)) {
      setShowModelConfigPrompt(true)
    }
  }, [currentAgentId, agents])

  return (
    <div className="flex flex-1 min-h-0">
      <ChatSidebar />
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        <ChatWindow />
        <ChatInput />
      </div>

      {showModelConfigPrompt && currentAgentId && (
        <ModelConfigDialog
          agentId={currentAgentId}
          agentName={configAgentName}
          onClose={() => setShowModelConfigPrompt(false)}
          onSaved={() => setShowModelConfigPrompt(false)}
        />
      )}
    </div>
  )
}
