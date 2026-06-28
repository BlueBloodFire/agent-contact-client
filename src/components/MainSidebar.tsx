import { LayoutDashboard, MessageSquare, Briefcase, Activity, User, LogOut } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { navigate } from '../router'
import type { Route } from '../router'

interface Props {
  current: Route
}

export function MainSidebar({ current }: Props) {
  const { username, logout } = useAuthStore()
  const initials = username ? username.slice(0, 2).toUpperCase() : 'U'

  const navItems = [
    { route: 'home' as Route, label: '工作台', Icon: LayoutDashboard },
    { route: 'chat' as Route, label: 'AI 对话', Icon: MessageSquare },
    { route: 'business' as Route, label: '业务大厅', Icon: Briefcase },
    { route: 'admin' as Route, label: '管理后台', Icon: Activity },
    { route: 'profile' as Route, label: '个人中心', Icon: User },
  ]

  return (
    <nav className="h-screen w-[220px] fixed left-0 top-0 bg-[#0f172a] flex flex-col py-5 px-3 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-6">
        <div className="w-[30px] h-[30px] bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] rounded-lg flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="w-3.5 h-3.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#f8fafc] leading-tight">智能客服</p>
          <p className="text-[10px] text-[#475569]">工作台 v2.0</p>
        </div>
      </div>

      {/* Nav label */}
      <p className="text-[10px] font-medium text-[#334155] uppercase tracking-widest px-2 mb-1.5">导航</p>

      {/* Nav items */}
      <ul className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ route, label, Icon }) => {
          const isActive = current === route
          return (
            <li key={route}>
              <button
                onClick={() => navigate(route)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[rgba(59,130,246,0.08)] text-[#3b82f6]'
                    : 'text-[#64748b] hover:bg-white/5 hover:text-[#94a3b8]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* User row at bottom */}
      <div className="border-t border-[#1e293b] pt-3.5 flex items-center gap-2.5 px-2">
        <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#e2e8f0] truncate">{username}</p>
          <p className="text-[10px] text-[#475569]">在线</p>
        </div>
        <button
          onClick={logout}
          title="退出"
          className="p-1 text-[#475569] hover:text-[#94a3b8] transition-colors cursor-pointer shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  )
}
