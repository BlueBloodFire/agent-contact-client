import { useContactStore } from '../stores/contactStore'
import { MessageSquare, Plus, Bot } from 'lucide-react'

export function ChatSidebar() {
  const {
    agents, currentAgentId, setCurrentAgentId,
    sessions, currentSessionId, setCurrentSession, createSession,
  } = useContactStore()

  const agentSessions = currentAgentId
    ? [...sessions.values()].filter((s) => s.agentId === currentAgentId)
    : []

  return (
    <div className="w-56 shrink-0 flex flex-col border-r border-[#e5e7eb] bg-white">
      <div className="p-3 border-b border-[#e5e7eb]">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">智能体</p>
        {agents.length === 0 && (
          <p className="text-xs text-gray-400 italic px-1">加载中...</p>
        )}
        {agents.map((agent) => (
          <button
            key={agent.agentId}
            onClick={() => setCurrentAgentId(agent.agentId)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold mb-1 transition-colors flex items-center gap-2 cursor-pointer ${
              currentAgentId === agent.agentId
                ? 'bg-[#0052cc]/10 text-[#0052cc]'
                : 'text-[#434654] hover:bg-gray-100'
            }`}
          >
            <Bot className={`w-3.5 h-3.5 shrink-0 ${currentAgentId === agent.agentId ? 'text-[#0052cc]' : 'text-[#737685]'}`} />
            {agent.agentName}
          </button>
        ))}
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">对话记录</p>
          {currentAgentId && (
            <button
              onClick={() => createSession(currentAgentId)}
              className="text-[#0052cc] hover:text-[#003d9b] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {agentSessions.length === 0 && (
          <p className="text-xs text-gray-400 italic px-1">暂无对话</p>
        )}
        {agentSessions.map((session) => (
          <button
            key={session.id}
            onClick={() => setCurrentSession(session.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold mb-1 transition-colors flex items-center gap-2 cursor-pointer ${
              currentSessionId === session.id
                ? 'bg-[#0052cc]/10 text-[#0052cc]'
                : 'text-[#434654] hover:bg-gray-100'
            }`}
          >
            <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${currentSessionId === session.id ? 'text-[#0052cc]' : 'text-[#737685]'}`} />
            <span className="truncate">{session.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
