/**
 * Lore API - List & Create
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { canViewModule, canEditModule } from '@/lib/auth/permissions'
import { 
  getLoreEntries, 
  createLoreEntry, 
  getLoreStats, 
  getAllTags,
  AssetStatus,
  LoreType,
  GameEntityType,
  LoreSort
} from '@/lib/lore/service'
import { notifyLoreCreated } from '@/lib/push/notify'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canViewModule(session.user.role, 'lore')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { searchParams } = new URL(request.url)
    
    // Check if stats requested
    if (searchParams.get('stats') === 'true') {
      const stats = await getLoreStats()
      return NextResponse.json({ success: true, data: stats })
    }
    
    // Check if tags requested
    if (searchParams.get('tags') === 'true') {
      const tags = await getAllTags()
      return NextResponse.json({ success: true, data: tags })
    }
    
    const entries = await getLoreEntries({
      status: searchParams.get('status') as AssetStatus | undefined,
      loreType: searchParams.get('loreType') as LoreType | undefined,
      entityId: searchParams.get('entityId') || undefined,
      entityType: searchParams.get('entityType') as GameEntityType | undefined,
      search: searchParams.get('search') || undefined,
      tag: searchParams.get('tag') || undefined,
      sort: searchParams.get('sort') as LoreSort || undefined,
    })
    
    return NextResponse.json({ success: true, data: entries })
  } catch (error) {
    console.error('Get lore entries error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canEditModule(session.user.role, 'lore')) {
      return NextResponse.json({ error: 'Нет прав на создание записей лора' }, { status: 403 })
    }
    
    const body = await request.json()
    
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Заголовок и содержание обязательны' }, { status: 400 })
    }
    
    const entry = await createLoreEntry(body, session.user.id)
    
    // Send push notification
    notifyLoreCreated(session.user.id, entry.title, entry.id, entry.entity?.name).catch(console.error)
    
    return NextResponse.json({ success: true, data: entry }, { status: 201 })
  } catch (error) {
    console.error('Create lore entry error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

