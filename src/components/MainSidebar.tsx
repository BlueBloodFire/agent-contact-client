import { LayoutDashboard, MessageSquare, Briefcase, Settings, User, HelpCircle, Plus, Sparkles } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { navigate } from '../router'
import type { Route } from '../router'

interface Props {
  current: Route
}

export function MainSidebar({ current }: Props) {
  const { username } = useAuthStore()
  const initials = username ? username.slice(0, 2).toUpperCase() : 'U'

  const navItems = [
    { route: 'home' as Route, label: '工作台', icon: LayoutDashboard },
    { route: 'chat' as Route, label: 'AI对话', icon: MessageSquare },
    { route: 'business' as Route, label: '业务大厅', icon: Briefcase },
    { route: 'admin' as Route, label: '管理后台', icon: Settings },
    { route: 'profile' as Route, label: '个人中心', icon: User },
  ]

  return (
    <nav className="h-screen w-64 fixed left-0 top-0 bg-[#f3f4f6] border-r border-[#e5e7eb] flex flex-col p-4 z-40">
      <div className="mb-6 px-2">
        <h1 className="text-xl font-bold text-[#003d9b] tracking-tight">智能客服</h1>
        <p className="text-xs text-gray-500 font-medium">AI服务工作台</p>
      </div>

      <div className="flex items-center gap-3 px-2 mb-6 bg-white/50 p-2.5 rounded-xl border border-[#e5e7eb]">
        <div className="w-10 h-10 rounded-full bg-[#0052cc] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#191c1e] truncate">{username}</p>
          <p className="text-[11px] text-[#492f95] flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 ai-spark shrink-0" />
            AI助手在线
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('chat')}
        className="w-full bg-[#0052cc] text-white font-semibold text-xs py-2.5 px-4 rounded-lg mb-6 hover:bg-[#003d9b] active:scale-[0.98] transition-all duration-150 shadow-sm flex justify-center items-center gap-2 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        新建对话
      </button>

      <ul className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = current === item.route
          return (
            <li key={item.route}>
              <button
                onClick={() => navigate(item.route)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-[#0052cc]/10 text-[#0052cc]'
                    : 'text-[#434654] hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 duration-150 ${isActive ? 'text-[#0052cc]' : 'text-[#737685]'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto pt-4 border-t border-[#e5e7eb] flex flex-col gap-2.5">
        <a
          href="#help"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-[#434654] hover:bg-gray-200 rounded-lg transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-[#737685]" />
          <span>帮助中心</span>
        </a>
      </div>
    </nav>
  )
}
