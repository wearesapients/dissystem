/**
 * Lore Page
 * Shows overview by entity types when no filters, or filtered list when filter is specified
 */

import { db } from '@/lib/db'
import { 
  getLoreStats, 
  getAllTags,
  AssetStatus,
  LoreType,
  GameEntityType
} from '@/lib/lore/service'
import { requireModuleView } from '@/lib/auth/require-module-access'
import { LoreCard } from './components/lore-card'
import { LoreFilters } from './components/lore-filters'
import { LoreHeader } from './components/lore-header'
import { LoreOverviewHeader } from './components/lore-overview-header'
import { LoreOverviewCards } from './components/lore-overview-cards'
import { LoreStatusCards } from './components/lore-status-cards'
import { LoreEmptyState } from './components/lore-empty-state'

interface PageProps {
  searchParams: Promise<{
    status?: string
    loreType?: string
    entityType?: string
    search?: string
    tag?: string
    sort?: string
    unlinked?: string
  }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LorePage({ searchParams }: PageProps) {
  // Check view permission - redirect to dashboard if not allowed
  await requireModuleView('lore')
  
  const params = await searchParams
  
  // If any filter is specified, show filtered list
  if (params.status || params.loreType || params.entityType || params.search || params.tag || params.unlinked) {
    return <FilteredLoreView params={params} />
  }
  
  // Otherwise show overview by entity types
  return <LoreOverview />
}

// ============================================
// OVERVIEW MODE - By Entity Types
// ============================================

async function getStatsByEntityType() {
  // Get counts by entity type
  const loreByEntity = await db.loreEntry.groupBy({
    by: ['entityId'],
    _count: { id: true },
    where: { entityId: { not: null } },
  })
  
  // Get entity types for these entityIds
  const entityIds = loreByEntity.map(l => l.entityId).filter(Boolean) as string[]
  const entities = await db.gameEntity.findMany({
    where: { id: { in: entityIds } },
    select: { id: true, type: true },
  })
  
  // Map entity types
  const entityTypeMap = Object.fromEntries(entities.map(e => [e.id, e.type]))
  
  // Aggregate by type
  const countsByType: Record<string, number> = {}
  for (const lore of loreByEntity) {
    const entityType = entityTypeMap[lore.entityId!]
    if (entityType) {
      countsByType[entityType] = (countsByType[entityType] || 0) + lore._count.id
    }
  }
  
  return countsByType
}

async function getRecentByEntityType() {
  const entityTypes = ['HERO', 'UNIT', 'FACTION', 'SPELL', 'ARTIFACT', 'LOCATION']
  
  const results = await Promise.all(
    entityTypes.map(async (type) => {
      const entries = await db.loreEntry.findMany({
        where: { 
          entity: { type: type as GameEntityType }
        },
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      })
      return { type, entries }
    })
  )
  
  return Object.fromEntries(results.map(r => [r.type, r.entries]))
}

async function getUnlinkedLore() {
  const [count, recent] = await Promise.all([
    db.loreEntry.count({ where: { entityId: null } }),
    db.loreEntry.findMany({
      where: { entityId: null },
      take: 3,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    }),
  ])
  
  return { count, recent }
}

async function LoreOverview() {
  const [stats, statsByType, recentByType, unlinked] = await Promise.all([
    getLoreStats(),
    getStatsByEntityType(),
    getRecentByEntityType(),
    getUnlinkedLore(),
  ])
  
  return (
    <div className="animate-in">
      <LoreOverviewHeader total={stats.total} />
      <LoreOverviewCards 
        statsByType={statsByType}
        recentByType={recentByType}
        unlinkedCount={unlinked.count}
        recentUnlinked={unlinked.recent}
      />
    </div>
  )
}

// ============================================
// FILTERED LIST MODE
// ============================================

const entityTypeLabelsRu: Record<string, string> = {
  HERO: 'Герои',
  UNIT: 'Юниты',
  FACTION: 'Фракции',
  SPELL: 'Заклинания',
  ARTIFACT: 'Артефакты',
  LOCATION: 'Локации',
  OBJECT: 'Объекты',
  OTHER: 'Другое',
}

interface FilteredViewProps {
  params: {
    status?: string
    loreType?: string
    entityType?: string
    search?: string
    tag?: string
    sort?: string
    unlinked?: string
  }
}

async function FilteredLoreView({ params }: FilteredViewProps) {
  // Build where clause for direct query when filtering by entity type or unlinked
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  
  if (params.status) {
    where.status = params.status as AssetStatus
  }
  if (params.loreType) {
    where.loreType = params.loreType as LoreType
  }
  if (params.tag) {
    where.tags = { has: params.tag }
  }
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { content: { contains: params.search, mode: 'insensitive' } },
    ]
  }
  
  // Entity type or unlinked filter
  if (params.unlinked === 'true') {
    where.entityId = null
  } else if (params.entityType) {
    where.entity = { type: params.entityType as GameEntityType }
  }
  
  const [entries, stats, allTags] = await Promise.all([
    db.loreEntry.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        entity: { select: { id: true, name: true, type: true } },
        createdBy: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
    }),
    getLoreStats(),
    getAllTags(),
  ])
  
  // Determine title based on filters
  let filterName: string | undefined
  if (params.unlinked === 'true') {
    filterName = 'Другое'
  } else if (params.entityType) {
    filterName = entityTypeLabelsRu[params.entityType]
  }
  
  return (
    <div className="animate-in">
      {/* Header */}
      <LoreHeader total={entries.length} statusName={filterName} />
      
      {/* Status Cards */}
      <LoreStatusCards stats={stats} currentStatus={params.status} />
      
      {/* Main Content with Filters Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Lore Grid */}
        <div className="flex-1 order-2 lg:order-1">
          {entries.length === 0 ? (
            <LoreEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {entries.map((entry: any) => (
                <LoreCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
          <LoreFilters
            currentStatus={params.status}
            currentLoreType={params.loreType}
            currentEntityType={params.entityType}
            currentSearch={params.search}
            currentTag={params.tag}
            currentSort={params.sort}
            allTags={allTags}
          />
        </div>
      </div>
    </div>
  )
}
