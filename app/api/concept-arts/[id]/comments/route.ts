/**
 * Concept Art Comments API
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { addComment, deleteComment, getConceptArt } from '@/lib/concept-art/service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    const body = await request.json()
    
    if (!body.content?.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }
    
    // Check if concept art exists
    const art = await getConceptArt(id)
    if (!art) {
      return NextResponse.json({ error: 'Concept art not found' }, { status: 404 })
    }
    
    const comment = await addComment(id, body.content.trim(), user.id)
    
    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Add comment error:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')
    
    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
    }
    
    await deleteComment(commentId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}


