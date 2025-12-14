/**
 * Concept Art API - Single item operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { canDelete, verifyDeletePassword, canEditModule, canViewModule } from '@/lib/auth/permissions'
import { 
  getConceptArt, 
  updateConceptArt, 
  deleteConceptArt,
  changeConceptArtStatus 
} from '@/lib/concept-art/service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canViewModule(user.role, 'concept-art')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await params
    const art = await getConceptArt(id)
    
    if (!art) {
      return NextResponse.json({ error: 'Concept art not found' }, { status: 404 })
    }
    
    return NextResponse.json(art)
  } catch (error) {
    console.error('Get concept art error:', error)
    return NextResponse.json({ error: 'Failed to fetch concept art' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    // Check edit permission
    if (!canEditModule(user.role, 'concept-art')) {
      return NextResponse.json({ error: 'Нет прав на редактирование' }, { status: 403 })
    }
    
    const { id } = await params
    const body = await request.json()
    
    // Check if concept art exists
    const existing = await getConceptArt(id)
    if (!existing) {
      return NextResponse.json({ error: 'Concept art not found' }, { status: 404 })
    }
    
    const art = await updateConceptArt(id, {
      title: body.title?.trim(),
      description: body.description?.trim(),
      imageUrl: body.imageUrl,
      thumbnailUrl: body.thumbnailUrl,
      status: body.status,
      tags: body.tags,
      entityId: body.entityId,
    })
    
    return NextResponse.json(art)
  } catch (error) {
    console.error('Update concept art error:', error)
    return NextResponse.json({ error: 'Failed to update concept art' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    // Check edit permission
    if (!canEditModule(user.role, 'concept-art')) {
      return NextResponse.json({ error: 'Нет прав на изменение статуса' }, { status: 403 })
    }
    
    const { id } = await params
    const body = await request.json()
    
    // Check if concept art exists
    const existing = await getConceptArt(id)
    if (!existing) {
      return NextResponse.json({ error: 'Concept art not found' }, { status: 404 })
    }
    
    // Status change
    if (body.status) {
      const art = await changeConceptArtStatus(id, body.status)
      return NextResponse.json(art)
    }
    
    return NextResponse.json({ error: 'Invalid patch operation' }, { status: 400 })
  } catch (error) {
    console.error('Patch concept art error:', error)
    return NextResponse.json({ error: 'Failed to update concept art' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    // Only admin can delete
    if (!canDelete(user.role)) {
      return NextResponse.json({ error: 'Только администратор может удалять' }, { status: 403 })
    }
    
    // Verify delete password
    const body = await request.json()
    if (!verifyDeletePassword(body.confirmPassword)) {
      return NextResponse.json({ error: 'Неверный пароль подтверждения' }, { status: 403 })
    }
    
    const { id } = await params
    
    // Check if concept art exists
    const existing = await getConceptArt(id)
    if (!existing) {
      return NextResponse.json({ error: 'Концепт-арт не найден' }, { status: 404 })
    }
    
    await deleteConceptArt(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete concept art error:', error)
    return NextResponse.json({ error: 'Ошибка удаления концепт-арта' }, { status: 500 })
  }
}

