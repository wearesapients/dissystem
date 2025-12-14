/**
 * Thoughts Page
 * Shows overview by entity types when no filters, or filtered list when filter is specified
 */

import { db } from '@/lib/db'
import { getThoughtsStats, getAllTags, ThoughtStatus, ThoughtPriority } from '@/lib/thoughts/service'
import { requireModuleView } from '@/lib/auth/require-module-access'
import { ThoughtCard } from './components/thought-card'
import { ThoughtsFilters } from './components/filters'
import { ThoughtsHeader } from './components/thoughts-header'
import { ThoughtsOverviewHeader } from './components/thoughts-overview-header'
import { ThoughtsOverviewCards } from './components/thoughts-overview-cards'
import { ThoughtStatusCards } from './components/thought-status-cards'
import { ThoughtsEmptyState } from './components/thoughts-empty-state'

type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'

interface PageProps {
  searchParams: Promise<{
    status?: string
    priority?: string
    search?: string
    tag?: string
    sort?: string
    entityType?: string
    unlinked?: string
  }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ThoughtsPage({ searchParams }: PageProps) {
  // Check view permission - redirect to dashboard if not allowed
  await requireModuleView('thoughts')
  
  const params = await searchParams
  
  // If any filter is specified, show filtered list
  if (params.status || params.priority || params.search || params.tag || params.entityType || params.unlinked) {
    return <FilteredThoughtsView params={params} />
  }
  
  // Otherwise show overview by entity types
  return <ThoughtsOverview />
}

// ============================================
// OVERVIEW MODE - By Entity Types
// ============================================

async function getStatsByEntityType() {
  // Get counts by entity type
  const thoughtsByEntity = await db.thought.groupBy({
    by: ['entityId'],
    _count: { id: true },
    where: { entityId: { not: null } },
  })
  
  // Get entity types for these entityIds
  const entityIds = thoughtsByEntity.map(t => t.entityId).filter(Boolean) as string[]
  const entities = await db.gameEntity.findMany({
    where: { id: { in: entityIds } },
    select: { id: true, type: true },
  })
  
  // Map entity types
  const entityTypeMap = Object.fromEntries(entities.map(e => [e.id, e.type]))
  
  // Aggregate by type
  const countsByType: Record<string, number> = {}
  for (const thought of thoughtsByEntity) {
    const entityType = entityTypeMap[thought.entityId!]
    if (entityType) {
      countsByType[entityType] = (countsByType[entityType] || 0) + thought._count.id
    }
  }
  
  return countsByType
}

async function getRecentByEntityType() {
  const entityTypes = ['HERO', 'UNIT', 'FACTION', 'SPELL', 'ARTIFACT', 'LOCATION']
  
  const results = await Promise.all(
    entityTypes.map(async (type) => {
      const thoughts = await db.thought.findMany({
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
      return { type, thoughts }
    })
  )
  
  return Object.fromEntries(results.map(r => [r.type, r.thoughts]))
}

async function getUnlinkedThoughts() {
  const [count, recent] = await Promise.all([
    db.thought.count({ where: { entityId: null } }),
    db.thought.findMany({
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

async function ThoughtsOverview() {
  const [stats, statsByType, recentByType, unlinked] = await Promise.all([
    getThoughtsStats(),
    getStatsByEntityType(),
    getRecentByEntityType(),
    getUnlinkedThoughts(),
  ])
  
  return (
    <div className="animate-in">
      <ThoughtsOverviewHeader total={stats.total} />
      <ThoughtsOverviewCards 
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
    priority?: string
    search?: string
    tag?: string
    sort?: string
    entityType?: string
    unlinked?: string
  }
}

async function FilteredThoughtsView({ params }: FilteredViewProps) {
  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  
  if (params.status) {
    where.status = params.status as ThoughtStatus
  }
  if (params.priority) {
    where.priority = params.priority as ThoughtPriority
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
  
  const [thoughts, stats, allTags] = await Promise.all([
    db.thought.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        entity: { select: { id: true, name: true, type: true } },
        createdBy: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
    }),
    getThoughtsStats(),
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
      <ThoughtsHeader total={thoughts.length} statusName={filterName} />
      
      {/* Status Cards - Compact & Clickable */}
      <ThoughtStatusCards stats={stats} currentStatus={params.status} />
      
      {/* Main Content with Right Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Thoughts Grid */}
        <div className="flex-1 order-2 lg:order-1">
          {thoughts.length === 0 ? (
            <ThoughtsEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {thoughts.map((thought: any) => (
                <ThoughtCard key={thought.id} thought={thought} />
              ))}
            </div>
          )}
        </div>
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
          <ThoughtsFilters
            currentStatus={params.status}
            currentPriority={params.priority}
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
