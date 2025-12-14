/**
 * Thoughts API - List & Create
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canViewModule, canEditModule } from '@/lib/auth/permissions'
import { getThoughts, createThought, getThoughtsStats, getAllTags } from '@/lib/thoughts/service'
import { ThoughtStatus, ThoughtPriority } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canViewModule(session.user.role, 'thoughts')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { searchParams } = new URL(request.url)
    
    // Check if stats requested
    if (searchParams.get('stats') === 'true') {
      const stats = await getThoughtsStats()
      return NextResponse.json({ success: true, data: stats })
    }
    
    // Check if tags requested
    if (searchParams.get('tags') === 'true') {
      const tags = await getAllTags()
      return NextResponse.json({ success: true, data: tags })
    }
    
    const thoughts = await getThoughts({
      status: searchParams.get('status') as ThoughtStatus | undefined,
      priority: searchParams.get('priority') as ThoughtPriority | undefined,
      entityId: searchParams.get('entityId') || undefined,
      search: searchParams.get('search') || undefined,
      tag: searchParams.get('tag') || undefined,
    })
    
    return NextResponse.json({ success: true, data: thoughts })
  } catch (error) {
    console.error('Get thoughts error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canEditModule(session.user.role, 'thoughts')) {
      return NextResponse.json({ error: 'Нет прав на создание мыслей' }, { status: 403 })
    }
    
    const body = await request.json()
    
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Заголовок и содержание обязательны' }, { status: 400 })
    }
    
    const thought = await createThought(body, session.user.id)
    
    return NextResponse.json({ success: true, data: thought }, { status: 201 })
  } catch (error) {
    console.error('Create thought error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}


