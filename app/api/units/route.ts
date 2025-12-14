/**
 * Units API
 * GET - list units with filters
 * POST - create new unit
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canViewModule, canEditModule } from '@/lib/auth/permissions'
import { getUnits, createUnit, getFactionsForDropdown, getUnitStats } from '@/lib/units/service'
import type { UnitRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    // Units are part of entities module
    if (!canViewModule(session.user.role, 'entities')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { searchParams } = new URL(request.url)
    const factionId = searchParams.get('factionId') || undefined
    const role = searchParams.get('role') as UnitRole | undefined
    const search = searchParams.get('search') || undefined
    const sort = searchParams.get('sort') as 'newest' | 'oldest' | 'name' | 'level' | 'hp' | undefined
    
    const [units, factions, stats] = await Promise.all([
      getUnits({ factionId, role, search, sort }),
      getFactionsForDropdown(),
      getUnitStats(),
    ])
    
    return NextResponse.json({ 
      success: true, 
      data: { units, factions, stats } 
    })
  } catch (error) {
    console.error('Get units error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    // Units are part of entities module
    if (!canEditModule(session.user.role, 'entities')) {
      return NextResponse.json({ error: 'Нет прав на создание юнитов' }, { status: 403 })
    }
    
    const body = await request.json()
    const { 
      factionId, name, role, level, xpCurrent, xpToNext,
      hpMax, armor, immunities, wards, hpRegenPercent, xpOnKill,
      description, attacks
    } = body
    
    // Validation
    if (!factionId?.trim()) {
      return NextResponse.json({ error: 'Фракция обязательна' }, { status: 400 })
    }
    
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Название обязательно' }, { status: 400 })
    }
    
    if (!hpMax || hpMax <= 0) {
      return NextResponse.json({ error: 'HP должен быть больше 0' }, { status: 400 })
    }
    
    if (!role) {
      return NextResponse.json({ error: 'Роль юнита обязательна' }, { status: 400 })
    }
    
    // Validate attacks
    if (attacks && attacks.length > 0) {
      for (const attack of attacks) {
        if (!attack.name?.trim()) {
          return NextResponse.json({ error: 'Название атаки обязательно' }, { status: 400 })
        }
        if (attack.hitChance < 0 || attack.hitChance > 1) {
          return NextResponse.json({ error: 'Шанс попадания должен быть от 0 до 1' }, { status: 400 })
        }
        if (attack.targets < 1) {
          return NextResponse.json({ error: 'Количество целей должно быть минимум 1' }, { status: 400 })
        }
      }
    }
    
    const unit = await createUnit({
      factionId,
      name: name.trim(),
      role,
      level: level || 1,
      xpCurrent: xpCurrent || 0,
      xpToNext: xpToNext || 80,
      hpMax,
      armor: armor || 0,
      immunities: immunities || [],
      wards: wards || [],
      hpRegenPercent: hpRegenPercent || 0,
      xpOnKill: xpOnKill || 0,
      description: description?.trim() || null,
      attacks: attacks || [],
    }, session.user.id)
    
    return NextResponse.json({ 
      success: true, 
      data: unit 
    }, { status: 201 })
  } catch (error) {
    console.error('Create unit error:', error)
    const message = error instanceof Error ? error.message : 'Ошибка создания юнита'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
