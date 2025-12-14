/**
 * Concept Art Page
 * Shows overview by entity types when no filters, or filtered list when filter is specified
 */

import { db } from '@/lib/db'
import { 
  getConceptArtsGroupedByEntity, 
  getConceptArtsStats, 
  getAllTags,
  ConceptArtSort,
  AssetStatus,
  GameEntityType
} from '@/lib/concept-art/service'
import { ConceptArtCard } from './components/concept-art-card'
import { EntityArtGroup } from './components/entity-art-group'
import { ConceptArtFilters } from './components/concept-art-filters'
import { ConceptArtHeader } from './components/concept-art-header'
import { ConceptArtOverviewHeader } from './components/concept-art-overview-header'
import { ConceptArtOverviewCards } from './components/concept-art-overview-cards'
import { ConceptArtStatusCards } from './components/concept-art-status-cards'
import { ConceptArtEmptyState } from './components/concept-art-empty-state'

interface PageProps {
  searchParams: Promise<{
    status?: string
    entityType?: string
    search?: string
    tag?: string
    sort?: string
    unlinked?: string
  }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ConceptArtPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  // If any filter is specified, show filtered list
  if (params.status || params.entityType || params.search || params.tag || params.unlinked) {
    return <FilteredConceptArtView params={params} />
  }
  
  // Otherwise show overview
  return <ConceptArtOverview />
}

// ============================================
// OVERVIEW MODE - By Entity Types
// ============================================

async function getStatsByEntityType() {
  // Get counts by entity type
  const artsByType = await db.conceptArt.groupBy({
    by: ['entityId'],
    _count: { id: true },
    where: { entityId: { not: null } },
  })
  
  // Get entity types for these entityIds
  const entityIds = artsByType.map(a => a.entityId).filter(Boolean) as string[]
  const entities = await db.gameEntity.findMany({
    where: { id: { in: entityIds } },
    select: { id: true, type: true },
  })
  
  // Map entity types
  const entityTypeMap = Object.fromEntries(entities.map(e => [e.id, e.type]))
  
  // Aggregate by type
  const countsByType: Record<string, number> = {}
  for (const art of artsByType) {
    const entityType = entityTypeMap[art.entityId!]
    if (entityType) {
      countsByType[entityType] = (countsByType[entityType] || 0) + art._count.id
    }
  }
  
  return countsByType
}

async function getRecentByEntityType() {
  const entityTypes = ['HERO', 'UNIT', 'FACTION', 'SPELL', 'ARTIFACT', 'LOCATION', 'OBJECT', 'OTHER']
  
  const results = await Promise.all(
    entityTypes.map(async (type) => {
      const arts = await db.conceptArt.findMany({
        where: { 
          entity: { type: type as GameEntityType }
        },
        take: 3,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          thumbnailUrl: true,
        },
      })
      return { type, arts }
    })
  )
  
  return Object.fromEntries(results.map(r => [r.type, r.arts]))
}

async function getUnlinkedArts() {
  const [count, recent] = await Promise.all([
    db.conceptArt.count({ where: { entityId: null } }),
    db.conceptArt.findMany({
      where: { entityId: null },
      take: 6,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        thumbnailUrl: true,
      },
    }),
  ])
  
  return { count, recent }
}

async function ConceptArtOverview() {
  const [stats, statsByType, recentByType, unlinked] = await Promise.all([
    getConceptArtsStats(),
    getStatsByEntityType(),
    getRecentByEntityType(),
    getUnlinkedArts(),
  ])
  
  return (
    <div className="animate-in">
      <ConceptArtOverviewHeader total={stats.total} />
      <ConceptArtOverviewCards 
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
    entityType?: string
    search?: string
    tag?: string
    sort?: string
    unlinked?: string
  }
}

async function FilteredConceptArtView({ params }: FilteredViewProps) {
  // Special handling for unlinked filter
  const filters = params.unlinked === 'true' 
    ? { 
        // For unlinked, we need a custom query
        status: params.status as AssetStatus | undefined,
        search: params.search,
        tag: params.tag,
        sort: (params.sort as ConceptArtSort) || 'newest',
      }
    : {
        status: params.status as AssetStatus | undefined,
        entityType: params.entityType as GameEntityType | undefined,
        search: params.search,
        tag: params.tag,
        sort: (params.sort as ConceptArtSort) || 'newest',
      }
  
  const [{ grouped, unlinked }, stats, allTags] = await Promise.all([
    getConceptArtsGroupedByEntity(filters),
    getConceptArtsStats(),
    getAllTags(),
  ])
  
  // For unlinked filter, only show unlinked arts
  const displayGrouped = params.unlinked === 'true' ? [] : grouped
  const displayUnlinked = params.unlinked === 'true' ? unlinked : (params.entityType ? [] : unlinked)
  
  const totalGroups = displayGrouped.length + displayUnlinked.length
  
  // Determine title based on filters
  let filterName: string | undefined
  if (params.unlinked === 'true') {
    filterName = 'Без привязки'
  } else if (params.entityType) {
    filterName = entityTypeLabelsRu[params.entityType]
  }
  
  return (
    <div className="animate-in">
      {/* Header */}
      <ConceptArtHeader total={totalGroups} statusName={filterName} />
      
      {/* Status Cards */}
      <ConceptArtStatusCards stats={stats} currentStatus={params.status} />
      
      {/* Main Content with Filters Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Art Grid */}
        <div className="flex-1 order-2 lg:order-1">
          {totalGroups === 0 ? (
            <ConceptArtEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {/* Grouped by entity */}
              {displayGrouped.map((group) => (
                <EntityArtGroup
                  key={group.entity!.id}
                  entity={group.entity!}
                  arts={group.arts}
                />
              ))}
              
              {/* Unlinked arts (no entity) */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {displayUnlinked.map((art: any) => (
                <ConceptArtCard key={art.id} art={art} />
              ))}
            </div>
          )}
        </div>
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
          <ConceptArtFilters
            currentStatus={params.status}
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
