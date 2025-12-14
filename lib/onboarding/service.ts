/**
 * Onboarding Domain Service
 * CRUD operations for onboarding cards management
 */

import { db } from '@/lib/db'

// ============================================
// TYPES
// ============================================

export type AssetStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'
export type OnboardingCategory = 'DESIGN_SYSTEM' | 'GAME_FILES' | 'GUIDELINES' | 'TOOLS' | 'REFERENCES' | 'OTHER'
export type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'
export type OnboardingSort = 'newest' | 'oldest' | 'updated' | 'title' | 'order'

export type OnboardingFilters = {
  status?: AssetStatus
  category?: OnboardingCategory
  search?: string
  createdById?: string
  tag?: string
  sort?: OnboardingSort
  parentId?: string | null
}

export type CreateOnboardingInput = {
  title: string
  description?: string
  category?: OnboardingCategory
  status?: AssetStatus
  order?: number
  isPinned?: boolean
  tags?: string[]
  links?: string[]
  parentId?: string | null
  linkedEntityIds?: string[]
  images?: { imageUrl: string; caption?: string; order?: number }[]
}

export type UpdateOnboardingInput = Partial<CreateOnboardingInput>

// ============================================
// CATEGORY LABELS
// ============================================

export const ONBOARDING_CATEGORY_LABELS: Record<OnboardingCategory, { en: string; ru: string }> = {
  DESIGN_SYSTEM: { en: 'Design System', ru: 'Дизайн-система' },
  GAME_FILES: { en: 'Game Files', ru: 'Файлы игры' },
  GUIDELINES: { en: 'Guidelines', ru: 'Гайдлайны' },
  TOOLS: { en: 'Tools & Processes', ru: 'Инструменты' },
  REFERENCES: { en: 'References', ru: 'Референсы' },
  OTHER: { en: 'Other', ru: 'Другое' },
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all onboarding cards with filters
 */
export async function getOnboardingCards(filters?: OnboardingFilters) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const andConditions: any[] = []
  
  if (filters?.status) {
    andConditions.push({ status: filters.status })
  }
  
  if (filters?.category) {
    andConditions.push({ category: filters.category })
  }
  
  if (filters?.createdById) {
    andConditions.push({ createdById: filters.createdById })
  }
  
  if (filters?.tag) {
    andConditions.push({ tags: { has: filters.tag } })
  }
  
  if (filters?.parentId !== undefined) {
    andConditions.push({ parentId: filters.parentId })
  }
  
  if (filters?.search) {
    andConditions.push({
      OR: [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    })
  }
  
  const where = andConditions.length > 0 ? { AND: andConditions } : {}
  
  // Build orderBy based on sort parameter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any[]
  
  switch (filters?.sort) {
    case 'oldest':
      orderBy = [{ createdAt: 'asc' }]
      break
    case 'updated':
      orderBy = [{ updatedAt: 'desc' }]
      break
    case 'title':
      orderBy = [{ title: 'asc' }]
      break
    case 'order':
      orderBy = [{ order: 'asc' }, { createdAt: 'desc' }]
      break
    case 'newest':
    default:
      orderBy = [{ isPinned: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }]
      break
  }
  
  return db.onboardingCard.findMany({
    where,
    orderBy,
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      images: {
        orderBy: { order: 'asc' },
        take: 4, // Preview limit
      },
      linkedEntities: {
        include: {
          entity: {
            select: { id: true, code: true, name: true, type: true },
          },
        },
      },
      _count: {
        select: { comments: true, images: true, children: true },
      },
    },
  })
}

/**
 * Get a single onboarding card by ID
 */
export async function getOnboardingCard(id: string) {
  return db.onboardingCard.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true, avatarUrl: true, role: true },
      },
      parent: {
        select: { id: true, title: true },
      },
      children: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, category: true, status: true },
      },
      images: {
        orderBy: { order: 'asc' },
      },
      linkedEntities: {
        include: {
          entity: {
            select: { id: true, code: true, name: true, type: true, description: true },
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
      _count: {
        select: { comments: true, images: true, children: true },
      },
    },
  })
}

/**
 * Get onboarding cards grouped by category
 */
export async function getOnboardingCardsGroupedByCategory(filters?: OnboardingFilters) {
  const cards = await getOnboardingCards(filters)
  
  type CardWithCategory = typeof cards[0]
  const grouped = new Map<OnboardingCategory, CardWithCategory[]>()
  
  for (const card of cards) {
    const existing = grouped.get(card.category)
    if (existing) {
      existing.push(card)
    } else {
      grouped.set(card.category, [card])
    }
  }
  
  // Return in predefined order
  const orderedCategories: OnboardingCategory[] = [
    'DESIGN_SYSTEM',
    'GAME_FILES',
    'GUIDELINES',
    'TOOLS',
    'REFERENCES',
    'OTHER',
  ]
  
  return orderedCategories
    .filter(cat => grouped.has(cat))
    .map(cat => ({
      category: cat,
      cards: grouped.get(cat) || [],
    }))
}

/**
 * Get onboarding statistics
 */
