/**
 * Dashboard Page - Main Overview with Line Icons
 */

import Link from 'next/link'
import { db } from '@/lib/db'
import { DashboardContent } from './dashboard-content'

async function getStats() {
  const [
    entitiesCount,
    conceptArtsCount,
    loreCount,
    thoughtsCount,
    recentActivity,
    recentConceptArts
  ] = await Promise.all([
    db.gameEntity.count(),
    db.conceptArt.count(),
    db.loreEntry.count(),
    db.thought.count(),
    db.activityLog.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
      include: {
        entity: { select: { id: true, name: true, code: true } },
        user: { select: { name: true } },
      },
    }),
    db.conceptArt.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        entity: { select: { id: true, name: true, type: true } },
        createdBy: { select: { name: true } },
      },
    }),
  ])
  
  const thoughtsByStatus = await db.thought.groupBy({
    by: ['status'],
    _count: { id: true },
  })
  
  return {
    entities: entitiesCount,
    conceptArts: conceptArtsCount,
    lore: loreCount,
    thoughts: thoughtsCount,
    thoughtsByStatus: Object.fromEntries(
      thoughtsByStatus.map(s => [s.status, s._count.id])
    ),
    recentActivity: recentActivity.map(a => ({
      id: a.id,
      type: a.type,
      description: a.description,
      metadata: a.metadata as Record<string, unknown> | null,
      createdAt: a.createdAt.toISOString(),
      entity: a.entity ? { id: a.entity.id, name: a.entity.name, code: a.entity.code } : null,
      user: a.user,
    })),
    recentConceptArts: recentConceptArts.map(c => ({
      id: c.id,
      title: c.title,
      imageUrl: c.imageUrl,
      thumbnailUrl: c.thumbnailUrl,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
      entity: c.entity,
      createdBy: c.createdBy,
    })),
  }
}

export default async function DashboardPage() {
  const stats = await getStats()
  
  return <DashboardContent stats={stats} />
}
