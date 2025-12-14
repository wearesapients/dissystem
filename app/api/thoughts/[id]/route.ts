/**
 * Thoughts API - Single Thought CRUD
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canViewModule, canEditModule, canDelete, verifyDeletePassword } from '@/lib/auth/permissions'
import { getThought, updateThought, deleteThought, toggleThoughtPin, changeThoughtStatus } from '@/lib/thoughts/service'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canViewModule(session.user.role, 'thoughts')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await params
    const thought = await getThought(id)
    
    if (!thought) {
      return NextResponse.json({ error: 'Мысль не найдена' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: thought })
  } catch (error) {
    console.error('Get thought error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canEditModule(session.user.role, 'thoughts')) {
      return NextResponse.json({ error: 'Нет прав на редактирование' }, { status: 403 })
    }
    
    const { id } = await params
    const body = await request.json()
    
    // Handle special actions
    if (body.action === 'togglePin') {
      const thought = await toggleThoughtPin(id)
      return NextResponse.json({ success: true, data: thought })
    }
    
    if (body.action === 'changeStatus') {
      const thought = await changeThoughtStatus(id, body.status, body.rejectionReason)
      return NextResponse.json({ success: true, data: thought })
    }
    
    const thought = await updateThought(id, body)
    return NextResponse.json({ success: true, data: thought })
  } catch (error) {
    console.error('Update thought error:', error)
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
    await deleteThought(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete thought error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}


