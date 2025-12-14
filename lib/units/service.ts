/**
 * Units Domain Service
 * CRUD operations for game units management (Disciples 2 style)
 */

import { db } from '@/lib/db'
import type { UnitRole, DamageSource, AttackReach } from '@prisma/client'

// ============================================
// TYPES
// ============================================

export type UnitSort = 'newest' | 'oldest' | 'name' | 'level' | 'hp'

export type UnitFilters = {
  factionId?: string
  role?: UnitRole
  search?: string
  sort?: UnitSort
}

export type AttackInput = {
  id?: string
  name: string
  hitChance: number
  damage?: number | null
  heal?: number | null
  damageSource: DamageSource
  initiative: number
  reach: AttackReach
  targets: number
}

export type CreateUnitInput = {
  factionId: string
  name: string
  role: UnitRole
  level?: number
  xpCurrent?: number
  xpToNext?: number
  hpMax: number
  armor?: number
  immunities?: string[]
  wards?: string[]
  hpRegenPercent?: number
  xpOnKill?: number
  description?: string | null
  attacks?: AttackInput[]
}

export type UpdateUnitInput = Partial<CreateUnitInput>

// ============================================
// QUERIES
// ============================================

/**
 * Get all units with filters
 */
export async function getUnits(filters?: UnitFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  
  if (filters?.factionId) {
    where.factionId = filters.factionId
  }
  
  if (filters?.role) {
    where.role = filters.role
  }
  
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  
  // Build orderBy
  const orderBy = (() => {
    switch (filters?.sort) {
      case 'oldest': return { createdAt: 'asc' as const }
      case 'name': return { name: 'asc' as const }
      case 'level': return { level: 'desc' as const }
      case 'hp': return { hpMax: 'desc' as const }
      case 'newest':
      default: return { createdAt: 'desc' as const }
    }
  })()
  
  return db.unit.findMany({
    where,
    orderBy,
    include: {
      faction: {
        select: { id: true, name: true, code: true },
      },
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      attacks: {
        orderBy: { initiative: 'desc' },
      },
      _count: {
        select: { attacks: true },
      },
    },
  })
}

/**
 * Get a single unit by ID
 */
export async function getUnit(id: string) {
  return db.unit.findUnique({
    where: { id },
    include: {
      faction: {
        select: { id: true, name: true, code: true, type: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true, avatarUrl: true, role: true },
      },
      attacks: {
        orderBy: { initiative: 'desc' },
      },
    },
  })
}

/**
 * Get units statistics by role
 */
export async function getUnitStats() {
  const counts = await db.unit.groupBy({
    by: ['role'],
    _count: { id: true },
  })
  return Object.fromEntries(counts.map(c => [c.role, c._count.id])) as Record<UnitRole, number>
}

/**
 * Get all factions for dropdown
 */
