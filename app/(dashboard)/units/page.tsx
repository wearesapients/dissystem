/**
 * Units List Page
 * Shows GameEntity records with type=UNIT, with optional Unit stats
 */

import { db } from '@/lib/db'
import { UnitsHeader } from './components/units-header'
import { UnitsFilters } from './components/units-filters'
import { UnitCard } from './components/unit-card'
import { UnitEmptyState } from './components/unit-empty-state'

type UnitSort = 'newest' | 'oldest' | 'name'

async function getUnits(factionId?: string, search?: string, sort: UnitSort = 'newest') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    type: 'UNIT', // Only show UNIT type entities
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }
  
  // Filter by faction through unitProfile relation
  if (factionId) {
    where.unitProfile = {
      factionId: factionId,
    }
  }
  
  const orderBy = (() => {
    switch (sort) {
      case 'oldest': return { createdAt: 'asc' as const }
      case 'name': return { name: 'asc' as const }
      default: return { createdAt: 'desc' as const }
    }
  })()
  
  return db.gameEntity.findMany({
    where,
    orderBy,
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
      unitProfile: {
        include: {
          faction: {
            select: { id: true, name: true, code: true },
          },
          attacks: {
            orderBy: { initiative: 'desc' },
          },
        },
      },
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

async function getFactions() {
  return db.gameEntity.findMany({
    where: { type: 'FACTION' },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
    },
  })
}

interface PageProps {
  searchParams: Promise<{ 
    factionId?: string
    search?: string
    sort?: string 
  }>
}

export const dynamic = 'force-dynamic'

export default async function UnitsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const [units, factions] = await Promise.all([
    getUnits(params.factionId, params.search, (params.sort as UnitSort) || 'newest'),
    getFactions(),
  ])
  
  const total = units.length
  
  return (
    <div className="animate-in">
      <UnitsHeader total={total} />
      
      {/* Main Content with Right Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Grid */}
        <div className="flex-1 order-2 lg:order-1">
          {units.length === 0 ? (
            <UnitEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {units.map(unit => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>
          )}
        </div>
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
          <UnitsFilters
            currentFaction={params.factionId}
            currentSort={params.sort}
            currentSearch={params.search}
            factions={factions}
          />
        </div>
      </div>
    </div>
  )
}

