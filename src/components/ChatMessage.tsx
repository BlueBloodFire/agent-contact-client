import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage as ChatMessageType } from '../types'

interface Props {
  message: ChatMessageType
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs shrink-0 mr-2 mt-0.5">
          AI
        </div>
      )}
      <div
        className={`max-w-[72%] rounded-2xl px-3 py-2 text-sm leading-relaxed
          ${isUser
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm'
          }`}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap">{message.content}</span>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-pre:my-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || (message.streaming ? '▋' : '')}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-zinc-300 flex items-center justify-center text-zinc-600 text-xs shrink-0 ml-2 mt-0.5">
          我
        </div>
      )}
    </div>
  )
}
