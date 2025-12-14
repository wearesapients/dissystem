/**
 * Thought Categories API
 * GET - List all categories
 * POST - Create a new category
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

export async function GET() {
  try {
    const categories = await db.thoughtCategory.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: { thoughts: true },
        },
      },
    })
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to fetch thought categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { name, nameEn, description, icon, color } = body
    
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }
    
    // Get max sort order
    const maxOrder = await db.thoughtCategory.aggregate({
      _max: { sortOrder: true },
    })
    
    const category = await db.thoughtCategory.create({
      data: {
        name: name.trim(),
        nameEn: nameEn?.trim() || null,
        description: description?.trim() || null,
        icon: icon || 'Lightbulb',
        color: color || '#6366f1',
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
        createdById: session.user.id,
      },
    })
    
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Failed to create thought category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

