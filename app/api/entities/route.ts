/**
 * Game Entities API
 * GET - list entities (for dropdowns)
 * POST - create new entity
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canEditModule, canViewModule } from '@/lib/auth/permissions'
import { getEntitiesForDropdown, createEntity, getEntityByCode, generateEntityCode } from '@/lib/entities/service'
import { getAssignableUsers } from '@/lib/thoughts/service'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    const [entities, users] = await Promise.all([
      getEntitiesForDropdown(),
      getAssignableUsers(),
    ])
    
    return NextResponse.json({ 
      success: true, 
      data: { entities, users } 
    })
  } catch (error) {
    console.error('Get entities error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    // Check edit permission for entities module
    if (!canEditModule(session.user.role, 'entities')) {
      return NextResponse.json({ error: 'Нет прав на создание сущностей' }, { status: 403 })
    }
    
    const body = await request.json()
    const { name, type, description, shortDescription, iconUrl, code: providedCode } = body
    
    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Название обязательно' }, { status: 400 })
    }
    
    if (!type) {
      return NextResponse.json({ error: 'Тип сущности обязателен' }, { status: 400 })
    }
    
    // Generate or use provided code
    let code = providedCode?.trim().toUpperCase()
    if (!code) {
      code = await generateEntityCode(name, type)
    } else {
      // Check if code already exists
      const existing = await getEntityByCode(code)
      if (existing) {
        return NextResponse.json({ error: 'Сущность с таким кодом уже существует' }, { status: 400 })
      }
    }
    
    const entity = await createEntity({
      name: name.trim(),
      code,
      type,
      description: description?.trim() || null,
      shortDescription: shortDescription?.trim() || null,
      iconUrl: iconUrl?.trim() || null,
    }, session.user.id)
    
    return NextResponse.json({ 
      success: true, 
      data: entity 
    }, { status: 201 })
  } catch (error) {
    console.error('Create entity error:', error)
    return NextResponse.json({ error: 'Ошибка создания сущности' }, { status: 500 })
  }
}

