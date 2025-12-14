/**
 * Push Notification Triggers
 * Called when content is created/updated to notify users
 */

import { sendPushToAllExcept, PushPayload } from './service'

// ============================================
// ENTITY NOTIFICATIONS
// ============================================

export async function notifyEntityCreated(
  creatorId: string,
  entityName: string,
  entityType: string,
  entityId: string
): Promise<void> {
  const typeLabels: Record<string, string> = {
    UNIT: 'Юнит',
    HERO: 'Герой',
    FACTION: 'Фракция',
    SPELL: 'Заклинание',
    ARTIFACT: 'Артефакт',
    LOCATION: 'Локация',
    OBJECT: 'Объект',
    OTHER: 'Сущность'
  }
  
  const payload: PushPayload = {
    title: `Новая сущность: ${entityName}`,
    body: `Добавлен ${typeLabels[entityType] || 'объект'}: ${entityName}`,
    url: `/entities/${entityId}`,
    tag: `entity-${entityId}`
  }
  
  await sendPushToAllExcept(creatorId, payload)
}

// ============================================
// CONCEPT ART NOTIFICATIONS
// ============================================

export async function notifyConceptArtCreated(
  creatorId: string,
  artTitle: string,
  artId: string,
  entityName?: string
): Promise<void> {
  const payload: PushPayload = {
    title: 'Новый концепт-арт',
    body: entityName 
      ? `${artTitle} для "${entityName}"`
      : artTitle,
    url: `/concept-art/${artId}`,
    tag: `concept-${artId}`
  }
  
  await sendPushToAllExcept(creatorId, payload)
}

// ============================================
// LORE NOTIFICATIONS
// ============================================

export async function notifyLoreCreated(
  creatorId: string,
  loreTitle: string,
  loreId: string,
  entityName?: string
): Promise<void> {
  const payload: PushPayload = {
    title: 'Новая запись лора',
    body: entityName 
      ? `${loreTitle} для "${entityName}"`
      : loreTitle,
    url: `/lore/${loreId}`,
    tag: `lore-${loreId}`
  }
  
  await sendPushToAllExcept(creatorId, payload)
}

// ============================================
// THOUGHT NOTIFICATIONS
// ============================================

export async function notifyThoughtCreated(
  creatorId: string,
  thoughtTitle: string,
  thoughtId: string
): Promise<void> {
  const payload: PushPayload = {
    title: 'Новая мысль',
    body: thoughtTitle,
    url: `/thoughts/${thoughtId}`,
    tag: `thought-${thoughtId}`
  }
  
  await sendPushToAllExcept(creatorId, payload)
}

// ============================================
// ONBOARDING NOTIFICATIONS
// ============================================

export async function notifyOnboardingCreated(
  creatorId: string,
  cardTitle: string,
  cardId: string
): Promise<void> {
  const payload: PushPayload = {
    title: 'Новый материал онбординга',
    body: cardTitle,
    url: `/onboarding/${cardId}`,
    tag: `onboarding-${cardId}`
  }
  
  await sendPushToAllExcept(creatorId, payload)
}

// ============================================
// COMMENT NOTIFICATIONS
// ============================================

export async function notifyCommentAdded(
  commenterId: string,
  commenterName: string,
  contentTitle: string,
  contentUrl: string
): Promise<void> {
  const payload: PushPayload = {
    title: `${commenterName} оставил комментарий`,
    body: `К "${contentTitle}"`,
    url: contentUrl,
    tag: `comment-${Date.now()}`
  }
  
  await sendPushToAllExcept(commenterId, payload)
}
