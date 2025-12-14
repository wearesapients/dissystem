/**
 * Create Unit Stats Page
 * For adding stats to a GameEntity of type UNIT or HERO
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
        select: { id: true },
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

export default async function CreateUnitStatsPage({ params }: PageProps) {
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
  
  // If stats already exist, redirect to edit
  if (entity.unitProfile) {
    redirect(`/entities/${id}/stats/edit`)
  }
  
  const isHero = entity.type === 'HERO'
  
  return (
    <div className="animate-in max-w-4xl">
      <Link 
        href={`/entities/${id}?tab=stats`} 
        className="text-white/50 hover:text-white inline-flex items-center gap-2 transition-colors mb-6"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Назад к объекту
      </Link>
      
      <div className="glass-card p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Характеристики: {entity.name}
        </h1>
        <p className="text-white/50">
          {isHero 
            ? 'Герой — это уникальный юнит. Добавьте его боевые характеристики: HP, броню, атаки и параметры развития'
            : 'Добавьте боевые характеристики юнита: HP, броню, атаки и параметры развития'}
        </p>
      </div>
      
      <UnitStatsForm 
        entityId={id}
        entityName={entity.name}
        entityType={entity.type}
        factions={factions}
        unitEntities={unitEntities.filter(u => u.id !== id)}
      />
    </div>
  )
}



