import { useEffect, useRef } from 'react'
import { useContactStore } from '../stores/contactStore'
import { ChatMessage } from './ChatMessage'

export function ChatWindow() {
  const { sessions, currentSessionId, currentAgentId, agents, createSession } = useContactStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  const session = currentSessionId ? sessions.get(currentSessionId) : null
  const messages = session?.messages ?? []
  const currentAgent = agents.find((a) => a.agentId === currentAgentId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, messages[messages.length - 1]?.content])

  if (!currentAgentId) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400 text-sm">
        请选择一个智能体开始对话
      </div>
    )
  }

  if (!currentSessionId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="text-center">
          <p className="text-[#191c1e] font-bold text-lg">{currentAgent?.agentName}</p>
          <p className="text-gray-400 text-sm mt-1">{currentAgent?.agentDesc}</p>
        </div>
        <button
          onClick={() => createSession(currentAgentId)}
          className="px-4 py-2 bg-[#0052cc] text-white rounded-lg text-xs font-semibold hover:bg-[#003d9b] transition-colors cursor-pointer"
        >
          开始对话
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
          发送消息开始对话
        </div>
      )}
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
