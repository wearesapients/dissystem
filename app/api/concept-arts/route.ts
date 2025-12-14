/**
 * Concept Arts API - List & Create
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { canEditModule, canViewModule } from '@/lib/auth/permissions'
import { 
  getConceptArts, 
  createConceptArt,
  ConceptArtFilters,
  AssetStatus,
  GameEntityType,
  ConceptArtSort
} from '@/lib/concept-art/service'
import { notifyConceptArtCreated } from '@/lib/push/notify'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    if (!canViewModule(user.role, 'concept-art')) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { searchParams } = new URL(request.url)
    
    const filters: ConceptArtFilters = {}
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as AssetStatus
    }
    if (searchParams.get('entityId')) {
      filters.entityId = searchParams.get('entityId')!
    }
    if (searchParams.get('entityType')) {
      filters.entityType = searchParams.get('entityType') as GameEntityType
    }
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!
    }
    if (searchParams.get('tag')) {
      filters.tag = searchParams.get('tag')!
    }
    if (searchParams.get('sort')) {
      filters.sort = searchParams.get('sort') as ConceptArtSort
    }
    
    const arts = await getConceptArts(filters)
    
    return NextResponse.json(arts)
  } catch (error) {
    console.error('Get concept arts error:', error)
    return NextResponse.json({ error: 'Failed to fetch concept arts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    // Check edit permission for concept-art module
    if (!canEditModule(user.role, 'concept-art')) {
      return NextResponse.json({ error: 'Нет прав на создание концепт-артов' }, { status: 403 })
    }
    
    const body = await request.json()
    
    // Validation
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!body.imageUrl?.trim()) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 })
    }
    
    const art = await createConceptArt({
      title: body.title.trim(),
      description: body.description?.trim(),
      imageUrl: body.imageUrl,
      thumbnailUrl: body.thumbnailUrl,
      status: body.status,
      tags: body.tags || [],
      entityId: body.entityId || null,
    }, user.id)
    
    // Send push notification
    notifyConceptArtCreated(user.id, art.title, art.id, art.entity?.name).catch(console.error)
    
    return NextResponse.json(art, { status: 201 })
  } catch (error) {
    console.error('Create concept art error:', error)
    return NextResponse.json({ error: 'Failed to create concept art' }, { status: 500 })
  }
}

