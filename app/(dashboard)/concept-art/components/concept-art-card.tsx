/**
 * Concept Art Card Component
 */

'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { MessageSquare, Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, Palette } from 'lucide-react'

type AssetStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'
type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'

type ConceptArtCardProps = {
  art: {
    id: string
    title: string
    description: string | null
    imageUrl: string
    status: AssetStatus
    tags: string[]
    createdAt: Date
    createdBy: { name: string }
    entity: { code: string; name: string; type: GameEntityType } | null
    _count: { comments: number }
  }
}

const statusLabels: Record<AssetStatus, string> = {
  DRAFT: 'Черновик',
  IN_REVIEW: 'На проверке',
  APPROVED: 'Утверждено',
  REJECTED: 'Отклонено',
  ARCHIVED: 'В архиве',
}

const entityTypeLabels: Record<GameEntityType, string> = {
  UNIT: 'Юнит',
  HERO: 'Герой',
  FACTION: 'Фракция',
  SPELL: 'Заклинание',
  ARTIFACT: 'Артефакт',
  LOCATION: 'Локация',
  OBJECT: 'Объект',
  OTHER: 'Другое',
}

function EntityIcon({ type }: { type: GameEntityType }) {
  const iconProps = { size: 12, strokeWidth: 1.5, className: 'text-white/40' }
  
  switch (type) {
    case 'UNIT': return <Swords {...iconProps} />
    case 'HERO': return <Crown {...iconProps} />
    case 'FACTION': return <Castle {...iconProps} />
    case 'SPELL': return <Sparkles {...iconProps} />
    case 'ARTIFACT': return <Gem {...iconProps} />
    case 'LOCATION': return <MapPin {...iconProps} />
    case 'OBJECT': return <Box {...iconProps} />
    default: return <HelpCircle {...iconProps} />
  }
}

export function ConceptArtCard({ art }: ConceptArtCardProps) {
  return (
    <Link href={`/concept-art/${art.id}`} className="block group">
      <div className="glass-card overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-white/5 to-white/10 overflow-hidden flex items-center justify-center">
          {art.imageUrl ? (
            <img
              src={art.imageUrl}
              alt={art.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Palette size={48} strokeWidth={1} className="text-white/20" />
          )}
          
          {/* Status badge overlay */}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border backdrop-blur-md bg-black/30 status-${art.status.toLowerCase().replace('_', '-')}`}>
              {statusLabels[art.status]}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-white line-clamp-1 mb-1">
            {art.title}
          </h3>
          
          {art.description && (
            <p className="text-sm text-white/50 line-clamp-2 mb-3">
              {art.description}
            </p>
          )}
          
          {/* Entity link */}
          {art.entity && (
            <div className="mb-3 py-2 px-3 bg-white/5 rounded-xl flex items-center gap-2 text-xs">
              <EntityIcon type={art.entity.type} />
              <span className="text-white/40">{entityTypeLabels[art.entity.type]}:</span>
              <span className="text-[#A89C6A] font-medium truncate">{art.entity.name}</span>
            </div>
          )}
          
          {/* Tags */}
          {art.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {art.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-md text-xs text-white/60">
                  {tag}
                </span>
              ))}
              {art.tags.length > 3 && (
                <span className="text-xs text-white/40">+{art.tags.length - 3}</span>
              )}
            </div>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
            <span className="text-xs text-white/40">{art.createdBy.name}</span>
            <div className="flex items-center gap-3 text-xs text-white/40">
              {art._count.comments > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} strokeWidth={1.5} />
                  {art._count.comments}
                </span>
              )}
              <span>{formatRelativeTime(art.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}


