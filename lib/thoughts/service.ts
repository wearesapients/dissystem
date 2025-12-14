/**
 * Thoughts Domain Service
 * CRUD operations for thoughts/notes management
 */

import { db } from '@/lib/db'

// ============================================
// TYPES (Local to avoid Prisma import issues)
// ============================================

export type ThoughtStatus = 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'
export type ThoughtPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type ThoughtSort = 'newest' | 'oldest' | 'updated' | 'priority'

export type ThoughtFilters = {
  status?: ThoughtStatus
  priority?: ThoughtPriority
  entityId?: string
  search?: string
  createdById?: string
  assigneeId?: string
  tag?: string
  sort?: ThoughtSort
}

export type CreateThoughtInput = {
  title: string
  content: string
  status?: ThoughtStatus
  priority?: ThoughtPriority
  entityId?: string | null
  tags?: string[]
  links?: string[]
  color?: string
  assigneeId?: string | null
}

export type UpdateThoughtInput = Partial<CreateThoughtInput> & {
  isPinned?: boolean
  rejectionReason?: string
  links?: string[]
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all thoughts with filters
 */
export async function getThoughts(filters?: ThoughtFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}
  
  if (filters?.status) {
    where.status = filters.status
  }
  
  if (filters?.priority) {
    where.priority = filters.priority
  }
  
  if (filters?.entityId) {
    where.entityId = filters.entityId
  }
  
  if (filters?.createdById) {
    where.createdById = filters.createdById
  }
  
  if (filters?.assigneeId) {
    where.assigneeId = filters.assigneeId
  }
  
  if (filters?.tag) {
    where.tags = { has: filters.tag }
  }
  
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
    ]
  }
  
  // Build orderBy based on sort parameter
  type OrderBy = { isPinned?: 'asc' | 'desc'; createdAt?: 'asc' | 'desc'; updatedAt?: 'asc' | 'desc'; priority?: 'asc' | 'desc' }
  const sortOrderBy: OrderBy[] = [{ isPinned: 'desc' }]
  
  switch (filters?.sort) {
    case 'oldest':
      sortOrderBy.push({ createdAt: 'asc' })
      break
    case 'updated':
      sortOrderBy.push({ updatedAt: 'desc' })
      break
    case 'priority':
      sortOrderBy.push({ priority: 'desc' }, { createdAt: 'desc' })
      break
    case 'newest':
    default:
      sortOrderBy.push({ createdAt: 'desc' })
      break
  }
  
  return db.thought.findMany({
    where,
    orderBy: sortOrderBy,
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      assignee: {
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
 * Get a single thought by ID
 */
export async function getThought(id: string) {
  return db.thought.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, avatarUrl: true, role: true },
      },
      assignee: {
        select: { id: true, name: true, avatarUrl: true },
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
 * Get thoughts statistics
 */
export async function getThoughtsStats() {
  const [total, byStatus, byPriority] = await Promise.all([
    db.thought.count(),
    db.thought.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    db.thought.groupBy({
      by: ['priority'],
      _count: { id: true },
    }),
  ])
  
  return {
    total,
    byStatus: Object.fromEntries(
      byStatus.map((s: { status: string; _count: { id: number } }) => [s.status, s._count.id])
    ) as Record<ThoughtStatus, number>,
    byPriority: Object.fromEntries(
      byPriority.map((p: { priority: string; _count: { id: number } }) => [p.priority, p._count.id])
    ) as Record<ThoughtPriority, number>,
  }
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const thoughts = await db.thought.findMany({
    select: { tags: true },
  })
  
  const allTags = new Set<string>()
  thoughts.forEach((t: { tags: string[] }) => t.tags.forEach((tag: string) => allTags.add(tag)))
  
  return Array.from(allTags).sort()
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new thought
 */
export async function createThought(data: CreateThoughtInput, userId: string) {
  return db.thought.create({
    data: {
      title: data.title,
      content: data.content,
      status: data.status ?? 'DRAFT',
      priority: data.priority ?? 'MEDIUM',
      entityId: data.entityId || null,
      tags: data.tags ?? [],
      links: data.links ?? [],
      color: data.color,
      assigneeId: data.assigneeId || null,
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
}

/**
 * Update a thought
 */
export async function updateThought(id: string, data: UpdateThoughtInput) {
  // Build update data object, only including defined values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {}
  
  if (data.title !== undefined) updateData.title = data.title
  if (data.content !== undefined) updateData.content = data.content
  if (data.status !== undefined) updateData.status = data.status
  if (data.priority !== undefined) updateData.priority = data.priority
  if (data.entityId !== undefined) updateData.entityId = data.entityId || null
  if (data.tags !== undefined) updateData.tags = data.tags
  if (data.links !== undefined) updateData.links = data.links
  if (data.color !== undefined) updateData.color = data.color
  if (data.isPinned !== undefined) updateData.isPinned = data.isPinned
  if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId || null
  if (data.rejectionReason !== undefined) updateData.rejectionReason = data.rejectionReason
  
  return db.thought.update({
    where: { id },
    data: updateData,
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      entity: {
        select: { id: true, code: true, name: true, type: true },
      },
    },
  })
}

/**
 * Delete a thought
 */
export async function deleteThought(id: string) {
  return db.thought.delete({ where: { id } })
}

/**
 * Toggle pin status
 */
export async function toggleThoughtPin(id: string) {
  const thought = await db.thought.findUnique({ where: { id } })
  if (!thought) throw new Error('Thought not found')
  
  return db.thought.update({
    where: { id },
    data: { isPinned: !thought.isPinned },
  })
}

/**
 * Change thought status
 */
export async function changeThoughtStatus(
  id: string, 
  status: ThoughtStatus, 
  rejectionReason?: string
) {
  return db.thought.update({
    where: { id },
    data: {
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason : null,
    },
  })
}

// ============================================
// COMMENTS
// ============================================

/**
 * Add a comment to a thought
 */
export async function addComment(thoughtId: string, content: string, userId: string) {
  return db.thoughtComment.create({
    data: {
      content,
      thoughtId,
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
  return db.thoughtComment.delete({ where: { id } })
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
 * Get users for assignment dropdown
 */
export async function getAssignableUsers() {
  return db.user.findMany({
    where: {
      role: { in: ['ADMIN', 'EXECUTIVE_PRODUCER', 'CREATIVE_DIRECTOR', 'ARTIST', 'WRITER'] },
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      role: true,
    },
  })
}
