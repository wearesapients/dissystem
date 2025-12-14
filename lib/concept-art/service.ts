/**
 * Concept Art Domain Service
 * CRUD operations for concept art management
 */

import { db } from '@/lib/db'

// ============================================
// TYPES
// ============================================

export type AssetStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'
export type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'
export type ConceptArtSort = 'newest' | 'oldest' | 'updated' | 'title'

export type ConceptArtFilters = {
  status?: AssetStatus
  entityId?: string
  entityType?: GameEntityType
  search?: string
  createdById?: string
  tag?: string
  sort?: ConceptArtSort
}

export type CreateConceptArtInput = {
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  status?: AssetStatus
  tags?: string[]
  entityId?: string | null
}

export type UpdateConceptArtInput = Partial<CreateConceptArtInput>

// ============================================
// QUERIES
// ============================================

/**
 * Get all concept arts with filters
 */
export async function getConceptArts(filters?: ConceptArtFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  
  if (filters?.status) {
    where.status = filters.status
  }
  
  if (filters?.entityId) {
    where.entityId = filters.entityId
  }
  
  if (filters?.entityType) {
    where.entity = { type: filters.entityType }
  }
  
  if (filters?.createdById) {
    where.createdById = filters.createdById
  }
  
  if (filters?.tag) {
    where.tags = { has: filters.tag }
  }
  
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  
  // Build orderBy based on sort parameter
  type OrderBy = { createdAt?: 'asc' | 'desc'; updatedAt?: 'asc' | 'desc'; title?: 'asc' | 'desc' }
  const sortOrderBy: OrderBy[] = []
  
  switch (filters?.sort) {
    case 'oldest':
      sortOrderBy.push({ createdAt: 'asc' })
      break
    case 'updated':
      sortOrderBy.push({ updatedAt: 'desc' })
      break
    case 'title':
      sortOrderBy.push({ title: 'asc' })
      break
    case 'newest':
    default:
      sortOrderBy.push({ createdAt: 'desc' })
      break
  }
  
  return db.conceptArt.findMany({
    where,
    orderBy: sortOrderBy,
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      entity: {
        select: { id: true, code: true, name: true, type: true },
      },
      _count: {
        select: { comments: true },
      },
    },
  })
}

/**
 * Get a single concept art by ID
 */
export async function getConceptArt(id: string) {
  return db.conceptArt.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, avatarUrl: true, role: true },
      },
      entity: {
        select: { id: true, code: true, name: true, type: true, description: true },
      },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      },
    },
  })
}

/**
 * Get all concept arts for an entity (for gallery view)
 */
export async function getEntityConceptArts(entityId: string) {
  return db.conceptArt.findMany({
    where: { entityId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      thumbnailUrl: true,
      status: true,
      createdAt: true,
    },
  })
}

/**
 * Get concept arts grouped by entity
 */
export async function getConceptArtsGroupedByEntity(filters?: ConceptArtFilters) {
  // First get all arts with the filters
  const arts = await getConceptArts(filters)
  
  // Group by entity
  type ArtWithEntity = typeof arts[0]
  const grouped = new Map<string, { entity: ArtWithEntity['entity']; arts: ArtWithEntity[] }>()
  const unlinked: ArtWithEntity[] = []
  
  for (const art of arts) {
    if (art.entityId && art.entity) {
      const existing = grouped.get(art.entityId)
      if (existing) {
        existing.arts.push(art)
      } else {
        grouped.set(art.entityId, { entity: art.entity, arts: [art] })
      }
    } else {
      unlinked.push(art)
    }
  }
  
  return {
    grouped: Array.from(grouped.values()),
    unlinked,
  }
}

/**
 * Get concept arts statistics
 */
