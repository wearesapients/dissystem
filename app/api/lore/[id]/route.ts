/**
 * Lore API - Single Entry Operations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canViewModule, canEditModule, canDelete, verifyDeletePassword } from '@/lib/auth/permissions'
import { 
  getLoreEntry, 
  updateLoreEntry, 
  deleteLoreEntry,
  changeLoreStatus,
  getLoreVersions,
  restoreLoreVersion,
  AssetStatus
} from '@/lib/lore/service'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canViewModule(session.user.role, 'lore')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await params
    const { searchParams } = new URL(request.url)
    
    // Check if versions requested
    if (searchParams.get('versions') === 'true') {
      const versions = await getLoreVersions(id)
      return NextResponse.json({ success: true, data: versions })
    }
    
    const entry = await getLoreEntry(id)
    
    if (!entry) {
      return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: entry })
  } catch (error) {
    console.error('Get lore entry error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canEditModule(session.user.role, 'lore')) {
      return NextResponse.json({ error: 'Нет прав на редактирование' }, { status: 403 })
    }
    
    const { id } = await params
    const body = await request.json()
    
    // Handle status change
    if (body.action === 'changeStatus' && body.status) {
      const entry = await changeLoreStatus(id, body.status as AssetStatus)
      return NextResponse.json({ success: true, data: entry })
    }
    
    // Handle version restore
    if (body.action === 'restoreVersion' && body.version) {
      const entry = await restoreLoreVersion(id, body.version, session.user.id)
      return NextResponse.json({ success: true, data: entry })
    }
    
    // Regular update
    const entry = await updateLoreEntry(id, body, session.user.id)
    
    return NextResponse.json({ success: true, data: entry })
  } catch (error) {
    console.error('Update lore entry error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
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
    
    await deleteLoreEntry(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete lore entry error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
