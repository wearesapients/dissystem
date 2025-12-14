/**
 * Lore Comments API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { isAdmin } from '@/lib/auth/permissions'
import { getComments, addComment, deleteComment } from '@/lib/lore/service'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await params
    const comments = await getComments(id)
    
    return NextResponse.json({ success: true, data: comments })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await params
    const body = await request.json()
    
    if (!body.content) {
      return NextResponse.json({ error: 'Содержание комментария обязательно' }, { status: 400 })
    }
    
    const comment = await addComment(id, body.content, session.user.id)
    
    return NextResponse.json({ success: true, data: comment }, { status: 201 })
  } catch (error) {
    console.error('Add comment error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')
    
    if (!commentId) {
      return NextResponse.json({ error: 'ID комментария обязателен' }, { status: 400 })
    }
    
    await deleteComment(commentId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

