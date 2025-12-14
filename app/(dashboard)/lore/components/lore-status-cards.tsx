/**
 * Lore Status Cards Component
 */

'use client'

import Link from 'next/link'
import { FileText, Clock, CheckCircle, XCircle, Archive } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

type AssetStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'

interface StatsData {
  total: number
  byStatus: Record<AssetStatus, number>
}

interface StatusCardsProps {
  stats: StatsData
  currentStatus?: string
}

export function LoreStatusCards({ stats, currentStatus }: StatusCardsProps) {
  const { locale } = useLocale()
  
  const statusCards = [
    { 
      status: 'DRAFT', 
      label: t('status.draft', locale), 
      icon: FileText,
      color: 'text-[#8A8F96]',
      bgColor: 'bg-[#5F646B]/20',
    },
    { 
      status: 'IN_REVIEW', 
      label: t('status.inReview', locale), 
      icon: Clock,
      color: 'text-[#A89C6A]',
      bgColor: 'bg-[#A89C6A]/20',
    },
    { 
      status: 'APPROVED', 
      label: t('status.approved', locale), 
      icon: CheckCircle,
      color: 'text-[#7A8A5C]',
      bgColor: 'bg-[#4F5A3C]/20',
    },
    { 
      status: 'REJECTED', 
      label: t('status.rejected', locale), 
      icon: XCircle,
      color: 'text-[#9A4A4A]',
      bgColor: 'bg-[#5A1E1E]/20',
    },
    { 
      status: 'ARCHIVED', 
      label: t('lore.archived', locale), 
      icon: Archive,
      color: 'text-[#8A8F96]',
      bgColor: 'bg-[#5F646B]/20',
    },
  ]
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statusCards.map(card => {
        const count = stats.byStatus[card.status as AssetStatus] || 0
        const isActive = currentStatus === card.status
        const Icon = card.icon
        
        return (
          <Link
            key={card.status}
            href={`/lore?status=${card.status}`}
            className={`glass-card p-4 transition-all hover:scale-[1.02] ${
              isActive ? 'ring-2 ring-[#A89C6A] bg-[#A89C6A]/10' : ''
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${card.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} strokeWidth={1.5} className={`${card.color} sm:w-5 sm:h-5`} />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-white">{count}</p>
                <p className="text-xs text-white/50 truncate">{card.label}</p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

