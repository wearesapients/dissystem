/**
 * Game Entities Page
 * Shows overview when no type filter, or filtered list when type is specified
 */

import Link from 'next/link'
import { db } from '@/lib/db'
import { EntityBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { EntitiesOverviewHeader } from './components/entities-overview-header'
import { EntityOverviewCards } from './components/entity-overview-cards'
import { EntitiesHeader } from './components/entities-header'
import { EntitiesFilters } from './components/filters'
import { EntityEmptyState } from './components/entity-empty-state'
import { 
  Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, 
  Palette, BookOpen, Lightbulb
} from 'lucide-react'

type EntitySort = 'newest' | 'oldest' | 'updated' | 'name'

async function getEntityStats() {
  const counts = await db.gameEntity.groupBy({
    by: ['type'],
    _count: { id: true },
  })
  return Object.fromEntries(counts.map(c => [c.type, c._count.id])) as Record<string, number>
}

async function getRecentEntitiesByType() {
  const types = ['UNIT', 'HERO', 'FACTION', 'SPELL', 'ARTIFACT', 'LOCATION', 'OBJECT', 'OTHER']
  
  const results = await Promise.all(
    types.map(async (type) => {
      const entities = await db.gameEntity.findMany({
        where: { type: type as never },
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          code: true,
          type: true,
          updatedAt: true,
        },
      })
      return { type, entities }
    })
  )
  
  return Object.fromEntries(results.map(r => [r.type, r.entities]))
}

async function getEntities(type: string, sort: EntitySort = 'newest') {
  const orderBy = (() => {
    switch (sort) {
      case 'oldest': return { createdAt: 'asc' as const }
      case 'updated': return { updatedAt: 'desc' as const }
      case 'name': return { name: 'asc' as const }
      default: return { createdAt: 'desc' as const }
    }
  })()
  
  return db.gameEntity.findMany({
    where: { type: type as never },
    orderBy,
    include: {
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
  searchParams: Promise<{ type?: string; sort?: string }>
}

export const dynamic = 'force-dynamic'

export default async function EntitiesPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  // If type filter is specified, show filtered list
  if (params.type) {
    return <FilteredEntitiesView type={params.type} sort={(params.sort as EntitySort) || 'newest'} />
  }
  
  // Otherwise show overview
  return <EntitiesOverview />
}

// ============================================
// OVERVIEW MODE
// ============================================

async function EntitiesOverview() {
  const [stats, recentByType] = await Promise.all([
    getEntityStats(),
    getRecentEntitiesByType(),
  ])
  
  const total = Object.values(stats).reduce((a, b) => a + b, 0)
  
  return (
    <div className="animate-in">
      <EntitiesOverviewHeader total={total} />
      <EntityOverviewCards 
        stats={stats} 
        recentByType={recentByType} 
      />
    </div>
  )
}

// ============================================
// FILTERED LIST MODE
// ============================================

const typeLabelsRu: Record<string, string> = {
  UNIT: 'Юниты',
  HERO: 'Герои',
  FACTION: 'Фракции',
  SPELL: 'Заклинания',
  ARTIFACT: 'Артефакты',
  LOCATION: 'Локации',
  OBJECT: 'Объекты',
  OTHER: 'Другое',
}

async function FilteredEntitiesView({ type, sort }: { type: string; sort: EntitySort }) {
  const [entities, stats] = await Promise.all([
    getEntities(type, sort),
    getEntityStats(),
  ])
  
  // Server component can't use locale context, so we pass both labels
  // The header component will choose based on locale
  
  return (
    <div className="animate-in">
      <EntitiesHeader 
        total={entities.length} 
        typeName={typeLabelsRu[type] || type}
      />
      
      {/* Main Content with Right Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Grid */}
        <div className="flex-1 order-2 lg:order-1">
          {entities.length === 0 ? (
            <EntityEmptyState type={type} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {entities.map(entity => (
                <Link key={entity.id} href={`/entities/${entity.id}`}>
                  <div className="glass-card p-5 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                        <EntityTypeIcon type={entity.type} size={22} />
                      </div>
                      <EntityBadge type={entity.type} />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1">{entity.name}</h3>
                    <p className="text-sm text-white/40 font-mono mb-3">{entity.code}</p>
                    
                    {entity.shortDescription && (
                      <p className="text-sm text-white/60 line-clamp-2 mb-4">{entity.shortDescription}</p>
                    )}
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-white/5 text-xs text-white/40">
                      <span className="flex items-center gap-1.5">
                        <Palette size={13} strokeWidth={1.5} />
                        {entity._count.conceptArts}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen size={13} strokeWidth={1.5} />
                        {entity._count.loreEntries}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Lightbulb size={13} strokeWidth={1.5} />
                        {entity._count.thoughts}
                      </span>
                      <span className="ml-auto">{formatRelativeTime(entity.updatedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
          <EntitiesFilters
            currentType={type}
            currentSort={sort}
            stats={stats}
          />
        </div>
      </div>
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