export async function getOnboardingStats() {
  const [total, byStatus, byCategory] = await Promise.all([
    db.onboardingCard.count(),
    db.onboardingCard.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    db.onboardingCard.groupBy({
      by: ['category'],
      _count: { id: true },
    }),
  ])
  
  return {
    total,
    byStatus: Object.fromEntries(
      byStatus.map((s: { status: string; _count: { id: number } }) => [s.status, s._count.id])
    ) as Record<AssetStatus, number>,
    byCategory: Object.fromEntries(
      byCategory.map((c: { category: string; _count: { id: number } }) => [c.category, c._count.id])
    ) as Record<OnboardingCategory, number>,
  }
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<string[]> {
  const cards = await db.onboardingCard.findMany({
    select: { tags: true },
  })
  
  const allTags = new Set<string>()
  cards.forEach((c: { tags: string[] }) => c.tags.forEach((tag: string) => allTags.add(tag)))
  
  return Array.from(allTags).sort()
}

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new onboarding card
 */
export async function createOnboardingCard(data: CreateOnboardingInput, userId: string) {
  const card = await db.onboardingCard.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category ?? 'OTHER',
      status: data.status ?? 'DRAFT',
      order: data.order ?? 0,
      isPinned: data.isPinned ?? false,
      tags: data.tags ?? [],
      links: data.links ?? [],
      parentId: data.parentId || null,
      createdById: userId,
      linkedEntities: data.linkedEntityIds?.length ? {
        create: data.linkedEntityIds.map(entityId => ({ entityId })),
      } : undefined,
      images: data.images?.length ? {
        create: data.images.map((img, index) => ({
          imageUrl: img.imageUrl,
          caption: img.caption,
          order: img.order ?? index,
        })),
      } : undefined,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      images: {
        orderBy: { order: 'asc' },
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
  
  // Log activity
  await db.activityLog.create({
    data: {
      type: 'CREATED',
      description: `Создана карточка онбординга "${card.title}"`,
      userId,
      metadata: {
        itemType: 'onboarding',
        itemId: card.id,
      },
    },
  })
  
  return card
}

/**
 * Update an onboarding card
 */
export async function updateOnboardingCard(id: string, data: UpdateOnboardingInput, userId: string) {
  // Update linked entities if provided
  if (data.linkedEntityIds !== undefined) {
    await db.onboardingCardEntity.deleteMany({ where: { cardId: id } })
    
    if (data.linkedEntityIds.length > 0) {
      await db.onboardingCardEntity.createMany({
        data: data.linkedEntityIds.map(entityId => ({ cardId: id, entityId })),
      })
    }
  }
  
  // Update images if provided
  if (data.images !== undefined) {
    await db.onboardingImage.deleteMany({ where: { cardId: id } })
    
    if (data.images.length > 0) {
      await db.onboardingImage.createMany({
        data: data.images.map((img, index) => ({
          cardId: id,
          imageUrl: img.imageUrl,
          caption: img.caption,
          order: img.order ?? index,
        })),
      })
    }
  }
  
  const card = await db.onboardingCard.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status,
      order: data.order,
      isPinned: data.isPinned,
      tags: data.tags,
      links: data.links,
      parentId: data.parentId,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
      images: {
        orderBy: { order: 'asc' },
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
  
  // Log activity
  await db.activityLog.create({
    data: {
      type: 'UPDATED',
      description: `Обновлена карточка онбординга "${card.title}"`,
      userId,
      metadata: {
        itemType: 'onboarding',
        itemId: id,
      },
    },
  })
  
  return card
}

/**
 * Delete an onboarding card
 */
export async function deleteOnboardingCard(id: string, userId?: string) {
  const card = await db.onboardingCard.findUnique({ where: { id } })
  
  if (card && userId) {
    await db.activityLog.create({
      data: {
        type: 'DELETED',
        description: `Удалена карточка онбординга "${card.title}"`,
        userId,
        metadata: {
          itemType: 'onboarding',
          itemId: id,
        },
      },
    })
  }
  
  return db.onboardingCard.delete({ where: { id } })
}

/**
 * Change onboarding card status
 */
export async function changeOnboardingStatus(id: string, status: AssetStatus) {
  return db.onboardingCard.update({
    where: { id },
    data: { status },
  })
}

/**
 * Toggle pin status
 */
export async function toggleOnboardingPin(id: string) {
  const card = await db.onboardingCard.findUnique({ where: { id } })
  if (!card) throw new Error('Card not found')
  
  return db.onboardingCard.update({
    where: { id },
    data: { isPinned: !card.isPinned },
  })
}

/**
 * Add image to card
 */
export async function addOnboardingImage(cardId: string, imageUrl: string, caption?: string) {
  const maxOrder = await db.onboardingImage.aggregate({
    where: { cardId },
    _max: { order: true },
  })
  
  return db.onboardingImage.create({
    data: {
      cardId,
      imageUrl,
      caption,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  })
}

/**
 * Remove image from card
 */
export async function removeOnboardingImage(imageId: string) {
  return db.onboardingImage.delete({ where: { id: imageId } })
}

/**
 * Update image order
 */
export async function updateImageOrder(cardId: string, imageIds: string[]) {
  const updates = imageIds.map((id, index) => 
    db.onboardingImage.update({
      where: { id },
      data: { order: index },
    })
  )
  
  return db.$transaction(updates)
}

// ============================================
// COMMENTS
// ============================================

/**
 * Add a comment to an onboarding card
 */
export async function addComment(cardId: string, content: string, userId: string) {
  return db.onboardingComment.create({
    data: {
      content,
      cardId,
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
  return db.onboardingComment.delete({ where: { id } })
}

/**
 * Get comments for an onboarding card
 */
export async function getComments(cardId: string) {
  return db.onboardingComment.findMany({
    where: { cardId },
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