export async function getFactionsForDropdown() {
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

/**
 * Get unit for export (specific format)
 */
export async function getUnitForExport(id: string) {
  const unit = await db.unit.findUnique({
    where: { id },
    include: {
      attacks: {
        orderBy: { initiative: 'desc' },
      },
    },
  })
  
  if (!unit) return null
  
  return {
    unit: {
      id: unit.id,
      factionId: unit.factionId,
      name: unit.name,
      role: unit.role.toLowerCase(),
      level: unit.level,
      xp: {
        current: unit.xpCurrent,
        toNext: unit.xpToNext,
      },
      hp: {
        max: unit.hpMax,
      },
      armor: unit.armor,
      regenHpPercent: unit.hpRegenPercent,
      immunities: unit.immunities as string[],
      wards: unit.wards as string[],
      xpOnKill: unit.xpOnKill,
    },
    attacks: unit.attacks.map(attack => ({
      name: attack.name,
      hitChance: attack.hitChance,
      damage: attack.damage,
      heal: attack.heal,
      source: attack.damageSource.toLowerCase(),
      initiative: attack.initiative,
      reach: attack.reach.toLowerCase(),
      targets: attack.targets,
    })),
  }
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new unit with attacks
 */
export async function createUnit(data: CreateUnitInput, userId: string) {
  // Validate hpMax > 0
  if (!data.hpMax || data.hpMax <= 0) {
    throw new Error('HP max must be greater than 0')
  }
  
  // Validate attacks
  if (data.attacks) {
    for (const attack of data.attacks) {
      if (attack.hitChance < 0 || attack.hitChance > 1) {
        throw new Error('Hit chance must be between 0 and 1')
      }
      if (attack.targets < 1) {
        throw new Error('Targets must be at least 1')
      }
    }
  }
  
  const unit = await db.unit.create({
    data: {
      factionId: data.factionId,
      name: data.name,
      role: data.role,
      level: data.level ?? 1,
      xpCurrent: data.xpCurrent ?? 0,
      xpToNext: data.xpToNext ?? 80,
      hpMax: data.hpMax,
      armor: data.armor ?? 0,
      immunities: data.immunities ?? [],
      wards: data.wards ?? [],
      hpRegenPercent: data.hpRegenPercent ?? 0,
      xpOnKill: data.xpOnKill ?? 0,
      description: data.description || null,
      createdById: userId,
      attacks: data.attacks ? {
        create: data.attacks.map(attack => ({
          name: attack.name,
          hitChance: attack.hitChance,
          damage: attack.damage ?? null,
          heal: attack.heal ?? null,
          damageSource: attack.damageSource,
          initiative: attack.initiative,
          reach: attack.reach,
          targets: attack.targets,
        })),
      } : undefined,
    },
    include: {
      faction: {
        select: { id: true, name: true, code: true },
      },
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      attacks: true,
    },
  })
  
  // Log activity
  await db.activityLog.create({
    data: {
      type: 'CREATED',
      description: `Создан юнит "${unit.name}"`,
      userId,
      metadata: {
        itemType: 'unit',
        itemId: unit.id,
      },
    },
  })
  
  return unit
}

/**
 * Update a unit and its attacks
 */
export async function updateUnit(id: string, data: UpdateUnitInput, userId: string) {
  const oldUnit = await db.unit.findUnique({ 
    where: { id },
    include: { attacks: true },
  })
  
  if (!oldUnit) throw new Error('Unit not found')
  
  // Validate if provided
  if (data.hpMax !== undefined && data.hpMax <= 0) {
    throw new Error('HP max must be greater than 0')
  }
  
  if (data.attacks) {
    for (const attack of data.attacks) {
      if (attack.hitChance < 0 || attack.hitChance > 1) {
        throw new Error('Hit chance must be between 0 and 1')
      }
      if (attack.targets < 1) {
        throw new Error('Targets must be at least 1')
      }
    }
  }
  
  // Handle attacks update - delete old and create new
  if (data.attacks) {
    await db.attack.deleteMany({ where: { unitId: id } })
  }
  
  const unit = await db.unit.update({
    where: { id },
    data: {
      factionId: data.factionId,
      name: data.name,
      role: data.role,
      level: data.level,
      xpCurrent: data.xpCurrent,
      xpToNext: data.xpToNext,
      hpMax: data.hpMax,
      armor: data.armor,
      immunities: data.immunities,
      wards: data.wards,
      hpRegenPercent: data.hpRegenPercent,
      xpOnKill: data.xpOnKill,
      description: data.description,
      attacks: data.attacks ? {
        create: data.attacks.map(attack => ({
          name: attack.name,
          hitChance: attack.hitChance,
          damage: attack.damage ?? null,
          heal: attack.heal ?? null,
          damageSource: attack.damageSource,
          initiative: attack.initiative,
          reach: attack.reach,
          targets: attack.targets,
        })),
      } : undefined,
    },
    include: {
      faction: {
        select: { id: true, name: true, code: true },
      },
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      attacks: true,
    },
  })
  
  // Log activity
  await db.activityLog.create({
    data: {
      type: 'UPDATED',
      description: `Обновлён юнит "${unit.name}"`,
      userId,
      metadata: {
        itemType: 'unit',
        itemId: unit.id,
      },
    },
  })
  
  return unit
}

/**
 * Delete a unit
 */
export async function deleteUnit(id: string, userId: string) {
  const unit = await db.unit.findUnique({ where: { id } })
  if (!unit) throw new Error('Unit not found')
  
  // Log activity before deletion
  await db.activityLog.create({
    data: {
      type: 'DELETED',
      description: `Удалён юнит "${unit.name}"`,
      userId,
    },
  })
  
  return db.unit.delete({ where: { id } })
}


