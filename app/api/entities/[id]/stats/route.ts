/**
 * API Route: Entity Unit Stats
 * POST - Create unit stats for an entity
 * PUT - Update unit stats for an entity
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth/session'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id: entityId } = await params
    const body = await request.json()
    
    // Validate entity exists and is of type UNIT
    const entity = await db.gameEntity.findUnique({
      where: { id: entityId },
      select: { id: true, type: true, unitProfile: { select: { id: true } } },
    })
    
    if (!entity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 })
    }
    
    if (entity.type !== 'UNIT') {
      return NextResponse.json({ error: 'Entity is not a UNIT type' }, { status: 400 })
    }
    
    if (entity.unitProfile) {
      return NextResponse.json({ error: 'Unit stats already exist. Use PUT to update.' }, { status: 400 })
    }
    
    // Validate faction exists
    const faction = await db.gameEntity.findFirst({
      where: { id: body.factionId, type: 'FACTION' },
    })
    
    if (!faction) {
      return NextResponse.json({ error: 'Faction not found' }, { status: 400 })
    }
    
    // Create unit with attacks
    const unit = await db.unit.create({
      data: {
        entityId,
        factionId: body.factionId,
        name: body.name,
        role: body.role || 'MELEE',
        level: body.level || 1,
        xpCurrent: body.xpCurrent || 0,
        xpToNext: body.xpToNext || 80,
        hpMax: body.hpMax,
        armor: body.armor || 0,
        immunities: body.immunities || [],
        wards: body.wards || [],
        hpRegenPercent: body.hpRegenPercent || 0,
        xpOnKill: body.xpOnKill || 0,
        description: body.description || null,
        prevEvolutionId: body.prevEvolutionId || null,
        nextEvolutionIds: body.nextEvolutionIds || [],
        createdById: user.id,
        attacks: body.attacks ? {
          create: body.attacks.map((attack: {
            name: string
            hitChance: number
            damage: number | null
            heal: number | null
            damageSource: string
            initiative: number
            reach: string
            targets: number
          }) => ({
            name: attack.name,
            hitChance: attack.hitChance,
            damage: attack.damage,
            heal: attack.heal,
            damageSource: attack.damageSource || 'WEAPON',
            initiative: attack.initiative || 50,
            reach: attack.reach || 'ADJACENT',
            targets: attack.targets || 1,
          })),
        } : undefined,
      },
      include: {
        attacks: true,
        faction: { select: { id: true, name: true } },
      },
    })
    
    // Log activity
    await db.activityLog.create({
      data: {
        type: 'CREATED',
        description: `Добавлены характеристики юнита "${body.name}"`,
        entityId,
        userId: user.id,
        metadata: {
          itemType: 'unit_stats',
          itemId: unit.id,
        },
      },
    })
    
    return NextResponse.json(unit)
  } catch (error) {
    console.error('Error creating unit stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id: entityId } = await params
    const body = await request.json()
    
    // Find existing unit profile
    const existingUnit = await db.unit.findFirst({
      where: { entityId },
      include: { attacks: true },
    })
    
    if (!existingUnit) {
      return NextResponse.json({ error: 'Unit stats not found' }, { status: 404 })
    }
    
    // Delete old attacks and create new ones
    await db.attack.deleteMany({
      where: { unitId: existingUnit.id },
    })
    
    // Update unit
    const unit = await db.unit.update({
      where: { id: existingUnit.id },
      data: {
        factionId: body.factionId,
        name: body.name,
        role: body.role,
        level: body.level,
        xpCurrent: body.xpCurrent,
        xpToNext: body.xpToNext,
        hpMax: body.hpMax,
        armor: body.armor,
        immunities: body.immunities || [],
        wards: body.wards || [],
        hpRegenPercent: body.hpRegenPercent,
        xpOnKill: body.xpOnKill,
        description: body.description,
        prevEvolutionId: body.prevEvolutionId || null,
        nextEvolutionIds: body.nextEvolutionIds || [],
        attacks: body.attacks ? {
          create: body.attacks.map((attack: {
            name: string
            hitChance: number
            damage: number | null
            heal: number | null
            damageSource: string
            initiative: number
            reach: string
            targets: number
          }) => ({
            name: attack.name,
            hitChance: attack.hitChance,
            damage: attack.damage,
            heal: attack.heal,
            damageSource: attack.damageSource || 'WEAPON',
            initiative: attack.initiative || 50,
            reach: attack.reach || 'ADJACENT',
            targets: attack.targets || 1,
          })),
        } : undefined,
      },
      include: {
        attacks: true,
        faction: { select: { id: true, name: true } },
      },
    })
    
    // Log activity
    await db.activityLog.create({
      data: {
        type: 'UPDATED',
        description: `Обновлены характеристики юнита "${body.name}"`,
        entityId,
        userId: user.id,
        metadata: {
          itemType: 'unit_stats',
          itemId: unit.id,
        },
      },
    })
    
    return NextResponse.json(unit)
  } catch (error) {
    console.error('Error updating unit stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


