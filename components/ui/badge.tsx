/**
 * Badge Component - iOS Style
 */

import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-[#6A665E]/15 text-[#9C9688] border-[#6A665E]/20',
  success: 'bg-[#4F5A3C]/20 text-[#7A8A5C] border-[#4F5A3C]/25',
  warning: 'bg-[#A89C6A]/15 text-[#A89C6A] border-[#A89C6A]/25',
  danger: 'bg-[#5A1E1E]/20 text-[#9A4A4A] border-[#5A1E1E]/30',
  info: 'bg-[#3B4F52]/20 text-[#6B8F94] border-[#3B4F52]/25',
  purple: 'bg-[#3E2F45]/25 text-[#8A6A9A] border-[#3E2F45]/30',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

// Entity type badge
const entityColors: Record<string, string> = {
  UNIT: 'entity-unit',
  HERO: 'entity-hero',
  FACTION: 'entity-faction',
  SPELL: 'entity-spell',
  ARTIFACT: 'entity-artifact',
  LOCATION: 'entity-location',
  OBJECT: 'bg-white/10 text-white/60',
  OTHER: 'bg-white/10 text-white/60',
}

const entityLabels: Record<string, string> = {
  UNIT: 'Юнит',
  HERO: 'Герой',
  FACTION: 'Фракция',
  SPELL: 'Заклинание',
  ARTIFACT: 'Артефакт',
  LOCATION: 'Локация',
  OBJECT: 'Объект',
  OTHER: 'Другое',
}

export function EntityBadge({ type }: { type: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium',
      entityColors[type] || entityColors.OTHER
    )}>
      {entityLabels[type] || type}
    </span>
  )
}

// Status badge
const statusColors: Record<string, string> = {
  DRAFT: 'status-draft',
  PENDING: 'status-pending',
  IN_REVIEW: 'status-in_review',
  IN_PROGRESS: 'status-in_progress',
  APPROVED: 'status-approved',
  REJECTED: 'status-rejected',
  ARCHIVED: 'status-draft',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Черновик',
  PENDING: 'На утверждении',
  IN_REVIEW: 'На проверке',
  IN_PROGRESS: 'В работе',
  APPROVED: 'Утверждено',
  REJECTED: 'Отклонено',
  ARCHIVED: 'В архиве',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border',
      statusColors[status] || statusColors.DRAFT
    )}>
      {statusLabels[status] || status}
    </span>
  )
}


