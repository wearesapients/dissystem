/**
 * Game Entities Domain Service
 * CRUD operations for game entities management
 */

import { db } from '@/lib/db'

// ============================================
// TYPES
// ============================================

export type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'
export type EntitySort = 'newest' | 'oldest' | 'updated' | 'name'

export type EntityFilters = {
  type?: GameEntityType
  search?: string
  sort?: EntitySort
}

export type CreateEntityInput = {
  name: string
  code: string
  type: GameEntityType
  description?: string | null
  shortDescription?: string | null
  iconUrl?: string | null
}

export type UpdateEntityInput = Partial<CreateEntityInput>

// ============================================
// QUERIES
// ============================================

/**
 * Get all entities with filters
 */
export async function getEntities(filters?: EntityFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  
  if (filters?.type) {
    where.type = filters.type
  }
  
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { code: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  
  // Build orderBy
  const orderBy = (() => {
    switch (filters?.sort) {
      case 'oldest': return { createdAt: 'asc' as const }
      case 'updated': return { updatedAt: 'desc' as const }
      case 'name': return { name: 'asc' as const }
      case 'newest':
      default: return { createdAt: 'desc' as const }
    }
  })()
  
  return db.gameEntity.findMany({
    where,
    orderBy,
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
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

/**
 * Get a single entity by ID
 */
export async function getEntity(id: string) {
  return db.gameEntity.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, avatarUrl: true, role: true },
      },
      conceptArts: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      loreEntries: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      thoughts: {
        take: 10,
        orderBy: { updatedAt: 'desc' },
        include: {
          createdBy: { select: { name: true } },
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

/**
 * Get entity by code
 */
export async function getEntityByCode(code: string) {
  return db.gameEntity.findUnique({
    where: { code },
  })
}

/**
 * Get entities statistics by type
 */
export async function getEntityStats() {
  const counts = await db.gameEntity.groupBy({
    by: ['type'],
    _count: { id: true },
  })
  return Object.fromEntries(counts.map(c => [c.type, c._count.id])) as Record<GameEntityType, number>
}

/**
 * Get all entity types with their counts
 */
export async function getEntityTypesWithCounts() {
  const counts = await db.gameEntity.groupBy({
    by: ['type'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  })
  return counts.map(c => ({ type: c.type, count: c._count.id }))
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new game entity
 */
export async function createEntity(data: CreateEntityInput, userId: string) {
  const entity = await db.gameEntity.create({
    data: {
      name: data.name,
      code: data.code.toUpperCase(),
      type: data.type,
      description: data.description || null,
      shortDescription: data.shortDescription || null,
      iconUrl: data.iconUrl || null,
      createdById: userId,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  })
  
  // Log activity
  await db.activityLog.create({
    data: {
      type: 'CREATED',
      description: `Создана сущность "${entity.name}"`,
      entityId: entity.id,
      userId,
      metadata: {
        itemType: 'entity',
        itemId: entity.id,
      },
    },
  })
  
  return entity
}

/**
 * Update an entity
 */
export async function updateEntity(id: string, data: UpdateEntityInput, userId: string) {
  const oldEntity = await db.gameEntity.findUnique({ where: { id } })
  
  const entity = await db.gameEntity.update({
    where: { id },
    data: {
      name: data.name,
      code: data.code?.toUpperCase(),
      type: data.type,
      description: data.description,
      shortDescription: data.shortDescription,
      iconUrl: data.iconUrl,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  })
  
  // Log activity
  const changes: string[] = []
  if (oldEntity?.name !== data.name && data.name) changes.push('название')
  if (oldEntity?.description !== data.description && data.description !== undefined) changes.push('описание')
  if (oldEntity?.type !== data.type && data.type) changes.push('тип')
  
  await db.activityLog.create({
    data: {
      type: 'UPDATED',
      description: `Обновлена сущность "${entity.name}"${changes.length > 0 ? `: ${changes.join(', ')}` : ''}`,
      entityId: entity.id,
      userId,
      metadata: {
        itemType: 'entity',
        itemId: entity.id,
        changes: {
          before: oldEntity,
          after: entity,
        },
      },
    },
  })
  
  return entity
}

/**
 * Delete an entity
 */
export async function deleteEntity(id: string, userId: string) {
  const entity = await db.gameEntity.findUnique({ where: { id } })
  if (!entity) throw new Error('Entity not found')
  
  // Log activity before deletion
  await db.activityLog.create({
    data: {
      type: 'DELETED',
      description: `Удалена сущность "${entity.name}"`,
      userId,
    },
  })
  
  return db.gameEntity.delete({ where: { id } })
}

/**
 * Generate unique code from name
 */
export async function generateEntityCode(name: string, type: GameEntityType): Promise<string> {
  const prefix = type.substring(0, 3).toUpperCase()
  const baseName = name
    .toUpperCase()
    .replace(/[^A-ZА-Я0-9]/gi, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 20)
  
  let code = `${prefix}_${baseName}`
  let counter = 1
  
  while (await getEntityByCode(code)) {
    code = `${prefix}_${baseName}_${counter}`
    counter++
  }
  
  return code
}

/**
 * Get all entities for dropdown (minimal data)
 */
export async function getEntitiesForDropdown() {
  return db.gameEntity.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      code: true,
      name: true,
      type: true,
    },
  })
}


