/**
 * Entity Detail Page - With Tabs for Related Content
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'
import { canEditModule } from '@/lib/auth/permissions'
import { EntityBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { EntityActions } from './entity-actions'
import { EntityTabs } from './entity-tabs'
import { 
  ArrowLeft, Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle,
  Palette, BookOpen, Lightbulb, Clock, User, Edit
} from 'lucide-react'

async function getEntity(id: string) {
  return db.gameEntity.findUnique({
    where: { id },
    include: {
      conceptArts: {
        orderBy: { createdAt: 'desc' },
      },
      loreEntries: {
        orderBy: { createdAt: 'desc' },
      },
      thoughts: {
        orderBy: { updatedAt: 'desc' },
        include: {
          createdBy: { select: { name: true } },
        },
      },
      // Unit stats profile for UNIT type entities
      unitProfile: {
        include: {
          attacks: {
            orderBy: { initiative: 'desc' },
          },
          faction: {
            select: { id: true, name: true, code: true },
          },
          prevEvolution: {
            select: { id: true, name: true, code: true, type: true },
          },
        },
      },
      createdBy: { select: { name: true } },
      _count: {
        select: {
          conceptArts: true,
          loreEntries: true,
          thoughts: true,
        },
      },
    },
  })
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EntityDetailPage({ params }: PageProps) {
  const { id } = await params
  const [entity, currentUser] = await Promise.all([
    getEntity(id),
    getCurrentUser(),
  ])
  
  if (!entity || !currentUser) {
    notFound()
  }
  
  const canEdit = canEditModule(currentUser.role, 'entities')
  
  return (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-6">
        <Link href="/entities" className="text-white/50 hover:text-white inline-flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} strokeWidth={1.5} />
          Назад к сущностям
        </Link>
        
        <div className="flex items-center gap-3">
          {canEdit && (
            <Link 
              href={`/entities/${id}/edit`} 
              className="btn btn-secondary flex items-center gap-2"
            >
              <Edit size={16} strokeWidth={1.5} />
              Редактировать
            </Link>
          )}
          <EntityActions entityId={entity.id} entityName={entity.name} userRole={currentUser.role} />
        </div>
      </div>
      
      {/* Header */}
      <div className="glass-card p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
            <EntityTypeIcon type={entity.type} size={36} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <EntityBadge type={entity.type} />
              <span className="text-white/30 font-mono text-sm">{entity.code}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{entity.name}</h1>
            {entity.description && (
              <p className="text-white/60 max-w-2xl leading-relaxed">{entity.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-white/40 mt-4">
              <span className="flex items-center gap-1.5">
                <User size={14} strokeWidth={1.5} />
                {entity.createdBy.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} strokeWidth={1.5} />
                {formatRelativeTime(entity.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-6 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Palette size={18} strokeWidth={1.5} className="text-white/40" />
            <span className="text-white font-medium">{entity._count.conceptArts}</span>
            <span className="text-white/40">концептов</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={18} strokeWidth={1.5} className="text-white/40" />
            <span className="text-white font-medium">{entity._count.loreEntries}</span>
            <span className="text-white/40">записей лора</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb size={18} strokeWidth={1.5} className="text-white/40" />
            <span className="text-white font-medium">{entity._count.thoughts}</span>
            <span className="text-white/40">мыслей</span>
          </div>
        </div>
      </div>
      
      {/* Tabs for Related Content */}
      <EntityTabs
        entityId={entity.id}
        entityName={entity.name}
        entityType={entity.type}
        conceptArts={entity.conceptArts}
        loreEntries={entity.loreEntries}
        thoughts={entity.thoughts}
        unitProfile={entity.unitProfile}
        counts={entity._count}
      />
    </div>
  )
}

function EntityTypeIcon({ type, size = 20 }: { type: string; size?: number }) {
  const props = { size, strokeWidth: 1.5, className: 'text-white/60' }
  
  switch (type) {
    case 'UNIT': return <Swords {...props} />
    case 'HERO': return <Crown {...props} />
    case 'FACTION': return <Castle {...props} />
    case 'SPELL': return <Sparkles {...props} />
    case 'ARTIFACT': return <Gem {...props} />
    case 'LOCATION': return <MapPin {...props} />
    case 'OBJECT': return <Box {...props} />
    default: return <HelpCircle {...props} />
  }
}
