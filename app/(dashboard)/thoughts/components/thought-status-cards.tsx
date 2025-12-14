/**
 * Thought Status Cards - Compact, Clickable, Localized
 */

'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { 
  LayoutGrid, FileEdit, Clock, Loader, CheckCircle, XCircle,
  LucideIcon
} from 'lucide-react'

interface ThoughtStatusCardsProps {
  stats: {
    total: number
    byStatus: Record<string, number>
  }
  currentStatus?: string
}

type StatusConfig = {
  key: string
  labelKey: string
  icon: LucideIcon
  color: string
  activeBg: string
  bg: string
}

const statusConfigs: StatusConfig[] = [
  { 
    key: 'DRAFT', 
    labelKey: 'stats.drafts', 
    icon: FileEdit, 
    color: '#8A8F96',
    bg: 'from-[#5F646B]/10 to-[#5F646B]/5',
    activeBg: 'from-[#5F646B]/30 to-[#5F646B]/20',
  },
  { 
    key: 'PENDING', 
    labelKey: 'stats.pending', 
    icon: Clock, 
    color: '#A89C6A',
    bg: 'from-[#A89C6A]/10 to-[#A89C6A]/5',
    activeBg: 'from-[#A89C6A]/30 to-[#A89C6A]/20',
  },
  { 
    key: 'IN_PROGRESS', 
    labelKey: 'stats.inProgress', 
    icon: Loader, 
    color: '#6B8F94',
    bg: 'from-[#3B4F52]/15 to-[#3B4F52]/5',
    activeBg: 'from-[#3B4F52]/35 to-[#3B4F52]/20',
  },
  { 
    key: 'APPROVED', 
    labelKey: 'stats.approved', 
    icon: CheckCircle, 
    color: '#7A8A5C',
    bg: 'from-[#4F5A3C]/15 to-[#4F5A3C]/5',
    activeBg: 'from-[#4F5A3C]/35 to-[#4F5A3C]/20',
  },
  { 
    key: 'REJECTED', 
    labelKey: 'stats.rejected', 
    icon: XCircle, 
    color: '#9A4A4A',
    bg: 'from-[#5A1E1E]/15 to-[#5A1E1E]/5',
    activeBg: 'from-[#5A1E1E]/35 to-[#5A1E1E]/20',
  },
]

export function ThoughtStatusCards({ stats, currentStatus }: ThoughtStatusCardsProps) {
  const { locale } = useLocale()
  
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      {/* All */}
      <Link 
        href="/thoughts"
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-br transition-all hover:scale-[1.02] ${
          !currentStatus 
            ? 'from-white/20 to-white/10 ring-2 ring-offset-2 ring-offset-[#0B0B0C] ring-white/50'
            : 'from-white/10 to-white/5'
        }`}
      >
        <LayoutGrid size={18} strokeWidth={1.5} className="text-white/70" />
        <span className="font-semibold text-white">{stats.total}</span>
        <span className="text-sm text-white/60">{t('common.all', locale)}</span>
      </Link>
      
      {/* Status cards */}
      {statusConfigs.map(config => {
        const count = stats.byStatus[config.key] || 0
        const Icon = config.icon
        const isActive = currentStatus === config.key
        
        return (
          <Link 
            key={config.key}
            href={isActive ? '/thoughts' : `/thoughts?status=${config.key}`}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-br transition-all hover:scale-[1.02] ${
              isActive 
                ? `${config.activeBg} ring-2 ring-offset-2 ring-offset-[#0B0B0C]`
                : config.bg
            }`}
            style={{ ['--tw-ring-color' as string]: config.color }}
          >
            <Icon size={18} strokeWidth={1.5} style={{ color: config.color }} />
            <span className="font-semibold text-white">{count}</span>
            <span className="text-sm text-white/60">{t(config.labelKey, locale)}</span>
          </Link>
        )
      })}
    </div>
  )
}

