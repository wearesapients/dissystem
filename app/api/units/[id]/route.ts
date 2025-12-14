/**
 * Single Unit API
 * GET - get unit by ID
 * PUT - update unit
 * DELETE - delete unit
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canViewModule, canEditModule, canDelete, verifyDeletePassword } from '@/lib/auth/permissions'
import { getUnit, updateUnit, deleteUnit } from '@/lib/units/service'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canViewModule(session.user.role, 'entities')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await params
    const unit = await getUnit(id)
    
    if (!unit) {
      return NextResponse.json({ error: 'Юнит не найден' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: unit 
    })
  } catch (error) {
    console.error('Get unit error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canEditModule(session.user.role, 'entities')) {
      return NextResponse.json({ error: 'Нет прав на редактирование юнитов' }, { status: 403 })
    }
    
    const { id } = await params
    const existingUnit = await getUnit(id)
    
    if (!existingUnit) {
      return NextResponse.json({ error: 'Юнит не найден' }, { status: 404 })
    }
    
    const body = await request.json()
    const { 
      factionId, name, role, level, xpCurrent, xpToNext,
      hpMax, armor, immunities, wards, hpRegenPercent, xpOnKill,
      description, attacks
    } = body
    
    // Validation
    if (name !== undefined && !name?.trim()) {
      return NextResponse.json({ error: 'Название не может быть пустым' }, { status: 400 })
    }
    
    if (hpMax !== undefined && hpMax <= 0) {
      return NextResponse.json({ error: 'HP должен быть больше 0' }, { status: 400 })
    }
    
    // Validate attacks if provided
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
    
    const unit = await updateUnit(id, {
      factionId,
      name: name?.trim(),
      role,
      level,
      xpCurrent,
      xpToNext,
      hpMax,
      armor,
      immunities,
      wards,
      hpRegenPercent,
      xpOnKill,
      description: description?.trim(),
      attacks,
    }, session.user.id)
    
    return NextResponse.json({ 
      success: true, 
      data: unit 
    })
  } catch (error) {
    console.error('Update unit error:', error)
    const message = error instanceof Error ? error.message : 'Ошибка обновления юнита'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    // Only admin can delete
    if (!canDelete(session.user.role)) {
      return NextResponse.json({ error: 'Только администратор может удалять' }, { status: 403 })
    }
    
    // Verify delete password
    const body = await request.json()
    if (!verifyDeletePassword(body.confirmPassword)) {
      return NextResponse.json({ error: 'Неверный пароль подтверждения' }, { status: 403 })
    }
    
    const { id } = await params
    const unit = await getUnit(id)
    
    if (!unit) {
      return NextResponse.json({ error: 'Юнит не найден' }, { status: 404 })
    }
    
    await deleteUnit(id, session.user.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Юнит удалён' 
    })
  } catch (error) {
    console.error('Delete unit error:', error)
    return NextResponse.json({ error: 'Ошибка удаления юнита' }, { status: 500 })
  }
}

