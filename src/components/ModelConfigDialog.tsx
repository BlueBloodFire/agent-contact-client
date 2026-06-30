import { useState, useEffect } from 'react'
import { X, Settings, Plus, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { post } from '../api/request'
import { useAuthStore } from '../stores/authStore'
import type { ModelConfigEntry } from '../types'

interface Props {
  agentId: string
  agentName: string
  onClose: () => void
  onSaved?: () => void
}

function storageKey(agentId: string) {
  return `contact_model_configs_${agentId}`
}
function activeKey(agentId: string) {
  return `contact_model_active_${agentId}`
}

export function loadConfigs(agentId: string): ModelConfigEntry[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey(agentId)) || '[]')
  } catch { return [] }
}

export function getActiveConfigId(agentId: string): string | null {
  return localStorage.getItem(activeKey(agentId))
}

export function getActiveConfig(agentId: string): ModelConfigEntry | null {
  const configs = loadConfigs(agentId)
  const activeId = getActiveConfigId(agentId)
  return configs.find((c) => c.id === activeId) ?? (configs.length > 0 ? configs[0] : null)
}

export function ModelConfigDialog({ agentId, agentName, onClose, onSaved }: Props) {
  const userId = useAuthStore((s) => s.userId)
  const [configs, setConfigs] = useState<ModelConfigEntry[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [formName, setFormName] = useState('')
  const [formBaseUrl, setFormBaseUrl] = useState('https://api.deepseek.com')
  const [formApiKey, setFormApiKey] = useState('')
  const [formModel, setFormModel] = useState('deepseek-chat')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const saved = loadConfigs(agentId)
    setConfigs(saved)
    setActiveId(getActiveConfigId(agentId) ?? saved[0]?.id ?? null)
  }, [agentId])

  const persistConfigs = (list: ModelConfigEntry[]) => {
    localStorage.setItem(storageKey(agentId), JSON.stringify(list))
    setConfigs(list)
  }

  const syncActiveToServer = async (cfg: ModelConfigEntry) => {
    setSaving(true)
    try {
      await post('/api/v1/update_model_config', {
        userId, agentId,
        baseUrl: cfg.baseUrl, apiKey: cfg.apiKey, model: cfg.model,
      })
    } catch {}
    setSaving(false)
  }

  const handleSelect = async (id: string) => {
    setActiveId(id)
    localStorage.setItem(activeKey(agentId), id)
    const cfg = configs.find((c) => c.id === id)
    if (cfg) await syncActiveToServer(cfg)
    setMsg('已切换模型：' + cfg?.model)
    setTimeout(() => { onSaved?.(); onClose() }, 700)
  }

  const openAdd = () => {
    setEditId(null)
    setFormName('')
    setFormBaseUrl('https://api.deepseek.com')
    setFormApiKey('')
    setFormModel('deepseek-chat')
    setMsg('')
    setShowForm(true)
  }

  const openEdit = (cfg: ModelConfigEntry) => {
    setEditId(cfg.id)
    setFormName(cfg.name)
    setFormBaseUrl(cfg.baseUrl)
    setFormApiKey(cfg.apiKey)
    setFormModel(cfg.model)
    setMsg('')
    setShowForm(true)
  }

  const handleSaveForm = async () => {
    if (!formBaseUrl.trim() || !formApiKey.trim() || !formModel.trim()) {
      setMsg('请填写所有必填字段')
      return
    }
    setSaving(true)
    const id = editId ?? `cfg_${Date.now()}`
    const name = formName.trim() || formModel.trim()
    const entry: ModelConfigEntry = { id, name, baseUrl: formBaseUrl.trim(), apiKey: formApiKey.trim(), model: formModel.trim() }
    const updated = editId
      ? configs.map((c) => c.id === editId ? entry : c)
      : [...configs, entry]
    persistConfigs(updated)

    // 若是第一个配置或当前活跃，同步到服务端
    const isFirst = configs.length === 0 && !editId
    if (isFirst || activeId === editId) {
      await syncActiveToServer(entry)
      if (isFirst) {
        setActiveId(id)
        localStorage.setItem(activeKey(agentId), id)
      }
    }
    setSaving(false)
    setShowForm(false)
    setMsg(editId ? '配置已更新' : '配置已添加')
    setTimeout(() => setMsg(''), 1500)
  }

  const handleDelete = (id: string) => {
    const updated = configs.filter((c) => c.id !== id)
    persistConfigs(updated)
    if (activeId === id) {
      const newActive = updated[0]?.id ?? null
      setActiveId(newActive)
      if (newActive) localStorage.setItem(activeKey(agentId), newActive)
      else localStorage.removeItem(activeKey(agentId))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0052cc]" />
            <h2 className="text-base font-bold text-[#191c1e]">模型配置 — {agentName}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Config list */}
        {configs.length === 0 && !showForm && (
          <div className="text-sm text-gray-400 text-center py-6">暂无模型配置，请添加</div>
        )}

        {configs.length > 0 && (
          <div className="space-y-2 mb-4">
            {configs.map((cfg) => (
              <div
                key={cfg.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  activeId === cfg.id ? 'border-[#3b82f6] bg-[#eff6ff]' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelect(cfg.id)}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  activeId === cfg.id ? 'border-[#3b82f6] bg-[#3b82f6]' : 'border-gray-300'
                }`}>
                  {activeId === cfg.id && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0f172a] truncate">{cfg.name}</p>
                  <p className="text-xs text-gray-500 truncate">{cfg.baseUrl} · {cfg.model}</p>
                </div>
                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => openEdit(cfg)}
                    className="text-xs text-gray-400 hover:text-[#3b82f6] px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(cfg.id)}
                    className="text-gray-300 hover:text-red-400 cursor-pointer p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add button */}
        {!showForm && (
          <button
            onClick={openAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors cursor-pointer mb-3"
          >
            <Plus className="w-4 h-4" />
            添加新模型配置
          </button>
        )}

        {/* Inline form */}
        {showForm && (
          <div className="border border-[#d0dcff] rounded-xl p-4 mb-3 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-[#0f172a]">{editId ? '编辑配置' : '新增配置'}</p>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">配置名称（可选）</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="例：DeepSeek / GPT-4o" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#3b82f6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">API 地址 <span className="text-red-400">*</span></label>
              <input value={formBaseUrl} onChange={(e) => setFormBaseUrl(e.target.value)} placeholder="https://api.deepseek.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#3b82f6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">API Key <span className="text-red-400">*</span></label>
              <input type="password" value={formApiKey} onChange={(e) => setFormApiKey(e.target.value)} placeholder="sk-..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#3b82f6]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">模型名称 <span className="text-red-400">*</span></label>
              <input value={formModel} onChange={(e) => setFormModel(e.target.value)} placeholder="deepseek-chat / gpt-4o / ..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#3b82f6]" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-200 text-gray-500 rounded-lg text-sm hover:bg-gray-50 cursor-pointer">取消</button>
              <button onClick={handleSaveForm} disabled={saving} className="flex-1 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-semibold hover:bg-[#2563eb] disabled:opacity-50 cursor-pointer">
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        )}

        {msg && (
          <p className={`text-xs text-center font-medium mt-1 ${msg.includes('失败') || msg.includes('请填写') ? 'text-red-500' : 'text-green-600'}`}>{msg}</p>
        )}
      </div>
    </div>
  )
}
