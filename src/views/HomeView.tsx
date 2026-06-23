import { navigate } from '../router'
import type { Route } from '../router'
import { useAuthStore } from '../stores/authStore'
import { useContactStore } from '../stores/contactStore'
import { MessageSquare, Briefcase, Settings, User, Sparkles, TrendingUp } from 'lucide-react'

interface QuickCard {
  title: string
  desc: string
  color: string
  iconBg: string
  icon: React.ReactNode
  route: Route
}

export function HomeView() {
  const { username } = useAuthStore()
  const { sessions, agents } = useContactStore()
  const totalSessions = sessions.size
  const totalMessages = [...sessions.values()].reduce((s, v) => s + v.messages.length, 0)

  const stats = [
    { label: '历史对话', value: totalSessions, color: 'text-[#0052cc]', bg: 'bg-blue-50', trend: '本月' },
    { label: '消息总数', value: totalMessages, color: 'text-[#4c3398]', bg: 'bg-purple-50', trend: '累计' },
    { label: '可用智能体', value: agents.length || 2, color: 'text-[#36b37e]', bg: 'bg-emerald-50', trend: '运行中' },
  ]

  const cards: QuickCard[] = [
    { title: 'AI 智能对话', desc: '与智能客服助手实时对话，解答疑问', color: 'text-[#0052cc]', iconBg: 'bg-[#0052cc]/10', icon: <MessageSquare className="w-5 h-5" />, route: 'chat' },
    { title: '业务办理大厅', desc: '查账单、办业务、申请服务一站办理', color: 'text-[#36b37e]', iconBg: 'bg-[#36b37e]/10', icon: <Briefcase className="w-5 h-5" />, route: 'business' },
    { title: '服务管理后台', desc: '查看对话记录、管理知识库与配置', color: 'text-[#4c3398]', iconBg: 'bg-[#4c3398]/10', icon: <Settings className="w-5 h-5" />, route: 'admin' },
    { title: '个人中心', desc: '查看个人信息、通知设置与对话统计', color: 'text-[#ffab00]', iconBg: 'bg-[#ffab00]/10', icon: <User className="w-5 h-5" />, route: 'profile' },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">工作台</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">您好，{username}！欢迎使用智能客服平台。</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-2xs flex items-start justify-between">
            <div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
              <TrendingUp className="w-3 h-3" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="ai-card-glow bg-white border border-[#e5e7eb] rounded-xl p-4 shadow-2xs mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#4c3398]/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#4c3398] ai-spark" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#191c1e]">AI 助手已就绪</p>
            <p className="text-xs text-[#4c3398] font-medium mt-0.5">
              Google Stitch MCP 已连接，{agents.length || 2} 个智能体在线
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('chat')}
          className="text-xs bg-[#4c3398] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#3b2780] transition-colors cursor-pointer"
        >
          开始对话
        </button>
      </div>

      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">快速入口</h2>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <button
            key={card.route}
            onClick={() => navigate(card.route)}
            className="bg-white border border-[#e5e7eb] rounded-xl p-5 text-left hover:shadow-md hover:border-gray-300 transition-all group shadow-2xs cursor-pointer"
          >
            <div className={`w-9 h-9 ${card.iconBg} ${card.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <p className="font-bold text-[#191c1e] text-sm">{card.title}</p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed font-medium">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
