import { useState } from 'react'
import { LayoutDashboard, MessageSquare, Briefcase, Activity, User, LogOut, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { navigate } from '../router'
import type { Route } from '../router'

interface Props {
  current: Route
}

export function MainSidebar({ current }: Props) {
  const { username, logout } = useAuthStore()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const initials = username ? username.slice(0, 2).toUpperCase() : 'U'

  const navItems = [
    { route: 'home' as Route, label: '工作台', Icon: LayoutDashboard },
    { route: 'chat' as Route, label: 'AI 对话', Icon: MessageSquare },
    { route: 'business' as Route, label: '业务大厅', Icon: Briefcase },
    { route: 'admin' as Route, label: '管理后台', Icon: Activity },
    { route: 'profile' as Route, label: '个人中心', Icon: User },
  ]

  return (
    <>
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

        <p className="text-[10px] font-medium text-[#334155] uppercase tracking-widest px-2 mb-1.5">导航</p>

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

        {/* User row */}
        <div className="border-t border-[#1e293b] pt-3.5 flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#e2e8f0] truncate">{username}</p>
            <p className="text-[10px] text-[#475569]">在线</p>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            title="退出"
            className="p-1 text-[#475569] hover:text-[#94a3b8] transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Logout confirm dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0f172a]">退出登录</h3>
              <button onClick={() => setShowLogoutConfirm(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[15px] text-gray-500 mb-6">确定要退出登录吗？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); logout() }}
                className="flex-1 py-2.5 bg-[#ef4444] text-white rounded-xl text-sm font-semibold hover:bg-[#dc2626] transition-colors cursor-pointer"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
