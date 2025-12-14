/**
 * Lore Domain Service
 * CRUD operations for lore/narrative management with versioning
 */

import { db } from '@/lib/db'

// ============================================
// TYPES
// ============================================

export type AssetStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'
export type LoreType = 'BACKSTORY' | 'BIOGRAPHY' | 'WORLD_BUILDING' | 'DIALOGUE' | 'QUEST_TEXT' | 'FLAVOR_TEXT' | 'EVENT' | 'MYTHOLOGY' | 'OTHER'
export type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'
export type LoreSort = 'newest' | 'oldest' | 'updated' | 'title' | 'version'

export type LoreFilters = {
  status?: AssetStatus
  loreType?: LoreType
  entityId?: string
  entityType?: GameEntityType
  search?: string
  createdById?: string
  tag?: string
  sort?: LoreSort
}

export type CreateLoreInput = {
  title: string
  content: string
  summary?: string
  loreType?: LoreType
  status?: AssetStatus
  tags?: string[]
  entityId?: string | null
  linkedEntityIds?: string[]
}

export type UpdateLoreInput = Partial<CreateLoreInput> & {
  changeNote?: string
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all lore entries with filters
 */
export async function getLoreEntries(filters?: LoreFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const andConditions: any[] = []
  
  if (filters?.status) {
    andConditions.push({ status: filters.status })
  }
  
  if (filters?.loreType) {
    andConditions.push({ loreType: filters.loreType })
  }
  
  if (filters?.entityId) {
    andConditions.push({
      OR: [
        { entityId: filters.entityId },
        { linkedEntities: { some: { entityId: filters.entityId } } },
      ]
    })
  }
  
  if (filters?.entityType) {
    andConditions.push({
      OR: [
        { entity: { type: filters.entityType } },
        { linkedEntities: { some: { entity: { type: filters.entityType } } } },
      ]
    })
  }
  
  if (filters?.createdById) {
    andConditions.push({ createdById: filters.createdById })
  }
  
  if (filters?.tag) {
    andConditions.push({ tags: { has: filters.tag } })
  }
  
  if (filters?.search) {
    andConditions.push({
      OR: [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { summary: { contains: filters.search, mode: 'insensitive' } },
      ]
    })
  }
  
  const where = andConditions.length > 0 ? { AND: andConditions } : {}
  
  // Build orderBy based on sort parameter
  let orderBy: { createdAt?: 'asc' | 'desc'; updatedAt?: 'asc' | 'desc'; title?: 'asc' | 'desc'; version?: 'asc' | 'desc' }
  
  switch (filters?.sort) {
    case 'oldest':
      orderBy = { createdAt: 'asc' }
      break
    case 'updated':
      orderBy = { updatedAt: 'desc' }
      break
    case 'title':
      orderBy = { title: 'asc' }
      break
    case 'version':
      orderBy = { version: 'desc' }
      break
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' }
      break
  }
  
  return db.loreEntry.findMany({
    where,
    orderBy,
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      entity: {
        select: { id: true, code: true, name: true, type: true },
      },
      linkedEntities: {
        include: {
          entity: {
            select: { id: true, code: true, name: true, type: true },
          },
        },
      },
      _count: {
        select: { comments: true, versions: true },
      },
    },
  })
}

/**
 * Get a single lore entry by ID
 */
export async function getLoreEntry(id: string) {
  return db.loreEntry.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, avatarUrl: true, role: true },
      },
      entity: {
        select: { id: true, code: true, name: true, type: true, description: true },
      },
      linkedEntities: {
        include: {
          entity: {
            select: { id: true, code: true, name: true, type: true },
          },
        },
      },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      },
      versions: {
        orderBy: { version: 'desc' },
        take: 10,
        include: {
          changedBy: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      },
      _count: {
        select: { comments: true, versions: true },
      },
    },
  })
}

/**
 * Get lore entries grouped by entity
 */
export async function getLoreEntriesGroupedByEntity(filters?: LoreFilters) {
  const entries = await getLoreEntries(filters)
  
  type EntryWithEntity = typeof entries[0]
  const grouped = new Map<string, { entity: EntryWithEntity['entity']; entries: EntryWithEntity[] }>()
  const unlinked: EntryWithEntity[] = []
  
  for (const entry of entries) {
    if (entry.entityId && entry.entity) {
      const existing = grouped.get(entry.entityId)
      if (existing) {
        existing.entries.push(entry)
      } else {
        grouped.set(entry.entityId, { entity: entry.entity, entries: [entry] })
      }
    } else {
      unlinked.push(entry)
    }
  }
  
  return {
    grouped: Array.from(grouped.values()),
    unlinked,
  }
}

