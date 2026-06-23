import { useContactStore } from '../stores/contactStore'
import { Bot, MessageSquare, Users, BarChart3, CheckCircle } from 'lucide-react'

export function AdminView() {
  const { sessions, agents } = useContactStore()
  const allMessages = [...sessions.values()].flatMap((s) => s.messages)
  const userMessages = allMessages.filter((m) => m.role === 'user')
  const aiMessages = allMessages.filter((m) => m.role === 'assistant')

  const stats = [
    { label: '总对话数', value: sessions.size, color: 'text-[#0052cc]', bg: 'bg-[#0052cc]/10', icon: <MessageSquare className="w-4 h-4" /> },
    { label: '用户消息', value: userMessages.length, color: 'text-[#36b37e]', bg: 'bg-[#36b37e]/10', icon: <Users className="w-4 h-4" /> },
    { label: 'AI 回复', value: aiMessages.length, color: 'text-[#4c3398]', bg: 'bg-[#4c3398]/10', icon: <Bot className="w-4 h-4" /> },
    { label: '已配置智能体', value: agents.length, color: 'text-[#ffab00]', bg: 'bg-[#ffab00]/10', icon: <BarChart3 className="w-4 h-4" /> },
  ]

  const recentSessions = [...sessions.values()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10)

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">服务管理后台</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">实时监控客服运营数据与对话记录</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-2xs">
            <div className={`w-7 h-7 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">已配置智能体</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {agents.length === 0 && (
          <div className="col-span-2 bg-white border border-[#e5e7eb] rounded-xl p-4 text-sm text-gray-400">
            暂无已配置智能体（后端未启动）
          </div>
        )}
        {agents.map((agent) => (
          <div key={agent.agentId} className="ai-card-glow bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-2xs flex items-start gap-3">
            <div className="w-9 h-9 bg-[#4c3398]/10 rounded-lg flex items-center justify-center text-[#4c3398] shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#191c1e]">{agent.agentName}</p>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 font-medium">{agent.agentDesc}</p>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="w-3 h-3 text-[#36b37e]" />
                <span className="text-[10px] text-[#36b37e] font-bold">运行中</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">最近对话记录</h2>
      <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-2xs overflow-hidden">
        {recentSessions.length === 0 && (
          <p className="p-4 text-sm text-gray-400">暂无对话记录</p>
        )}
        {recentSessions.map((session, idx) => {
          const lastMsg = session.messages[session.messages.length - 1]
          return (
            <div
              key={session.id}
              className={`px-4 py-3 flex items-center justify-between gap-4 hover:bg-[#f8f9fb] transition-colors ${idx > 0 ? 'border-t border-gray-50' : ''}`}
            >
              <div className="min-w-0 flex items-center gap-3">
                <div className="w-7 h-7 bg-[#0052cc]/10 rounded-lg flex items-center justify-center shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-[#0052cc]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#191c1e] truncate">{session.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {session.messages.length} 条消息 · {new Date(session.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full shrink-0 max-w-[140px] truncate font-medium">
                {lastMsg?.content?.slice(0, 20) || '空会话'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
