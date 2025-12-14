/**
 * Onboarding Comments API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { isAdmin } from '@/lib/auth/permissions'
import { addComment, deleteComment, getComments } from '@/lib/onboarding/service'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await context.params
    const comments = await getComments(id)
    
    return NextResponse.json({ success: true, data: comments })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await context.params
    const { content } = await request.json()
    
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Комментарий не может быть пустым' }, { status: 400 })
    }
    
    const comment = await addComment(id, content.trim(), session.user.id)
    
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
      return NextResponse.json({ error: 'ID комментария не указан' }, { status: 400 })
    }
    
    await deleteComment(commentId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