/**
 * Get lore statistics
 */
export async function getLoreStats() {
  const [total, byStatus, byType, byEntityType] = await Promise.all([
    db.loreEntry.count(),
    db.loreEntry.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    db.loreEntry.groupBy({
      by: ['loreType'],
      _count: { id: true },
    }),
    db.$queryRaw<Array<{ type: string; count: bigint }>>`
      SELECT ge.type, COUNT(le.id)::int as count
      FROM lore_entries le
      LEFT JOIN game_entities ge ON le."entityId" = ge.id
      WHERE ge.id IS NOT NULL
      GROUP BY ge.type
    `,
  ])
  
  return {
    total,
    byStatus: Object.fromEntries(
      byStatus.map((s: { status: string; _count: { id: number } }) => [s.status, s._count.id])
    ) as Record<AssetStatus, number>,
    byType: Object.fromEntries(
      byType.map((t: { loreType: string; _count: { id: number } }) => [t.loreType, t._count.id])
    ) as Record<LoreType, number>,
    byEntityType: Object.fromEntries(
      byEntityType.map((e) => [e.type, Number(e.count)])
    ) as Record<GameEntityType, number>,
  }
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const entries = await db.loreEntry.findMany({
    select: { tags: true },
  })
  
  const allTags = new Set<string>()
  entries.forEach((e: { tags: string[] }) => e.tags.forEach((tag: string) => allTags.add(tag)))
  
  return Array.from(allTags).sort()
}

/**
 * Get lore entry version history
 */
export async function getLoreVersions(loreEntryId: string) {
  return db.loreEntryVersion.findMany({
    where: { loreEntryId },
    orderBy: { version: 'desc' },
    include: {
      changedBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  })
}

/**
 * Get specific version
 */
export async function getLoreVersion(loreEntryId: string, version: number) {
  return db.loreEntryVersion.findUnique({
    where: {
      loreEntryId_version: { loreEntryId, version },
    },
    include: {
      changedBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  })
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new lore entry
 */
export async function createLoreEntry(data: CreateLoreInput, userId: string) {
  const entry = await db.loreEntry.create({
    data: {
      title: data.title,
      content: data.content,
      summary: data.summary,
      loreType: data.loreType ?? 'OTHER',
      status: data.status ?? 'DRAFT',
      tags: data.tags ?? [],
      entityId: data.entityId || null,
      createdById: userId,
      version: 1,
      linkedEntities: data.linkedEntityIds?.length ? {
        create: data.linkedEntityIds.map(entityId => ({ entityId })),
      } : undefined,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      entity: {
        select: { id: true, code: true, name: true, type: true },
      },
      linkedEntities: {
        include: {
          entity: {
            select: { id: true, code: true, name: true, type: true },
          },
        },
      },
    },
  })
  
  // Create initial version snapshot
  await db.loreEntryVersion.create({
    data: {
      loreEntryId: entry.id,
      version: 1,
      title: entry.title,
      content: entry.content,
      summary: entry.summary,
      changedById: userId,
      changeNote: 'Initial version',
    },
  })
  
  // Log activity
  await db.activityLog.create({
    data: {
      type: 'CREATED',
      description: `Создана запись лора "${entry.title}"`,
      entityId: entry.entityId,
      userId,
      metadata: {
        itemType: 'lore',
        itemId: entry.id,
      },
    },
  })
  
  return entry
}

/**
 * Update a lore entry (with versioning)
 */
export async function updateLoreEntry(id: string, data: UpdateLoreInput, userId: string) {
  const current = await db.loreEntry.findUnique({ where: { id } })
  if (!current) throw new Error('Lore entry not found')
  
  // Check if content changed (for versioning)
  const contentChanged = 
    (data.title !== undefined && data.title !== current.title) ||
    (data.content !== undefined && data.content !== current.content) ||
    (data.summary !== undefined && data.summary !== current.summary)
  
  const newVersion = contentChanged ? current.version + 1 : current.version
  
  // Update linked entities if provided
  if (data.linkedEntityIds !== undefined) {
    // Delete existing links
    await db.loreEntryEntity.deleteMany({ where: { loreEntryId: id } })
    
    // Create new links
    if (data.linkedEntityIds.length > 0) {
      await db.loreEntryEntity.createMany({
        data: data.linkedEntityIds.map(entityId => ({ loreEntryId: id, entityId })),
      })
    }
  }
  
  const entry = await db.loreEntry.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      summary: data.summary,
      loreType: data.loreType,
      status: data.status,
      tags: data.tags,
      entityId: data.entityId,
      version: newVersion,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      entity: {
        select: { id: true, code: true, name: true, type: true },
      },
      linkedEntities: {
        include: {
          entity: {
            select: { id: true, code: true, name: true, type: true },
          },
        },
      },
    },
  })
  
  // Create version snapshot if content changed
  if (contentChanged) {
    await db.loreEntryVersion.create({
      data: {
        loreEntryId: id,
        version: newVersion,
        title: entry.title,
        content: entry.content,
        summary: entry.summary,
        changedById: userId,
        changeNote: data.changeNote || null,
      },
    })
  }
  
  // Log activity
  await db.activityLog.create({
    data: {
      type: 'UPDATED',
      description: `Обновлена запись лора "${entry.title}"`,
      entityId: entry.entityId,
      userId,
      metadata: {
        itemType: 'lore',
        itemId: id,
      },
    },
  })
  
  return entry
}

