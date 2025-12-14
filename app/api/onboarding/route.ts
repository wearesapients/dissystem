/**
 * Onboarding API - List & Create
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canViewModule, canEditModule } from '@/lib/auth/permissions'
import { 
  getOnboardingCards, 
  createOnboardingCard, 
  getOnboardingStats, 
  getAllTags,
  AssetStatus,
  OnboardingCategory,
  OnboardingSort
} from '@/lib/onboarding/service'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canViewModule(session.user.role, 'onboarding')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { searchParams } = new URL(request.url)
    
    // Check if stats requested
    if (searchParams.get('stats') === 'true') {
      const stats = await getOnboardingStats()
      return NextResponse.json({ success: true, data: stats })
    }
    
    // Check if tags requested
    if (searchParams.get('tags') === 'true') {
      const tags = await getAllTags()
      return NextResponse.json({ success: true, data: tags })
    }
    
    const cards = await getOnboardingCards({
      status: searchParams.get('status') as AssetStatus | undefined,
      category: searchParams.get('category') as OnboardingCategory | undefined,
      search: searchParams.get('search') || undefined,
      tag: searchParams.get('tag') || undefined,
      sort: searchParams.get('sort') as OnboardingSort || undefined,
      parentId: searchParams.get('parentId') || undefined,
    })
    
    return NextResponse.json({ success: true, data: cards })
  } catch (error) {
    console.error('Get onboarding cards error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canEditModule(session.user.role, 'onboarding')) {
      return NextResponse.json({ error: 'Нет прав на создание карточек' }, { status: 403 })
    }
    
    const body = await request.json()
    
    if (!body.title) {
      return NextResponse.json({ error: 'Название обязательно' }, { status: 400 })
    }
    
    const card = await createOnboardingCard(body, session.user.id)
    
    return NextResponse.json({ success: true, data: card }, { status: 201 })
  } catch (error) {
    console.error('Create onboarding card error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
