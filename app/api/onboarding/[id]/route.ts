/**
 * Onboarding API - Get, Update, Delete single card
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canViewModule, canEditModule, canDelete, verifyDeletePassword } from '@/lib/auth/permissions'
import { 
  getOnboardingCard, 
  updateOnboardingCard, 
  deleteOnboardingCard,
  changeOnboardingStatus,
  toggleOnboardingPin,
  addOnboardingImage,
  removeOnboardingImage
} from '@/lib/onboarding/service'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canViewModule(session.user.role, 'onboarding')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await context.params
    const card = await getOnboardingCard(id)
    
    if (!card) {
      return NextResponse.json({ error: 'Карточка не найдена' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: card })
  } catch (error) {
    console.error('Get onboarding card error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canEditModule(session.user.role, 'onboarding')) {
      return NextResponse.json({ error: 'Нет прав на редактирование' }, { status: 403 })
    }
    
    const { id } = await context.params
    const body = await request.json()
    
    // Handle special actions
    if (body.action === 'changeStatus' && body.status) {
      const card = await changeOnboardingStatus(id, body.status)
      return NextResponse.json({ success: true, data: card })
    }
    
    if (body.action === 'togglePin') {
      const card = await toggleOnboardingPin(id)
      return NextResponse.json({ success: true, data: card })
    }
    
    if (body.action === 'addImage' && body.imageUrl) {
      const image = await addOnboardingImage(id, body.imageUrl, body.caption)
      return NextResponse.json({ success: true, data: image })
    }
    
    if (body.action === 'removeImage' && body.imageId) {
      await removeOnboardingImage(body.imageId)
      return NextResponse.json({ success: true })
    }
    
    // Regular update
    const card = await updateOnboardingCard(id, body, session.user.id)
    
    return NextResponse.json({ success: true, data: card })
  } catch (error) {
    console.error('Update onboarding card error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
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
    
    const { id } = await context.params
    await deleteOnboardingCard(id, session.user.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete onboarding card error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
