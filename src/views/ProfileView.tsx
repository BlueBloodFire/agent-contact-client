import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useContactStore } from '../stores/contactStore'
import { LogOut } from 'lucide-react'

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
    { title: '登录系统', subtitle: '用户认证成功', time: '刚刚', dot: '#3b82f6' },
    { title: 'AI 对话启动', subtitle: `共 ${totalSessions} 个会话`, time: '本次登录', dot: '#3b82f6' },
    { title: '平台状态正常', subtitle: 'SSL/TLS 连接安全', time: '系统检测', dot: '#10b981' },
  ]

  const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <button
      onClick={toggle}
      className="w-9 h-5 rounded-full flex items-center px-0.5 transition-all cursor-pointer shrink-0"
      style={{ background: on ? '#3b82f6' : '#cbd5e1' }}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="h-14 bg-white border-b border-[#f1f5f9] flex items-center px-8 shrink-0">
        <h1 className="text-[15px] font-semibold text-[#0f172a]">个人中心</h1>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-5 max-w-[900px]">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            {/* Profile card */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
              <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-[#f1f5f9]">
                <div className="w-12 h-12 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-base font-semibold shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-base font-semibold text-[#0f172a]">{username}</p>
                  <p className="text-xs text-[#10b981] mt-0.5 flex items-center gap-1">
                    <span className="w-[5px] h-[5px] bg-[#10b981] rounded-full inline-block" />
                    在线
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <div className="bg-[#f8fafc] rounded-lg p-3 text-center">
                  <p className="text-[22px] font-bold text-[#0f172a]">{totalSessions}</p>
                  <p className="text-[10px] text-[#64748b] font-medium uppercase tracking-wider mt-0.5">历史对话</p>
                </div>
                <div className="bg-[#f8fafc] rounded-lg p-3 text-center">
                  <p className="text-[22px] font-bold text-[#0f172a]">{totalMessages}</p>
                  <p className="text-[10px] text-[#64748b] font-medium uppercase tracking-wider mt-0.5">消息总数</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: '用户名', value: username },
                  { label: '用户 ID', value: userId, mono: true },
                  { label: '账号状态', badge: true },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 px-3 bg-[#f8fafc] rounded-lg">
                    <span className="text-xs text-[#64748b]">{item.label}</span>
                    {item.badge ? (
                      <span className="text-[11px] bg-[#f0fdf4] text-[#10b981] font-semibold px-2 py-0.5 rounded-full">正常</span>
                    ) : (
                      <span className={`text-xs font-medium text-[#0f172a] truncate max-w-[150px] ${item.mono ? 'font-mono text-[#94a3b8] text-[10px]' : ''}`}>{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
              <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-widest mb-3.5">通知设置</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: '邮件通知', desc: '接收每日对话摘要', on: emailNotifs, toggle: () => setEmailNotifs(!emailNotifs) },
                  { label: '桌面推送', desc: '重要事件实时提醒', on: pushNotifs, toggle: () => setPushNotifs(!pushNotifs) },
                  { label: 'AI 辅助增强', desc: '启用智能回复建议', on: aiAssist, toggle: () => setAiAssist(!aiAssist) },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2.5 px-3 bg-[#f8fafc] rounded-lg">
                    <div>
                      <p className="text-[13px] font-medium text-[#0f172a]">{item.label}</p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle on={item.on} toggle={item.toggle} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Activity log */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-widest">活动日志</p>
              <span className="text-[10px] bg-[#eff6ff] text-[#3b82f6] font-semibold px-2 py-0.5 rounded-full">审计已启用</span>
            </div>
            <div className="flex-1 relative pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-[#e2e8f0]" />
              <div className="flex flex-col gap-5">
                {activityLogs.map((log, i) => (
                  <div key={i} className="relative z-10">
                    <div className="absolute -left-[22px] w-[18px] h-[18px] rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: log.dot }} />
                    </div>
                    <p className="text-[13px] font-medium text-[#0f172a]">{log.title}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{log.subtitle}</p>
                    <p className="text-[10px] text-[#94a3b8] mt-1">{log.time}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[#f1f5f9] mt-5 flex justify-between items-center">
              <span className="text-[11px] text-[#94a3b8]">SSL/TLS 加密保护</span>
              <button
                onClick={logout}
                className="text-[12px] text-[#ef4444] font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
