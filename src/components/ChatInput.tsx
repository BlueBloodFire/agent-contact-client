import { useState, useRef, useEffect } from 'react'
import { useContactStore } from '../stores/contactStore'

export function ChatInput() {
  const { sendMessage, isLoading, currentAgentId, inputText, setInputText } = useContactStore()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Pick up injected text from store (e.g. from BusinessView)
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
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
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className="shrink-0 border-t border-[#e5e7eb] bg-white p-3">
      <div className="flex items-end gap-2 bg-[#f8f9fb] border border-[#e5e7eb] rounded-xl px-3 py-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={currentAgentId ? '输入消息（Enter 发送，Shift+Enter 换行）' : '请先选择智能体'}
          disabled={!currentAgentId || isLoading}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-[#191c1e] placeholder-gray-400 disabled:opacity-50"
          style={{ maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading || !currentAgentId}
          className="shrink-0 px-3 py-1.5 bg-[#0052cc] text-white text-xs font-semibold rounded-lg hover:bg-[#003d9b] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isLoading ? '...' : '发送'}
        </button>
      </div>
      <p className="text-[10px] text-gray-400 mt-1 text-center font-medium">AI 生成内容仅供参考，如有疑问请联系人工客服</p>
    </div>
  )
}
