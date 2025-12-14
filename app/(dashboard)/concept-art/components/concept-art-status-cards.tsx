/**
 * Concept Art Status Cards Component
 */

import Link from 'next/link'
import { FileEdit, Clock, CheckCircle, XCircle, Archive } from 'lucide-react'

type AssetStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'

type Props = {
  stats: {
    total: number
    byStatus: Record<AssetStatus, number>
  }
  currentStatus?: string
}

const statusConfig = [
  { 
    key: 'DRAFT', 
    label: 'Черновик', 
    icon: FileEdit,
    color: 'from-[#5F646B]/20 to-[#5F646B]/10',
    textColor: 'text-[#8A8F96]',
    borderColor: 'border-[#5F646B]/30',
  },
  { 
    key: 'IN_REVIEW', 
    label: 'На проверке', 
    icon: Clock,
    color: 'from-[#A89C6A]/20 to-[#A89C6A]/5',
    textColor: 'text-[#A89C6A]',
    borderColor: 'border-[#A89C6A]/30',
  },
  { 
    key: 'APPROVED', 
    label: 'Утверждено', 
    icon: CheckCircle,
    color: 'from-[#4F5A3C]/25 to-[#4F5A3C]/10',
    textColor: 'text-[#7A8A5C]',
    borderColor: 'border-[#4F5A3C]/30',
  },
  { 
    key: 'REJECTED', 
    label: 'Отклонено', 
    icon: XCircle,
    color: 'from-[#5A1E1E]/25 to-[#5A1E1E]/10',
    textColor: 'text-[#9A4A4A]',
    borderColor: 'border-[#5A1E1E]/30',
  },
]

export function ConceptArtStatusCards({ stats, currentStatus }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statusConfig.map(({ key, label, icon: Icon, color, textColor, borderColor }) => {
        const count = stats.byStatus[key as AssetStatus] || 0
        const isActive = currentStatus === key
        
        return (
          <Link
            key={key}
            href={isActive ? '/concept-art' : `/concept-art?status=${key}`}
            className={`
              relative p-4 rounded-2xl border transition-all
              bg-gradient-to-br ${color}
              ${isActive ? borderColor : 'border-white/5'}
              hover:border-white/20
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className={`text-sm ${textColor}`}>{label}</p>
              </div>
              <Icon size={24} strokeWidth={1.5} className={textColor} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}

