import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useContactStore } from '../stores/contactStore'
import { History, Bell, Zap, LogOut, User, Mail, Shield } from 'lucide-react'

export function ProfileView() {
  const { username, userId, logout } = useAuthStore()
  const { sessions } = useContactStore()
  const initials = username ? username.slice(0, 2).toUpperCase() : 'U'

  const totalMessages = [...sessions.values()].reduce((sum, s) => sum + s.messages.length, 0)
  const totalSessions = sessions.size

  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [aiAssist, setAiAssist] = useState(true)

  const activityLogs = [
    { id: '1', title: '登录系统', subtitle: '用户认证成功', time: '刚刚' },
    { id: '2', title: 'AI 对话已启动', subtitle: `共 ${totalSessions} 个会话`, time: '本次登录' },
    { id: '3', title: '平台状态正常', subtitle: 'SSL/TLS 连接安全', time: '系统状态' },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">个人中心</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">管理您的个人信息与偏好设置</p>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Left column */}
        <div className="col-span-12 lg:col-span-7 space-y-5">
          {/* Profile card */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100">
              <div className="w-14 h-14 rounded-full bg-[#0052cc] flex items-center justify-center text-white text-xl font-bold shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-base font-bold text-[#191c1e]">{username}</p>
                <p className="text-xs text-[#492f95] flex items-center gap-1 font-medium mt-0.5">
                  <span className="ai-spark">✦</span>
                  AI助手在线
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#f8f9fb] rounded-lg p-3 text-center border border-gray-100">
                <p className="text-2xl font-bold text-[#0052cc]">{totalSessions}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">历史对话</p>
              </div>
              <div className="bg-[#f8f9fb] rounded-lg p-3 text-center border border-gray-100">
                <p className="text-2xl font-bold text-[#4c3398]">{totalMessages}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">消息总数</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50/50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">用户名</span>
                </div>
                <span className="text-xs font-bold text-[#191c1e]">{username}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50/50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">用户 ID</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">{userId}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50/50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">账号状态</span>
                </div>
                <span className="text-[10px] bg-[#36b37e]/10 text-[#36b37e] font-bold px-2 py-0.5 rounded-full">正常</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-2xs">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Bell className="w-4 h-4 text-[#0052cc]" />
              通知配置
            </h4>
            <div className="space-y-3">
              {[
                { label: '邮件通知', desc: '接收每日对话摘要', value: emailNotifs, setter: setEmailNotifs },
                { label: '桌面推送', desc: '重要事件浏览器提醒', value: pushNotifs, setter: setPushNotifs },
                { label: 'AI 辅助增强', desc: '启用智能回复建议', value: aiAssist, setter: setAiAssist },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => item.setter(!item.value)}
                    className={`w-10 h-6 rounded-full flex items-center p-0.5 transition-all cursor-pointer ${item.value ? 'bg-[#36b37e]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${item.value ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Activity Logs */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-2xs flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#0052cc]" />
              工作台活动
            </h3>
            <span className="text-[10px] bg-blue-100 text-[#0052cc] font-extrabold px-2.5 py-0.5 rounded-full">审计已启用</span>
          </div>

          <div className="flex-1">
            <ul className="relative space-y-4">
              <div className="absolute left-3 top-2.5 bottom-2.5 w-[1.5px] bg-gray-200"></div>
              {activityLogs.map((log) => (
                <li key={log.id} className="flex gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Zap className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800">{log.title}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{log.subtitle}</p>
                    <p className="text-[9px] text-[#0052cc] font-semibold mt-1">{log.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-5 flex justify-between items-center text-xs">
            <span className="text-gray-400 font-semibold">安全：SSL/TLS 加密</span>
            <button
              onClick={logout}
              className="text-[#de350b] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
