import { useEffect } from 'react'
import { ChatSidebar } from '../components/ChatSidebar'
import { ChatWindow } from '../components/ChatWindow'
import { ChatInput } from '../components/ChatInput'
import { useContactStore } from '../stores/contactStore'

export function ChatView() {
  useEffect(() => {
    const pending = localStorage.getItem('contact_pending_message')
    if (pending) {
      localStorage.removeItem('contact_pending_message')
      setTimeout(() => {
        useContactStore.getState().setInputText(pending)
      }, 50)
    }
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
