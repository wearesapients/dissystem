/**
 * Lore Card Component
 */

'use client'

import Link from 'next/link'
import { Link2, MessageSquare, History, User, Tag } from 'lucide-react'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { t, getEntityTypeLabel } from '@/lib/i18n'
import { LORE_TYPE_LABELS, LoreType } from '@/lib/lore/service'

type Entity = {
  id: string
  code: string
  name: string
  type: string
}

type LinkedEntity = {
  entity: Entity
}

type LoreEntry = {
  id: string
  title: string
  summary: string | null
  content: string
  loreType: LoreType
  status: string
  version: number
  tags: string[]
  updatedAt: Date
  createdBy: {
    id: string
    name: string
    avatarUrl: string | null
  }
  entity: Entity | null
  linkedEntities: LinkedEntity[]
  _count: {
    comments: number
    versions: number
  }
}

interface LoreCardProps {
  entry: LoreEntry
}

export function LoreCard({ entry }: LoreCardProps) {
  const { locale } = useLocale()
  
  // Collect all linked entities
  const allEntities: Entity[] = []
  if (entry.entity) allEntities.push(entry.entity)
  entry.linkedEntities.forEach(le => {
    if (!allEntities.find(e => e.id === le.entity.id)) {
      allEntities.push(le.entity)
    }
  })
  
  const loreTypeLabel = LORE_TYPE_LABELS[entry.loreType]?.[locale] || entry.loreType
  
  // Preview text
  const previewText = entry.summary || entry.content.substring(0, 150) + (entry.content.length > 150 ? '...' : '')
  
  return (
    <Link 
      href={`/lore/${entry.id}`}
      className="glass-card p-5 hover:bg-white/[0.08] transition-all group block"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#3E2F45]/30 text-[#8A6A9A] rounded text-xs font-medium">
              {loreTypeLabel}
            </span>
            <StatusBadge status={entry.status} />
            <span className="text-xs text-white/40">v{entry.version}</span>
          </div>
          <h3 className="font-semibold text-white group-hover:text-[#A89C6A] transition-colors line-clamp-2">
            {entry.title}
          </h3>
        </div>
      </div>
      
      {/* Preview */}
      <p className="text-sm text-white/60 line-clamp-2 mb-4">
        {previewText}
      </p>
      
      {/* Linked Entities */}
      {allEntities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {allEntities.slice(0, 3).map(entity => (
            <span 
              key={entity.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg text-xs text-white/60"
            >
              <Link2 size={10} strokeWidth={1.5} />
              <span>{entity.name}</span>
              <span className="text-white/30">({getEntityTypeLabel(entity.type, locale)})</span>
            </span>
          ))}
          {allEntities.length > 3 && (
            <span className="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/40">
              +{allEntities.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {entry.tags.slice(0, 4).map(tag => (
            <span 
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded text-xs text-white/50"
            >
              <Tag size={10} strokeWidth={1.5} />
              {tag}
            </span>
          ))}
          {entry.tags.length > 4 && (
            <span className="px-2 py-0.5 text-xs text-white/30">
              +{entry.tags.length - 4}
            </span>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-white/40 pt-3 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <User size={12} strokeWidth={1.5} />
            {entry.createdBy.name}
          </span>
          <span>{formatRelativeTime(entry.updatedAt)}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {entry._count.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={12} strokeWidth={1.5} />
              {entry._count.comments}
            </span>
          )}
          {entry._count.versions > 1 && (
            <span className="flex items-center gap-1">
              <History size={12} strokeWidth={1.5} />
              {entry._count.versions}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

