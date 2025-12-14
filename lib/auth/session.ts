/**
 * Session Management
 */

import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { User, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE = 'sapients_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl: string | null
}

export type Session = {
  user: SessionUser
  expires: Date
}

export async function createSession(user: User): Promise<string> {
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + SESSION_DURATION)
  
  await db.session.create({
    data: { sessionToken: token, userId: user.id, expires },
  })
  
  return token
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION / 1000,
  })
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  
  if (!token) return null
  
  const session = await db.session.findUnique({
    where: { sessionToken: token },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true, avatarUrl: true },
      },
    },
  })
  
  if (!session || session.expires < new Date()) {
    return null
  }
  
  return {
    user: session.user,
    expires: session.expires,
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  
  if (token) {
    await db.session.delete({ where: { sessionToken: token } }).catch(() => {})
  }
  
  cookieStore.delete(SESSION_COOKIE)
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return null
  
  const valid = await bcrypt.compare(password, user.passwordHash)
  return valid ? user : null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession()
  return session?.user ?? null
}


