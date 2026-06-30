import { useState, useMemo } from 'react'
import { useContactStore } from '../stores/contactStore'
import { Bot, MessageSquare, Users, BarChart3 } from 'lucide-react'
import { ModelConfigDialog } from '../components/ModelConfigDialog'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

export function AdminView() {
  const { sessions, agents } = useContactStore()
  const [configAgent, setConfigAgent] = useState<{ agentId: string; agentName: string } | null>(null)

  const allMessages = [...sessions.values()].flatMap((s) => s.messages)
  const userMessages = allMessages.filter((m) => m.role === 'user')
  const aiMessages = allMessages.filter((m) => m.role === 'assistant')

  // 按日期统计对话次数（最近7天）
  const dailyData = useMemo(() => {
    const days: Record<string, { date: string; userMsgs: number; aiMsgs: number; sessions: number }> = {}
    const now = Date.now()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000)
      const key = `${d.getMonth() + 1}/${d.getDate()}`
      days[key] = { date: key, userMsgs: 0, aiMsgs: 0, sessions: 0 }
    }
    for (const session of sessions.values()) {
      const d = new Date(session.createdAt)
      const key = `${d.getMonth() + 1}/${d.getDate()}`
      if (days[key]) days[key].sessions++
      for (const msg of session.messages) {
        const md = new Date(msg.timestamp)
        const mkey = `${md.getMonth() + 1}/${md.getDate()}`
        if (days[mkey]) {
          if (msg.role === 'user') days[mkey].userMsgs++
          else days[mkey].aiMsgs++
        }
      }
    }
    return Object.values(days)
  }, [sessions])

  // 按智能体统计使用率
  const agentUsageData = useMemo(() => {
    const usage: Record<string, number> = {}
    for (const session of sessions.values()) {
      usage[session.agentId] = (usage[session.agentId] ?? 0) + 1
    }
    return agents.map((a) => ({
      name: a.agentName,
      value: usage[a.agentId] ?? 0,
    })).filter((d) => d.value > 0)
  }, [sessions, agents])

  // 按小时统计消息分布
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, count: 0 }))
    for (const msg of allMessages) {
      const h = new Date(msg.timestamp).getHours()
      hours[h].count++
    }
    return hours.filter((_, i) => i % 2 === 0) // 每2小时一个点
  }, [allMessages])

  const stats = [
    { label: '总对话数', value: sessions.size, icon: <MessageSquare className="w-5 h-5" />, color: '#eff6ff', iconColor: '#3b82f6' },
    { label: '用户消息', value: userMessages.length, icon: <Users className="w-5 h-5" />, color: '#f0fdf4', iconColor: '#10b981' },
    { label: 'AI 回复', value: aiMessages.length, icon: <Bot className="w-5 h-5" />, color: '#faf5ff', iconColor: '#8b5cf6' },
    { label: '智能体数', value: agents.length, icon: <BarChart3 className="w-5 h-5" />, color: '#fff7ed', iconColor: '#f59e0b' },
  ]

  const recentSessions = [...sessions.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8)

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="h-14 bg-white border-b border-[#f1f5f9] flex items-center px-8 shrink-0">
        <h1 className="text-[16px] font-semibold text-[#0f172a]">管理后台</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: stat.color, color: stat.iconColor }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">{stat.label}</p>
                <p className="text-[28px] font-bold text-[#0f172a] leading-none mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 7日对话趋势 */}
          <div className="col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-5">
            <p className="text-[13px] font-semibold text-[#0f172a] mb-4">7 日对话趋势</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={dailyData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="userMsgs" name="用户消息" stroke="#3b82f6" strokeWidth={2} fill="url(#colorUser)" />
                <Area type="monotone" dataKey="aiMsgs" name="AI 回复" stroke="#10b981" strokeWidth={2} fill="url(#colorAi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 智能体使用分布 */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <p className="text-[13px] font-semibold text-[#0f172a] mb-4">智能体使用分布</p>
            {agentUsageData.length === 0 ? (
              <div className="flex items-center justify-center h-[180px] text-sm text-gray-400">暂无数据</div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={agentUsageData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {agentUsageData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v, n) => [v, n]} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 消息时段分布 */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <p className="text-[13px] font-semibold text-[#0f172a] mb-4">消息时段分布</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={hourlyData} margin={{ top: 0, right: 4, left: -25, bottom: 0 }}>
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" name="消息数" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Agent status */}
          <div className="col-span-2 bg-white border border-[#e2e8f0] rounded-xl p-5">
            <p className="text-[13px] font-semibold text-[#0f172a] mb-4">智能体状态</p>
            <div className="grid grid-cols-2 gap-3">
              {agents.length === 0 && (
                <div className="col-span-2 text-sm text-gray-400">暂无已配置智能体</div>
              )}
              {agents.map((agent, i) => (
                <div key={agent.agentId} className="flex gap-3 items-center p-3 bg-[#f8fafc] rounded-xl">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: COLORS[i % COLORS.length] + '22' }}>
                    <Bot className="w-4 h-4" style={{ color: COLORS[i % COLORS.length] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#0f172a] truncate">{agent.agentName}</p>
                    <span className="text-[11px] text-[#10b981] font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full inline-block" /> 运行中
                    </span>
                  </div>
                  <button
                    onClick={() => setConfigAgent({ agentId: agent.agentId, agentName: agent.agentName })}
                    className="text-[11px] text-[#3b82f6] bg-[#eff6ff] px-2 py-1 rounded-lg font-medium hover:bg-[#dbeafe] transition-colors cursor-pointer shrink-0"
                  >
                    配置
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent sessions */}
        <div>
          <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">最近对话</p>
          <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
            <div className="grid px-4 py-2.5 border-b border-[#f1f5f9]" style={{ gridTemplateColumns: '1fr 1fr 80px 120px' }}>
              {['会话名称', '最后消息', '消息数', '时间'].map((h) => (
                <p key={h} className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">{h}</p>
              ))}
            </div>
            {recentSessions.length === 0 && <p className="px-4 py-4 text-sm text-gray-400">暂无对话记录</p>}
            {recentSessions.map((session, idx) => {
              const lastMsg = session.messages[session.messages.length - 1]
              return (
                <div key={session.id} className={`grid px-4 py-3 items-center ${idx > 0 ? 'border-t border-[#f8fafc]' : ''}`} style={{ gridTemplateColumns: '1fr 1fr 80px 120px' }}>
                  <p className="text-[13px] font-medium text-[#0f172a] truncate pr-2">{session.name}</p>
                  <p className="text-[13px] text-[#64748b] truncate pr-2">{lastMsg?.content?.slice(0, 20) || '空会话'}</p>
                  <p className="text-[13px] text-[#64748b]">{session.messages.length} 条</p>
                  <p className="text-[12px] text-[#94a3b8]">{new Date(session.createdAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {configAgent && (
        <ModelConfigDialog agentId={configAgent.agentId} agentName={configAgent.agentName} onClose={() => setConfigAgent(null)} />
      )}
    </div>
  )
}
