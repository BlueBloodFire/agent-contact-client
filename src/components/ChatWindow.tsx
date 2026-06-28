import { useEffect, useRef } from 'react'
import { useContactStore } from '../stores/contactStore'
import { ChatMessage } from './ChatMessage'
import { Bot } from 'lucide-react'

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
      <div className="flex-1 flex flex-col">
        {/* 顶部标题栏 */}
        <div className="shrink-0 h-[52px] border-b border-[#f1f5f9] flex items-center px-6 bg-white gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
          <span className="text-sm font-semibold text-[#0f172a]">{currentAgent?.agentName}</span>
          {currentAgent?.agentDesc && (
            <span className="text-xs text-[#94a3b8] truncate hidden md:block">{currentAgent.agentDesc}</span>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
            <Bot className="w-7 h-7 text-[#3b82f6]" />
          </div>
          <div className="text-center">
            <p className="text-[#191c1e] font-bold text-lg">{currentAgent?.agentName}</p>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">{currentAgent?.agentDesc}</p>
          </div>
          <button
            onClick={() => createSession(currentAgentId)}
            className="px-5 py-2.5 bg-[#3b82f6] text-white rounded-xl text-sm font-semibold hover:bg-[#003d9b] transition-colors cursor-pointer shadow-sm"
          >
            开始对话
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
      {/* 顶部标题栏 */}
      <div className="shrink-0 h-[52px] border-b border-[#f1f5f9] flex items-center px-6 bg-white gap-2.5">
        <div className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" />
        <span className="text-sm font-semibold text-[#0f172a]">{currentAgent?.agentName}</span>
        {currentAgent?.agentDesc && (
          <span className="text-xs text-[#94a3b8] truncate hidden md:block">{currentAgent.agentDesc}</span>
        )}
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full mx-auto px-6 py-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-32 text-zinc-400 text-sm">
              发送消息开始对话
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
