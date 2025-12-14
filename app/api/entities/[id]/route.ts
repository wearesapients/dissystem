/**
 * Single Entity API
 * GET - get entity by ID
 * PUT - update entity
 * DELETE - delete entity
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canDelete, verifyDeletePassword, canEditModule } from '@/lib/auth/permissions'
import { getEntity, updateEntity, deleteEntity, getEntityByCode } from '@/lib/entities/service'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    const { id } = await params
    const entity = await getEntity(id)
    
    if (!entity) {
      return NextResponse.json({ error: 'Сущность не найдена' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: entity 
    })
  } catch (error) {
    console.error('Get entity error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    // Check edit permission
    if (!canEditModule(session.user.role, 'entities')) {
      return NextResponse.json({ error: 'Нет прав на редактирование сущностей' }, { status: 403 })
    }
    
    const { id } = await params
    const existingEntity = await getEntity(id)
    
    if (!existingEntity) {
      return NextResponse.json({ error: 'Сущность не найдена' }, { status: 404 })
    }
    
    const body = await request.json()
    const { name, type, description, shortDescription, iconUrl, code } = body
    
    // Validation
    if (name !== undefined && !name?.trim()) {
      return NextResponse.json({ error: 'Название не может быть пустым' }, { status: 400 })
    }
    
    // Check if code is being changed and if it already exists
    if (code && code.toUpperCase() !== existingEntity.code) {
      const existingCode = await getEntityByCode(code.toUpperCase())
      if (existingCode) {
        return NextResponse.json({ error: 'Сущность с таким кодом уже существует' }, { status: 400 })
      }
    }
    
    const entity = await updateEntity(id, {
      name: name?.trim(),
      code: code?.trim(),
      type,
      description: description?.trim(),
      shortDescription: shortDescription?.trim(),
      iconUrl: iconUrl?.trim(),
    }, session.user.id)
    
    return NextResponse.json({ 
      success: true, 
      data: entity 
    })
  } catch (error) {
    console.error('Update entity error:', error)
    return NextResponse.json({ error: 'Ошибка обновления сущности' }, { status: 500 })
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
    const entity = await getEntity(id)
    
    if (!entity) {
      return NextResponse.json({ error: 'Сущность не найдена' }, { status: 404 })
    }
    
    await deleteEntity(id, session.user.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Сущность удалена' 
    })
  } catch (error) {
    console.error('Delete entity error:', error)
    return NextResponse.json({ error: 'Ошибка удаления сущности' }, { status: 500 })
  }
}

