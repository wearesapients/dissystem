/**
 * Edit Unit Stats Page
 */

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'
import { UnitStatsForm } from '../../components/unit-stats-form'

async function getEntity(id: string) {
  return db.gameEntity.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      code: true,
      type: true,
      unitProfile: {
        include: {
          attacks: {
            orderBy: { initiative: 'desc' },
          },
        },
      },
    },
  })
}

async function getFactions() {
  return db.gameEntity.findMany({
    where: { type: 'FACTION' },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, code: true },
  })
}

async function getUnitEntities() {
  // Include both UNIT and HERO entities for evolution tree
  return db.gameEntity.findMany({
    where: { type: { in: ['UNIT', 'HERO'] } },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, code: true, type: true },
  })
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditUnitStatsPage({ params }: PageProps) {
  const { id } = await params
  const [entity, factions, unitEntities] = await Promise.all([
    getEntity(id),
    getFactions(),
    getUnitEntities(),
  ])
  
  if (!entity) {
    notFound()
  }
  
  // Only UNIT and HERO entities can have stats
  if (entity.type !== 'UNIT' && entity.type !== 'HERO') {
    redirect(`/entities/${id}`)
  }
  
  // If no stats exist, redirect to create
  if (!entity.unitProfile) {
    redirect(`/entities/${id}/stats/new`)
  }
  
  const isHero = entity.type === 'HERO'
  
  // Convert to form format
  const existingStats = {
    id: entity.unitProfile.id,
    factionId: entity.unitProfile.factionId,
    name: entity.unitProfile.name,
    role: entity.unitProfile.role,
    level: entity.unitProfile.level,
    xpCurrent: entity.unitProfile.xpCurrent,
    xpToNext: entity.unitProfile.xpToNext,
    hpMax: entity.unitProfile.hpMax,
    armor: entity.unitProfile.armor,
    immunities: entity.unitProfile.immunities as string[],
    wards: entity.unitProfile.wards as string[],
    hpRegenPercent: entity.unitProfile.hpRegenPercent,
    xpOnKill: entity.unitProfile.xpOnKill,
    description: entity.unitProfile.description,
    prevEvolutionId: entity.unitProfile.prevEvolutionId,
    nextEvolutionIds: entity.unitProfile.nextEvolutionIds,
    attacks: entity.unitProfile.attacks.map(a => ({
      id: a.id,
      name: a.name,
      hitChance: a.hitChance,
      damage: a.damage,
      heal: a.heal,
      damageSource: a.damageSource,
      initiative: a.initiative,
      reach: a.reach,
      targets: a.targets,
    })),
  }
  
  return (
    <div className="animate-in max-w-4xl">
      <Link 
        href={`/entities/${id}?tab=stats`} 
        className="text-white/50 hover:text-white inline-flex items-center gap-2 transition-colors mb-6"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Назад к сущности
      </Link>
      
      <div className="glass-card p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Редактирование: {entity.name}
        </h1>
        <p className="text-white/50">
          {isHero 
            ? 'Изменение боевых характеристик героя'
            : 'Изменение боевых характеристик юнита'}
        </p>
      </div>
      
      <UnitStatsForm 
        entityId={id}
        entityName={entity.name}
        entityType={entity.type}
        factions={factions}
        unitEntities={unitEntities.filter(u => u.id !== id)}
        existingStats={existingStats}
      />
    </div>
  )
}



