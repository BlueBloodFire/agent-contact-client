import { useState } from 'react'
import { useContactStore } from '../stores/contactStore'
import { Bot, MessageSquare, Users, BarChart3 } from 'lucide-react'
import { ModelConfigDialog } from '../components/ModelConfigDialog'

export function AdminView() {
  const { sessions, agents } = useContactStore()
  const [configAgent, setConfigAgent] = useState<{ agentId: string; agentName: string } | null>(null)
  const allMessages = [...sessions.values()].flatMap((s) => s.messages)
  const userMessages = allMessages.filter((m) => m.role === 'user')
  const aiMessages = allMessages.filter((m) => m.role === 'assistant')

  const stats = [
    { label: '总对话数', value: sessions.size, icon: <MessageSquare className="w-4 h-4" /> },
    { label: '用户消息', value: userMessages.length, icon: <Users className="w-4 h-4" /> },
    { label: 'AI 回复', value: aiMessages.length, icon: <Bot className="w-4 h-4" /> },
    { label: '智能体数', value: agents.length, icon: <BarChart3 className="w-4 h-4" /> },
  ]

  const recentSessions = [...sessions.values()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10)

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="h-14 bg-white border-b border-[#f1f5f9] flex items-center px-8 shrink-0">
        <h1 className="text-[15px] font-semibold text-[#0f172a]">管理后台</h1>
      </div>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3.5 mb-7">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-[#e2e8f0] rounded-xl p-4">
              <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2.5">{stat.label}</p>
              <p className="text-[30px] font-bold text-[#0f172a] leading-none tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Agent status */}
        <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-widest mb-3.5">智能体状态</p>
        <div className="grid grid-cols-2 gap-3.5 mb-7">
          {agents.length === 0 && (
            <div className="col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-4 text-sm text-gray-400">
              暂无已配置智能体
            </div>
          )}
          {agents.map((agent, i) => (
            <div key={agent.agentId} className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex gap-3.5 items-start">
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: i === 0 ? '#eff6ff' : '#f0fdf4' }}
              >
                <Bot className="w-[18px] h-[18px]" style={{ stroke: i === 0 ? '#3b82f6' : '#10b981', color: 'transparent' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0f172a] mb-0.5">{agent.agentName}</p>
                <p className="text-xs text-[#64748b] mb-2.5 line-clamp-2 leading-relaxed">{agent.agentDesc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#10b981] font-medium flex items-center gap-1">
                    <span className="w-[5px] h-[5px] bg-[#10b981] rounded-full inline-block" />
                    运行中
                  </span>
                  <button
                    onClick={() => setConfigAgent({ agentId: agent.agentId, agentName: agent.agentName })}
                    className="text-[11px] text-[#3b82f6] bg-[#eff6ff] px-2.5 py-1 rounded-md font-medium hover:bg-[#dbeafe] transition-colors cursor-pointer"
                  >
                    模型配置
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent sessions */}
        <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-widest mb-3.5">最近对话</p>
        <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
          <div className="grid px-4 py-2.5 border-b border-[#f1f5f9]" style={{ gridTemplateColumns: '1fr 1fr 80px 120px' }}>
            {['会话名称', '最后消息', '消息数', '时间'].map((h) => (
              <p key={h} className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider">{h}</p>
            ))}
          </div>
          {recentSessions.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">暂无对话记录</p>
          )}
          {recentSessions.map((session, idx) => {
            const lastMsg = session.messages[session.messages.length - 1]
            return (
              <div
                key={session.id}
                className={`grid px-4 py-3 items-center ${idx > 0 ? 'border-t border-[#f8fafc]' : ''}`}
                style={{ gridTemplateColumns: '1fr 1fr 80px 120px' }}
              >
                <p className="text-[13px] font-medium text-[#0f172a] truncate pr-2">{session.name}</p>
                <p className="text-xs text-[#64748b] truncate pr-2">{lastMsg?.content?.slice(0, 20) || '空会话'}</p>
                <p className="text-xs text-[#64748b]">{session.messages.length} 条</p>
                <p className="text-[11px] text-[#94a3b8]">{new Date(session.createdAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            )
          })}
        </div>
      </div>

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
