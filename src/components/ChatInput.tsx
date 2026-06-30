import { useState, useRef, useEffect } from 'react'
import { useContactStore } from '../stores/contactStore'
import { Send, Paperclip, Square, Globe } from 'lucide-react'

const ACCEPTED = 'image/jpeg,image/png,image/gif,image/webp,application/pdf'

export function ChatInput() {
  const {
    sendMessage, stopStream, isLoading, currentAgentId, inputText, setInputText,
    pendingFiles, setPendingFiles, webSearchEnabled, setWebSearchEnabled,
  } = useContactStore()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputText) {
      setText(inputText)
      setInputText('')
      textareaRef.current?.focus()
    }
  }, [inputText, setInputText])

  const handleSend = async () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading || !currentAgentId) return
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await sendMessage(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files ?? [])
    if (chosen.length === 0) return
    setPendingFiles([...pendingFiles, ...chosen].slice(0, 5))
    e.target.value = ''
  }

  const removeFile = (idx: number) => {
    setPendingFiles(pendingFiles.filter((_, i) => i !== idx))
  }

  return (
    <div className="shrink-0 bg-white border-t border-[#f1f5f9] px-6 py-3.5">
      <div className="w-full max-w-4xl mx-auto">
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {pendingFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white border border-[#d0dcff] rounded-lg px-2.5 py-1 text-xs text-[#3b82f6] max-w-[180px]">
                {f.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(f)} alt={f.name} className="w-5 h-5 object-cover rounded" />
                ) : (
                  <span className="text-[10px]">📄</span>
                )}
                <span className="truncate flex-1">{f.name}</span>
                <button onClick={() => removeFile(i)} className="shrink-0 text-gray-400 hover:text-red-400 cursor-pointer leading-none">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[14px] px-3.5 focus-within:border-[#3b82f6] transition-all" style={{ minHeight: '52px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!currentAgentId || isLoading}
            title="上传图片或文件（最多5个）"
            className="shrink-0 text-gray-400 hover:text-[#3b82f6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input ref={fileInputRef} type="file" accept={ACCEPTED} multiple className="hidden" onChange={handleFileChange} />

          <button
            onClick={() => setWebSearchEnabled(!webSearchEnabled)}
            disabled={!currentAgentId}
            title={webSearchEnabled ? '已开启联网搜索，点击关闭' : '点击开启联网搜索'}
            className={`shrink-0 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
              webSearchEnabled ? 'text-[#3b82f6]' : 'text-gray-400 hover:text-[#3b82f6]'
            }`}
          >
            <Globe className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={
              !currentAgentId ? '请先选择智能体'
              : webSearchEnabled ? '输入消息…（联网搜索已开启）'
              : '输入消息…（Enter 发送，Shift+Enter 换行）'
            }
            disabled={!currentAgentId || isLoading}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-[15px] text-[#191c1e] placeholder-gray-400 disabled:opacity-50 leading-relaxed py-3.5"
            style={{ maxHeight: '160px' }}
          />

          {isLoading ? (
            <button
              onClick={stopStream}
              title="停止响应"
              className="shrink-0 w-8 h-8 flex items-center justify-center bg-[#dc2626] text-white rounded-xl hover:bg-[#b91c1c] transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!text.trim() || !currentAgentId}
              className="shrink-0 w-8 h-8 flex items-center justify-center bg-[#3b82f6] text-white rounded-[9px] hover:bg-[#2563eb] disabled:bg-[#cbd5e1] disabled:cursor-default transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 mt-1.5">
          {webSearchEnabled && (
            <span className="text-[11px] text-[#3b82f6] font-medium flex items-center gap-1">
              <Globe className="w-3 h-3" /> 联网搜索已开启
            </span>
          )}
          <p className="text-[11px] text-gray-400 font-medium">AI 生成内容仅供参考，如有疑问请联系人工客服</p>
        </div>
      </div>
    </div>
  )
}
