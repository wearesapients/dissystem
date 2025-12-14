/**
 * Thought Card Component - With Line Icons
 */

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { Pin, MessageSquare, Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle } from 'lucide-react'

type ThoughtStatus = 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'
type ThoughtPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'

type ThoughtCardProps = {
  thought: {
    id: string
    title: string
    content: string
    status: ThoughtStatus
    priority: ThoughtPriority
    color: string | null
    isPinned: boolean
    tags: string[]
    createdAt: Date
    createdBy: { name: string }
    entity: { code: string; name: string; type: GameEntityType } | null
    _count: { comments: number }
  }
}

const statusLabels: Record<ThoughtStatus, string> = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
}

const priorityLabels: Record<ThoughtPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
}

const entityTypeLabels: Record<GameEntityType, string> = {
  UNIT: 'Unit',
  HERO: 'Hero',
  FACTION: 'Faction',
  SPELL: 'Spell',
  ARTIFACT: 'Artifact',
  LOCATION: 'Location',
  OBJECT: 'Object',
  OTHER: 'Other',
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

export function ThoughtCard({ thought }: ThoughtCardProps) {
  return (
    <Link href={`/thoughts/${thought.id}`} className="block">
      <div className="glass-card p-5 h-full flex flex-col min-h-[220px]">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <h3 className="font-semibold text-white line-clamp-2 flex-1 leading-snug">
            {thought.title}
          </h3>
          {thought.isPinned && (
            <Pin size={16} strokeWidth={1.5} className="text-[#A89C6A] flex-shrink-0" />
          )}
        </div>
        
        {/* Content preview */}
        <p className="text-sm text-white/60 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {thought.content}
        </p>
        
        {/* Entity link */}
        {thought.entity && (
          <div className="mb-3 py-2 px-3 bg-white/5 rounded-xl flex items-center gap-2 text-xs">
            <EntityIcon type={thought.entity.type} />
            <span className="text-white/40">{entityTypeLabels[thought.entity.type]}:</span>
            <span className="text-[#A89C6A] font-medium truncate">{thought.entity.name}</span>
          </div>
        )}
        
        {/* Tags */}
        {thought.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {thought.tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-md text-xs text-white/60">
                {tag}
              </span>
            ))}
            {thought.tags.length > 3 && (
              <span className="text-xs text-white/40">+{thought.tags.length - 3}</span>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border status-${thought.status.toLowerCase()}`}>
              {statusLabels[thought.status]}
            </span>
            <span className={`text-xs font-medium priority-${thought.priority.toLowerCase()}`}>
              {priorityLabels[thought.priority]}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/40">
            {thought._count.comments > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare size={12} strokeWidth={1.5} />
                {thought._count.comments}
              </span>
            )}
            <span>{formatRelativeTime(thought.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
