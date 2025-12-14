/**
 * Thought Comments API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { isAdmin } from '@/lib/auth/permissions'
import { addComment } from '@/lib/thoughts/service'

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session || !isAdmin(session.user.role)) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }
    
    const { id } = await params
    const { content } = await request.json()
    
    if (!content) {
      return NextResponse.json({ error: 'Комментарий не может быть пустым' }, { status: 400 })
    }
    
    const comment = await addComment(id, content, session.user.id)
    
    return NextResponse.json({ success: true, data: comment }, { status: 201 })
  } catch (error) {
    console.error('Add comment error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}




