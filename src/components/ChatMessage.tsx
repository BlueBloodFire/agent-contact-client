import { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Check, Copy } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '../types'

interface Props {
  message: ChatMessageType
}

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [children])

  const lang = className?.replace('language-', '') ?? ''

  return (
    <div className="relative group my-2 rounded-xl overflow-hidden border border-[#e5e7eb] bg-[#1e1e2e]">
      {lang && (
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#16161f] border-b border-[#2d2d3d]">
          <span className="text-[10px] text-[#6e6e8a] font-mono uppercase tracking-wider">{lang}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-[#6e6e8a] hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? '已复制' : '复制'}
          </button>
        </div>
      )}
      {!lang && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-[#6e6e8a] hover:text-white transition-all cursor-pointer bg-[#2d2d3d] px-2 py-1 rounded"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
      <pre className="!m-0 !rounded-none overflow-x-auto">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* 头像 */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
        isUser ? 'bg-[#0052cc] text-white' : 'bg-[#4c3398] text-white'
      }`}>
        {isUser ? '我' : 'AI'}
      </div>

      {/* 消息内容 */}
      <div className={`flex-1 min-w-0 ${isUser ? 'flex flex-col items-end' : ''}`}>
        {message.attachments && message.attachments.length > 0 && (
          <div className={`flex flex-wrap gap-1.5 mb-2 ${isUser ? 'justify-end' : ''}`}>
            {message.attachments.map((att, i) =>
              att.previewUrl ? (
                <img
                  key={i}
                  src={att.previewUrl}
                  alt={att.name}
                  className="max-h-40 max-w-[220px] rounded-xl object-cover border border-gray-200"
                />
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-600"
                >
                  <span>📄</span>
                  <span className="truncate max-w-[120px]">{att.name}</span>
                </div>
              )
            )}
          </div>
        )}

        {isUser ? (
          <div className="bg-[#0052cc] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed max-w-[80%] break-words">
            <span className="whitespace-pre-wrap">{message.content}</span>
          </div>
        ) : (
          <div className="text-[#191c1e] text-sm leading-relaxed max-w-full overflow-hidden">
            {message.streaming && !message.content ? (
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-2 h-2 bg-[#4c3398] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-[#4c3398] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-[#4c3398] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-headings:mt-3 prose-headings:mb-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({ children, className, ...rest }) {
                      const inline = !className
                      if (inline) {
                        return (
                          <code
                            className="text-[#4c3398] bg-[#f3e0ff] px-1 py-0.5 rounded text-[0.85em] font-mono"
                            {...rest}
                          >
                            {children}
                          </code>
                        )
                      }
                      return (
                        <CodeBlock className={className}>
                          {String(children).replace(/\n$/, '')}
                        </CodeBlock>
                      )
                    },
                    pre({ children }) {
                      return <>{children}</>
                    },
                    a({ href, children }) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0052cc] underline underline-offset-2 hover:text-[#003d9b]"
                        >
                          {children}
                        </a>
                      )
                    },
                  }}
                >
                  {message.content || ''}
                </ReactMarkdown>
                {message.streaming && (
                  <span className="inline-block w-0.5 h-4 bg-[#4c3398] ml-0.5 animate-pulse align-text-bottom" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
