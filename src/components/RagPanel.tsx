import { useState, useEffect, useRef } from 'react'
import { Database, Upload, ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { uploadRagDocument, listRagDocuments } from '../api/agentApi'

interface Props {
  agentId: string | null
}

export function RagPanel({ agentId }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [docs, setDocs] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (expanded && agentId) {
      listRagDocuments(agentId).then(setDocs)
    }
  }, [expanded, agentId])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !agentId) return
    setUploading(true)
    setMsg('')
    const result = await uploadRagDocument(agentId, file)
    setMsg(result.message || (result.success ? '上传成功' : '上传失败'))
    if (result.success) {
      const newDocs = await listRagDocuments(agentId)
      setDocs(newDocs)
    }
    setUploading(false)
    e.target.value = ''
  }

  if (!agentId) return null

  return (
    <div className="border-t border-gray-100 mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <Database className="w-3 h-3" />
        <span className="font-semibold">知识库</span>
        {docs.length > 0 && (
          <span className="ml-auto text-[10px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded-full">{docs.length}</span>
        )}
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {docs.length === 0 ? (
            <p className="text-[10px] text-gray-400 py-1">暂无文档</p>
          ) : (
            <ul className="space-y-1">
              {docs.map((doc) => (
                <li key={doc} className="flex items-center gap-1.5 text-[10px] text-gray-600 truncate">
                  <FileText className="w-3 h-3 shrink-0 text-gray-400" />
                  <span className="truncate">{doc}</span>
                </li>
              ))}
            </ul>
          )}
          {msg && <p className={`text-[10px] font-medium ${msg.includes('成功') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-dashed border-gray-300 rounded-lg text-[10px] text-gray-500 hover:border-[#0052cc] hover:text-[#0052cc] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3 h-3" />
            {uploading ? '上传中...' : '上传文档'}
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md,.docx" className="hidden" onChange={handleUpload} />
        </div>
      )}
    </div>
  )
}