export async function getConceptArtsStats() {
  const [total, byStatus, byEntityType] = await Promise.all([
    db.conceptArt.count(),
    db.conceptArt.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    db.$queryRaw<Array<{ type: string; count: bigint }>>`
      SELECT ge.type, COUNT(ca.id)::int as count
      FROM concept_arts ca
      LEFT JOIN game_entities ge ON ca."entityId" = ge.id
      WHERE ge.id IS NOT NULL
      GROUP BY ge.type
    `,
  ])
  
  return {
    total,
    byStatus: Object.fromEntries(
      byStatus.map((s: { status: string; _count: { id: number } }) => [s.status, s._count.id])
    ) as Record<AssetStatus, number>,
    byEntityType: Object.fromEntries(
      byEntityType.map((e) => [e.type, Number(e.count)])
    ) as Record<GameEntityType, number>,
  }
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const arts = await db.conceptArt.findMany({
    select: { tags: true },
  })
  
  const allTags = new Set<string>()
  arts.forEach((a: { tags: string[] }) => a.tags.forEach((tag: string) => allTags.add(tag)))
  
  return Array.from(allTags).sort()
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new concept art
 */
export async function createConceptArt(data: CreateConceptArtInput, userId: string) {
  const art = await db.conceptArt.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      thumbnailUrl: data.thumbnailUrl,
      status: data.status ?? 'DRAFT',
      tags: data.tags ?? [],
      entityId: data.entityId || null,
      createdById: userId,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      entity: {
        select: { id: true, code: true, name: true, type: true },
      },
    },
  })
  
  // Log activity
  await db.activityLog.create({
    data: {
      type: 'CREATED',
      description: `Загружен концепт-арт "${art.title}"`,
      entityId: art.entityId,
      userId,
      metadata: {
        itemType: 'conceptArt',
        itemId: art.id,
      },
    },
  })
  
  return art
}

/**
 * Update a concept art
 */
export async function updateConceptArt(id: string, data: UpdateConceptArtInput, userId?: string) {
  const art = await db.conceptArt.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      thumbnailUrl: data.thumbnailUrl,
      status: data.status,
      tags: data.tags,
      entityId: data.entityId,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      entity: {
        select: { id: true, code: true, name: true, type: true },
      },
    },
  })
  
  // Log activity
  if (userId) {
    await db.activityLog.create({
      data: {
        type: 'UPDATED',
        description: `Обновлён концепт-арт "${art.title}"`,
        entityId: art.entityId,
        userId,
        metadata: {
          itemType: 'conceptArt',
          itemId: id,
        },
      },
    })
  }
  
  return art
}

/**
 * Delete a concept art
 */
export async function deleteConceptArt(id: string, userId?: string) {
  const art = await db.conceptArt.findUnique({ where: { id } })
  
  if (art && userId) {
    await db.activityLog.create({
      data: {
        type: 'DELETED',
        description: `Удалён концепт-арт "${art.title}"`,
        entityId: art.entityId,
        userId,
        metadata: {
          itemType: 'conceptArt',
          itemId: id,
        },
      },
    })
  }
  
  return db.conceptArt.delete({ where: { id } })
}

/**
 * Change concept art status
 */
export async function changeConceptArtStatus(id: string, status: AssetStatus, userId?: string) {
  const art = await db.conceptArt.update({
    where: { id },
    data: { status },
  })
  
  if (userId) {
    const statusLabels: Record<AssetStatus, string> = {
      DRAFT: 'Черновик',
      IN_REVIEW: 'На проверке',
      APPROVED: 'Утверждено',
      REJECTED: 'Отклонено',
      ARCHIVED: 'В архиве',
    }
    
    await db.activityLog.create({
      data: {
        type: 'STATUS_CHANGED',
        description: `Статус концепт-арта "${art.title}" изменён на "${statusLabels[status]}"`,
        entityId: art.entityId,
        userId,
        metadata: {
          itemType: 'conceptArt',
          itemId: id,
          newStatus: status,
        },
      },
    })
  }
  
  return art
}

// ============================================
// COMMENTS
// ============================================

/**
 * Add a comment to a concept art
 */
export async function addComment(conceptArtId: string, content: string, userId: string) {
  return db.conceptArtComment.create({
    data: {
      content,
      conceptArtId,
      authorId: userId,
    },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  })
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string) {
  return db.conceptArtComment.delete({ where: { id } })
}

// ============================================
// GAME ENTITIES (for linking)
// ============================================

/**
 * Get all game entities for dropdown
 */
export async function getGameEntities() {
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

/**
 * Get entities grouped by type with concept art counts
 */
export async function getEntitiesWithArtCounts() {
  const entities = await db.gameEntity.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      _count: {
        select: { conceptArts: true },
      },
    },
    orderBy: { name: 'asc' },
  })
  
  return entities
}


