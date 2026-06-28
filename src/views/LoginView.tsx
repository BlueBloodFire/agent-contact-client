import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'

export function LoginView() {
  const { login } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim()) { setError('请输入用户名'); return }
    if (!password.trim()) { setError('请输入密码'); return }
    setLoading(true)
    const result = await login(username.trim(), password.trim())
    setLoading(false)
    if (!result.success) {
      setError(result.error || '登录失败')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  const features = [
    '多轮对话理解，精准响应用户需求',
    '业务自助办理，7×24 小时在线服务',
    '知识库管理，持续优化服务质量',
    '文档一键生成，工作效率倍增',
  ]

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Left panel */}
      <div className="hidden md:flex w-[44%] bg-[#0f172a] flex-col justify-center px-16">
        <div className="w-11 h-11 bg-[rgba(59,130,246,0.2)] border border-[rgba(59,130,246,0.4)] rounded-xl flex items-center justify-center mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" className="w-5.5 h-5.5 w-[22px] h-[22px]">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-[32px] font-bold text-[#f8fafc] leading-tight tracking-tight mb-3">智能客服平台</h1>
        <p className="text-sm text-[#64748b] mb-12 leading-relaxed">AI 驱动的一站式企业客服解决方案，让每一次对话都更高效</p>
        <div className="flex flex-col gap-5">
          {features.map((feat) => (
            <div key={feat} className="flex items-center gap-3.5">
              <div className="w-2 h-2 rounded-full bg-[#3b82f6] shrink-0" />
              <span className="text-[13px] text-[#94a3b8]">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-12 bg-[#f8fafc]">
        <div className="w-full max-w-[380px]">
          <h2 className="text-[26px] font-bold text-[#0f172a] tracking-tight mb-2">欢迎回来</h2>
          <p className="text-sm text-[#64748b] mb-8">登录以继续使用智能客服工作台</p>

          <div className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                placeholder="请输入用户名"
                className="w-full px-3.5 py-[11px] border border-[#e2e8f0] rounded-[10px] text-sm text-[#0f172a] bg-white outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all placeholder-[#94a3b8]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                placeholder="请输入密码"
                className="w-full px-3.5 py-[11px] border border-[#e2e8f0] rounded-[10px] text-sm text-[#0f172a] bg-white outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all placeholder-[#94a3b8]"
              />
            </div>

            {error && <p className="text-xs text-[#ef4444]">{error}</p>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 bg-[#3b82f6] text-white rounded-[10px] text-sm font-semibold hover:bg-[#2563eb] active:scale-[0.98] transition-all mt-1 cursor-pointer disabled:opacity-60"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>

          <p className="text-xs text-[#94a3b8] text-center mt-5">请联系管理员获取账号</p>
        </div>
      </div>
    </div>
  )
}
