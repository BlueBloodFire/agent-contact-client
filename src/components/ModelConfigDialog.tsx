import { useState, useEffect } from 'react'
import { X, Settings, Loader2 } from 'lucide-react'
import { post } from '../api/request'
import { getModelConfig } from '../api/agentApi'
import { useAuthStore } from '../stores/authStore'

interface Props {
  agentId: string
  agentName: string
  onClose: () => void
}

export function ModelConfigDialog({ agentId, agentName, onClose }: Props) {
  const userId = useAuthStore((s) => s.userId)
  const [baseUrl, setBaseUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // 打开时加载用户已保存的配置
  useEffect(() => {
    setLoading(true)
    getModelConfig(agentId, userId)
      .then((cfg) => {
        if (cfg) {
          setBaseUrl(cfg.baseUrl ?? '')
          setApiKey(cfg.apiKey ?? '')
          setModel(cfg.model ?? '')
        } else {
          // 无历史配置时给出常用默认值
          setBaseUrl('https://api.deepseek.com')
          setModel('deepseek-chat')
        }
      })
      .catch(() => {
        setBaseUrl('https://api.deepseek.com')
        setModel('deepseek-chat')
      })
      .finally(() => setLoading(false))
  }, [agentId, userId])

  const handleSave = async () => {
    if (!baseUrl.trim() || !apiKey.trim() || !model.trim()) {
      setMsg('请填写所有字段')
      return
    }
    setSaving(true)
    try {
      const res = await post<void>('/api/v1/update_model_config', { userId, agentId, baseUrl, apiKey, model })
      if (res.code === '0000') {
        setMsg('保存成功')
        setTimeout(onClose, 800)
      } else {
        setMsg(res.info || '保存失败')
      }
    } catch {
      setMsg('网络错误')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0052cc]" />
            <h2 className="text-base font-bold text-[#191c1e]">模型配置 — {agentName}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">加载配置中…</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">API 地址 (Base URL)</label>
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.deepseek.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#0052cc] focus:border-[#0052cc] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#0052cc] focus:border-[#0052cc] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">模型名称</label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="deepseek-chat / gpt-4o / ..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#0052cc] focus:border-[#0052cc] transition-all"
              />
              <p className="text-[10px] text-gray-400 mt-1">支持任何 OpenAI 兼容接口的模型名称</p>
            </div>

            {msg && (
              <p className={`text-xs font-medium ${msg.includes('成功') ? 'text-green-600' : 'text-red-500'}`}>
                {msg}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-[#0052cc] text-white rounded-lg text-sm font-semibold hover:bg-[#003d9b] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {saving ? '保存中...' : '保存配置'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
