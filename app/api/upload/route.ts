/**
 * File Upload API
 * Handles image uploads for concept arts
 */

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getCurrentUser } from '@/lib/auth/session'
import { randomBytes } from 'crypto'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' 
      }, { status: 400 })
    }
    
    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size: 10MB' 
      }, { status: 400 })
    }
    
    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const uniqueId = randomBytes(16).toString('hex')
    const filename = `${uniqueId}.${ext}`
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'concept-art')
    await mkdir(uploadDir, { recursive: true })
    
    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)
    
    // Return the public URL
    const imageUrl = `/uploads/concept-art/${filename}`
    
    return NextResponse.json({ 
      success: true,
      imageUrl,
      filename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}



