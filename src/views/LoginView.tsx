import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Sparkles } from 'lucide-react'

export function LoginView() {
  const { login } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!username.trim()) { setError('请输入用户名'); return }
    if (!password.trim()) { setError('请输入密码'); return }
    login(username.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen flex bg-[#f8f9fb]">
      <div className="hidden md:flex w-5/12 bg-gradient-to-br from-[#0052cc] to-[#003d9b] flex-col items-center justify-center p-12 text-white">
        <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">智能客服平台</h1>
        <p className="text-blue-200 text-sm mb-10 text-center font-medium">AI 驱动的一站式企业客服解决方案</p>
        <ul className="space-y-4 text-sm w-full max-w-xs">
          {[
            '多轮对话，精准理解用户需求',
            '业务自助办理，高效快捷',
            '智能问题解答，7×24 小时在线',
            'PPT / Word 文档一键生成',
          ].map((feat) => (
            <li key={feat} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-xs font-bold shrink-0">✓</span>
              <span className="text-blue-100">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] w-full max-w-sm p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-[#191c1e] tracking-tight">欢迎登录</h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">请输入您的账号信息</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                placeholder="请输入用户名"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#0052cc] focus:border-[#0052cc] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                placeholder="请输入密码"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#0052cc] focus:border-[#0052cc] transition-all"
              />
            </div>

            {error && <p className="text-xs text-[#de350b] font-medium">{error}</p>}

            <button
              onClick={handleLogin}
              className="w-full py-2.5 bg-[#0052cc] text-white rounded-lg text-sm font-semibold hover:bg-[#003d9b] active:scale-[0.98] transition-all duration-150 shadow-sm mt-2 cursor-pointer"
            >
              登 录
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-6 font-medium">首次登录将自动创建账号</p>
        </div>
      </div>
    </div>
  )
}
