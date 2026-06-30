import { useState, useEffect } from 'react'
import { useContactStore } from '../stores/contactStore'
import { MessageSquare, Settings, User, Briefcase } from 'lucide-react'
import { ModelConfigDialog } from './ModelConfigDialog'
import { RagPanel } from './RagPanel'

const AGENT_STYLES = [
  { bg: '#eff6ff', stroke: '#3b82f6', Icon: User },
  { bg: '#f0fdf4', stroke: '#10b981', Icon: Briefcase },
]

export function ChatSidebar() {
  const {
    agents, currentAgentId, setCurrentAgentId,
    sessions, currentSessionId, createSession,
    fetchSessions, restoreSession,
  } = useContactStore()

  const [configAgent, setConfigAgent] = useState<{ agentId: string; agentName: string } | null>(null)

  useEffect(() => {
    if (currentAgentId) fetchSessions(currentAgentId)
  }, [currentAgentId])

  const agentSessions = currentAgentId
    ? [...sessions.values()]
        .filter((s) => s.agentId === currentAgentId)
        .sort((a, b) => b.createdAt - a.createdAt)
    : []

  return (
    <div className="w-[236px] shrink-0 flex flex-col border-r border-[#f1f5f9] bg-white overflow-hidden">
      <div className="px-3.5 pt-3.5 pb-2.5 border-b border-[#f1f5f9]">
        <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-widest mb-2.5">智能体</p>
        {agents.length === 0 && (
          <p className="text-xs text-gray-400 italic px-1">加载中...</p>
        )}
        {agents.map((agent, i) => {
          const style = AGENT_STYLES[i % AGENT_STYLES.length]
          const isActive = currentAgentId === agent.agentId
          return (
            <div
              key={agent.agentId}
              className={`flex items-center gap-1.5 rounded-lg mb-1 transition-colors ${
                isActive ? 'bg-[#eff6ff]' : 'hover:bg-gray-50'
              }`}
            >
              <button
                onClick={() => setCurrentAgentId(agent.agentId)}
                className="flex-1 text-left px-2.5 py-1.5 flex items-center gap-2 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: style.bg }}>
                  <style.Icon className="w-3 h-3" style={{ stroke: style.stroke, color: style.stroke }} />
                </div>
                <span className={`text-xs font-medium truncate flex-1 ${isActive ? 'text-[#3b82f6]' : 'text-[#475569]'}`}>
                  {agent.agentName}
                </span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setConfigAgent({ agentId: agent.agentId, agentName: agent.agentName }) }}
                title="模型配置"
                className="shrink-0 p-1.5 text-gray-300 hover:text-[#3b82f6] rounded transition-colors cursor-pointer mr-1"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>

      <div className="px-3.5 py-3 flex-1 overflow-y-auto min-h-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-widest">对话记录</p>
          {currentAgentId && (
            <button
              onClick={() => createSession(currentAgentId)}
              className="text-[#3b82f6] hover:text-[#2563eb] transition-colors cursor-pointer text-base leading-none"
            >
              +
            </button>
          )}
        </div>
        {agentSessions.length === 0 && (
          <p className="text-xs text-gray-400 italic">暂无对话</p>
        )}
        {agentSessions.map((session) => (
          <button
            key={session.id}
            onClick={() => restoreSession(session.id)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs mb-0.5 transition-colors flex items-center gap-2 cursor-pointer ${
              currentSessionId === session.id
                ? 'bg-[#eff6ff] text-[#3b82f6] font-medium'
                : 'text-[#64748b] hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{session.name}</span>
          </button>
        ))}
      </div>

      <RagPanel agentId={currentAgentId} />

      {configAgent && (
        <ModelConfigDialog
          agentId={configAgent.agentId}
          agentName={configAgent.agentName}
          onClose={() => setConfigAgent(null)}
        />
      )}
    </div>
  )
}
