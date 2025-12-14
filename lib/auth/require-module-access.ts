/**
 * Helper to check module access on pages
 */

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { canViewModule, canEditModule, type Module } from '@/lib/auth/permissions'

/**
 * Check if user has view access to module, redirect to dashboard if not
 */
export async function requireModuleView(module: Module) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  if (!canViewModule(user.role, module)) {
    redirect('/dashboard')
  }
  
  return user
}

/**
 * Check if user has edit access to module, redirect to module page if not
 */
export async function requireModuleEdit(module: Module, redirectPath?: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  if (!canEditModule(user.role, module)) {
    redirect(redirectPath || `/${module}`)
  }
  
  return user
}

