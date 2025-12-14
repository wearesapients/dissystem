/**
 * Push Notification Service
 * Server-side push notification handling
 */

import webpush from 'web-push'
import { db } from '@/lib/db'

// Configure VAPID
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@desolates.space'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

export interface PushPayload {
  title: string
  body: string
  icon?: string
  url?: string
  tag?: string
}

/**
 * Send push notification to a specific user
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  const subscriptions = await db.pushSubscription.findMany({
    where: { userId }
  })
  
  await sendToSubscriptions(subscriptions, payload)
}

/**
 * Send push notification to all users except the sender
 */
export async function sendPushToAllExcept(excludeUserId: string, payload: PushPayload): Promise<void> {
  const subscriptions = await db.pushSubscription.findMany({
    where: {
      userId: { not: excludeUserId }
    }
  })
  
  await sendToSubscriptions(subscriptions, payload)
}

/**
 * Send push notification to all users
 */
export async function sendPushToAll(payload: PushPayload): Promise<void> {
  const subscriptions = await db.pushSubscription.findMany()
  await sendToSubscriptions(subscriptions, payload)
}

/**
 * Send push to multiple subscriptions
 */
async function sendToSubscriptions(
  subscriptions: { id: string; endpoint: string; p256dh: string; auth: string }[],
  payload: PushPayload
): Promise<void> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('[Push] VAPID keys not configured, skipping push')
    return
  }

  const failedSubscriptions: string[] = []
  
  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          },
          JSON.stringify(payload)
        )
      } catch (error: unknown) {
        const err = error as { statusCode?: number }
        console.error(`[Push] Failed to send to ${sub.endpoint}:`, error)
        
        // If subscription is invalid (410 Gone or 404), mark for removal
        if (err.statusCode === 410 || err.statusCode === 404) {
          failedSubscriptions.push(sub.id)
        }
      }
    })
  )
  
  // Remove invalid subscriptions
  if (failedSubscriptions.length > 0) {
    await db.pushSubscription.deleteMany({
      where: { id: { in: failedSubscriptions } }
    })
    console.log(`[Push] Removed ${failedSubscriptions.length} invalid subscriptions`)
  }
}

/**
 * Save push subscription for a user
 */
export async function savePushSubscription(
  userId: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
): Promise<void> {
  await db.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: {
      userId,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    },
    create: {
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    }
  })
}

/**
 * Remove push subscription
 */
export async function removePushSubscription(endpoint: string): Promise<void> {
  await db.pushSubscription.delete({
    where: { endpoint }
  }).catch(() => {
    // Ignore if already deleted
  })
}

/**
 * Check if user has push subscription
 */
export async function userHasPushSubscription(userId: string): Promise<boolean> {
  const count = await db.pushSubscription.count({
    where: { userId }
  })
  return count > 0
}