/**
 * Delete a lore entry
 */
export async function deleteLoreEntry(id: string, userId?: string) {
  const entry = await db.loreEntry.findUnique({ where: { id } })
  
  if (entry && userId) {
    await db.activityLog.create({
      data: {
        type: 'DELETED',
        description: `Удалена запись лора "${entry.title}"`,
        entityId: entry.entityId,
        userId,
        metadata: {
          itemType: 'lore',
          itemId: id,
        },
      },
    })
  }
  
  return db.loreEntry.delete({ where: { id } })
}

/**
 * Change lore entry status
 */
export async function changeLoreStatus(id: string, status: AssetStatus) {
  return db.loreEntry.update({
    where: { id },
    data: { status },
  })
}

/**
 * Restore from a specific version
 */
export async function restoreLoreVersion(loreEntryId: string, version: number, userId: string) {
  const versionData = await getLoreVersion(loreEntryId, version)
  if (!versionData) throw new Error('Version not found')
  
  return updateLoreEntry(
    loreEntryId,
    {
      title: versionData.title,
      content: versionData.content,
      summary: versionData.summary || undefined,
      changeNote: `Restored from version ${version}`,
    },
    userId
  )
}

// ============================================
// COMMENTS
// ============================================

/**
 * Add a comment to a lore entry
 */
export async function addComment(loreEntryId: string, content: string, userId: string) {
  return db.loreComment.create({
    data: {
      content,
      loreEntryId,
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
  return db.loreComment.delete({ where: { id } })
}

/**
 * Get comments for a lore entry
 */
export async function getComments(loreEntryId: string) {
  return db.loreComment.findMany({
    where: { loreEntryId },
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  })
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
 * Get entities with lore counts
 */
export async function getEntitiesWithLoreCounts() {
  const entities = await db.gameEntity.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      _count: {
        select: { 
          loreEntries: true,
          loreEntryLinks: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })
  
  return entities.map(e => ({
    ...e,
    totalLoreCount: e._count.loreEntries + e._count.loreEntryLinks,
  }))
}

// ============================================
// LORE TYPE LABELS
// ============================================

export const LORE_TYPE_LABELS: Record<LoreType, { en: string; ru: string }> = {
  BACKSTORY: { en: 'Backstory', ru: 'Предыстория' },
  BIOGRAPHY: { en: 'Biography', ru: 'Биография' },
  WORLD_BUILDING: { en: 'World Building', ru: 'Мироустроение' },
  DIALOGUE: { en: 'Dialogue', ru: 'Диалоги' },
  QUEST_TEXT: { en: 'Quest Text', ru: 'Тексты квестов' },
  FLAVOR_TEXT: { en: 'Flavor Text', ru: 'Флейвор-тексты' },
  EVENT: { en: 'Event', ru: 'Событие' },
  MYTHOLOGY: { en: 'Mythology', ru: 'Мифология' },
  OTHER: { en: 'Other', ru: 'Другое' },
}

