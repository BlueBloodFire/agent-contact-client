import { navigate } from '../router'
import type { Route } from '../router'
import { useAuthStore } from '../stores/authStore'
import { useContactStore } from '../stores/contactStore'

interface QuickCard {
  title: string
  desc: string
  stroke: string
  iconBg: string
  arrowColor: string
  svgPath: string
  route: Route
}

export function HomeView() {
  const { username } = useAuthStore()
  const { sessions, agents } = useContactStore()
  const totalSessions = sessions.size
  const totalMessages = [...sessions.values()].reduce((s, v) => s + v.messages.length, 0)

  const stats = [
    { label: '历史对话', value: totalSessions, trend: '+3', trendLabel: '较上月' },
    { label: '消息总数', value: totalMessages, trend: null, trendLabel: '本月累计' },
    { label: '在线智能体', value: agents.length || 2, trend: null, trendLabel: '运行正常', green: true },
  ]

  const cards: QuickCard[] = [
    {
      title: 'AI 智能对话',
      desc: '与智能客服助手实时对话，精准解答疑问',
      stroke: '#3b82f6',
      iconBg: '#eff6ff',
      arrowColor: '#3b82f6',
      svgPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
      route: 'chat',
    },
    {
      title: '业务办理大厅',
      desc: '账单查询、业务申请，一站式自助办理',
      stroke: '#10b981',
      iconBg: '#f0fdf4',
      arrowColor: '#10b981',
      svgPath: 'M0 0h24v24H0z',
      route: 'business',
    },
    {
      title: '服务管理后台',
      desc: '监控运营数据、管理知识库与系统配置',
      stroke: '#ca8a04',
      iconBg: '#fefce8',
      arrowColor: '#ca8a04',
      svgPath: '',
      route: 'admin',
    },
    {
      title: '个人中心',
      desc: '管理个人信息、通知偏好与安全设置',
      stroke: '#a855f7',
      iconBg: '#fdf4ff',
      arrowColor: '#a855f7',
      svgPath: '',
      route: 'profile',
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      {/* Top bar */}
      <div className="h-14 bg-white border-b border-[#f1f5f9] flex items-center px-8 shrink-0">
        <h1 className="text-[15px] font-semibold text-[#0f172a]">工作台</h1>
        <span className="text-[13px] text-[#94a3b8] ml-2 font-normal">· 您好，{username}</span>
      </div>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
              <p className="text-[11px] font-medium text-[#64748b] uppercase tracking-wider mb-3">{stat.label}</p>
              <p className="text-[36px] font-bold text-[#0f172a] leading-none tracking-tight">{stat.value}</p>
              <p className="text-xs text-[#94a3b8] mt-1.5">
                {stat.trendLabel}
                {stat.trend && <span className="text-[#10b981] font-medium ml-1">{stat.trend}</span>}
                {stat.green && (
                  <span className="inline-flex items-center gap-1 ml-0.5">
                    <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full inline-block" />
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* AI ready card */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#eff6ff] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="w-[18px] h-[18px]">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f172a]">AI 助手已就绪</p>
              <p className="text-xs text-[#64748b] mt-0.5">{agents.length || 2} 个智能体在线 · 平均响应时间 &lt; 1s</p>
            </div>
          </div>
          <button
            onClick={() => navigate('chat')}
            className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-[13px] font-medium hover:bg-[#2563eb] transition-colors cursor-pointer"
          >
            开始对话
          </button>
        </div>

        {/* Quick access */}
        <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-widest mb-3.5">快速入口</p>
        <div className="grid grid-cols-2 gap-3.5">
          {cards.map((card) => (
            <button
              key={card.route}
              onClick={() => navigate(card.route)}
              className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-left hover:border-[#cbd5e1] hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3.5" style={{ background: card.iconBg }}>
                {card.route === 'chat' && (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="w-[17px] h-[17px]" style={{ stroke: card.stroke }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                )}
                {card.route === 'business' && (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="w-[17px] h-[17px]" style={{ stroke: card.stroke }}>
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                )}
                {card.route === 'admin' && (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="w-[17px] h-[17px]" style={{ stroke: card.stroke }}>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                )}
                {card.route === 'profile' && (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" className="w-[17px] h-[17px]" style={{ stroke: card.stroke }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <p className="text-sm font-semibold text-[#0f172a] mb-1">{card.title}</p>
              <p className="text-xs text-[#64748b] leading-relaxed">{card.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
