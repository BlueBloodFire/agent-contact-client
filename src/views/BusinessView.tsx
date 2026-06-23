import { navigate } from '../router'
import { Receipt, Package, Edit3, FileText, CalendarCheck, MessageCircle, Search, FileCheck, ArrowRight } from 'lucide-react'

interface Service {
  icon: React.ReactNode
  title: string
  desc: string
  prompt: string
  color: string
  bg: string
}

const SERVICES: Service[] = [
  { icon: <Receipt className="w-5 h-5" />, title: '账单查询', desc: '查看账单详情与历史记录', prompt: '我想查询我的账单信息', color: 'text-[#0052cc]', bg: 'bg-[#0052cc]/10' },
  { icon: <Package className="w-5 h-5" />, title: '订单查询', desc: '查询订单状态与物流信息', prompt: '我想查询我的订单状态', color: 'text-[#36b37e]', bg: 'bg-[#36b37e]/10' },
  { icon: <Edit3 className="w-5 h-5" />, title: '信息修改', desc: '修改个人信息与账户设置', prompt: '我想修改我的个人信息', color: 'text-[#4c3398]', bg: 'bg-[#4c3398]/10' },
  { icon: <FileText className="w-5 h-5" />, title: '业务申请', desc: '申请新业务或开通服务', prompt: '我想申请一项新业务', color: 'text-[#ffab00]', bg: 'bg-[#ffab00]/10' },
  { icon: <FileCheck className="w-5 h-5" />, title: '凭证开具', desc: '申请开具发票或证明文件', prompt: '我需要开具发票或证明文件', color: 'text-[#0052cc]', bg: 'bg-[#0052cc]/10' },
  { icon: <CalendarCheck className="w-5 h-5" />, title: '预约办理', desc: '预约线下窗口办理业务', prompt: '我想预约线下窗口办理业务', color: 'text-[#36b37e]', bg: 'bg-[#36b37e]/10' },
  { icon: <MessageCircle className="w-5 h-5" />, title: '投诉建议', desc: '提交投诉或意见建议', prompt: '我有一个投诉要提交', color: 'text-[#de350b]', bg: 'bg-[#de350b]/10' },
  { icon: <Search className="w-5 h-5" />, title: '工单查询', desc: '查询已提交工单处理进度', prompt: '我想查询我的工单处理进度', color: 'text-[#4c3398]', bg: 'bg-[#4c3398]/10' },
]

export function BusinessView() {
  const handleServiceClick = (prompt: string) => {
    localStorage.setItem('contact_pending_message', prompt)
    navigate('chat')
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">业务办理大厅</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">选择服务类型，由 AI 助手协助您快速办理</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {SERVICES.map((svc) => (
          <button
            key={svc.title}
            onClick={() => handleServiceClick(svc.prompt)}
            className="bg-white border border-[#e5e7eb] rounded-xl p-4 text-left hover:shadow-md hover:border-gray-300 transition-all group shadow-2xs cursor-pointer"
          >
            <div className={`w-9 h-9 ${svc.bg} ${svc.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              {svc.icon}
            </div>
            <p className="font-bold text-[#191c1e] text-xs">{svc.title}</p>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed font-medium">{svc.desc}</p>
            <span className={`text-[10px] font-bold ${svc.color} mt-2 flex items-center gap-1 group-hover:gap-2 transition-all`}>
              立即办理 <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        ))}
      </div>

      <div className="bg-[#ffab00]/5 border border-[#ffab00]/30 rounded-xl p-4">
        <p className="text-xs font-bold text-[#ffab00]">温馨提示</p>
        <p className="text-xs text-[#191c1e]/70 mt-1 font-medium">
          如遇复杂问题，AI 将自动为您生成工单并联系人工客服处理，通常 1-2 个工作日内回复。
        </p>
      </div>
    </div>
  )
}
