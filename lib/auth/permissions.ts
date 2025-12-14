/**
 * RBAC Permission System
 */

import { Role } from '@prisma/client'

// Module identifiers
export type Module = 
  | 'dashboard' 
  | 'onboarding' 
  | 'entities' 
  | 'thoughts' 
  | 'concept-art' 
  | 'lore'

// Role levels for comparison
const ROLE_LEVELS: Record<Role, number> = {
  ADMIN: 100,
  EXECUTIVE_PRODUCER: 80,
  CREATIVE_DIRECTOR: 70,
  CONCEPT_ARTIST: 35,
  ARTIST: 30,
  WRITER: 30,
  VIEWER: 10,
}

// Module visibility by role
const MODULE_VIEW_ACCESS: Record<Role, Module[]> = {
  ADMIN: ['dashboard', 'onboarding', 'entities', 'thoughts', 'concept-art', 'lore'],
  EXECUTIVE_PRODUCER: ['dashboard', 'onboarding', 'entities', 'thoughts', 'concept-art', 'lore'],
  CREATIVE_DIRECTOR: ['dashboard', 'onboarding', 'entities', 'thoughts', 'concept-art', 'lore'],
  CONCEPT_ARTIST: ['dashboard', 'onboarding', 'entities', 'concept-art'],
  ARTIST: ['dashboard', 'onboarding', 'entities', 'concept-art'],
  WRITER: ['dashboard', 'onboarding', 'entities', 'lore'],
  VIEWER: ['dashboard', 'onboarding', 'entities'],
}

// Module edit access by role
const MODULE_EDIT_ACCESS: Record<Role, Module[]> = {
  ADMIN: ['dashboard', 'onboarding', 'entities', 'thoughts', 'concept-art', 'lore'],
  EXECUTIVE_PRODUCER: ['dashboard', 'onboarding', 'entities', 'thoughts', 'concept-art', 'lore'],
  CREATIVE_DIRECTOR: ['dashboard', 'onboarding', 'entities', 'thoughts', 'concept-art', 'lore'],
  CONCEPT_ARTIST: ['concept-art'], // Can only edit concept art
  ARTIST: ['concept-art'],
  WRITER: ['lore'],
  VIEWER: [],
}

// ============================================
// BASIC ROLE CHECKS
// ============================================

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole]
}

export function isAdmin(role: Role): boolean {
  return role === 'ADMIN'
}

// ============================================
// MODULE ACCESS
// ============================================

/**
 * Check if role can view a module (see it in sidebar, access pages)
 */
export function canViewModule(role: Role, module: Module): boolean {
  return MODULE_VIEW_ACCESS[role]?.includes(module) ?? false
}

/**
 * Check if role can edit/create in a module
 */
export function canEditModule(role: Role, module: Module): boolean {
  return MODULE_EDIT_ACCESS[role]?.includes(module) ?? false
}

/**
 * Get all visible modules for a role
 */
export function getVisibleModules(role: Role): Module[] {
  return MODULE_VIEW_ACCESS[role] ?? []
}

/**
 * Get all editable modules for a role
 */
export function getEditableModules(role: Role): Module[] {
  return MODULE_EDIT_ACCESS[role] ?? []
}

// ============================================
// DELETE ACCESS - ADMIN ONLY WITH PASSWORD
// ============================================

const DELETE_PASSWORD = 'deleteit'

/**
 * Check if role can delete anything
 */
export function canDelete(role: Role): boolean {
  return role === 'ADMIN'
}

/**
 * Verify delete password
 */
export function verifyDeletePassword(password: string): boolean {
  return password === DELETE_PASSWORD
}

/**
 * Full delete check - role + password
 */
export function canDeleteWithPassword(role: Role, password: string): boolean {
  return canDelete(role) && verifyDeletePassword(password)
}

// ============================================
// LEGACY FUNCTIONS (for backwards compatibility)
// ============================================

export function canManageThoughts(role: Role): boolean {
  return canEditModule(role, 'thoughts')
}

export function canApproveThoughts(role: Role): boolean {
  return ['ADMIN', 'EXECUTIVE_PRODUCER'].includes(role)
}

// ============================================
// COMMENT ACCESS
// ============================================

/**
 * Check if user can comment on items in a module
 * All users with view access can comment
 */
export function canComment(role: Role, module: Module): boolean {
  return canViewModule(role, module)
}

// ============================================
// UPLOAD ACCESS
// ============================================

/**
 * Check if user can upload files
 * Users who can edit concept-art can upload
 */
export function canUpload(role: Role): boolean {
  return canEditModule(role, 'concept-art') || hasRole(role, 'CREATIVE_DIRECTOR')
}

// ============================================
// ROLE FORMATTING
// ============================================

export function formatRole(role: Role): string {
  const names: Record<Role, string> = {
    ADMIN: 'Администратор',
    EXECUTIVE_PRODUCER: 'Исполнительный продюсер',
    CREATIVE_DIRECTOR: 'Креативный директор',
    CONCEPT_ARTIST: 'Концепт-артист',
    ARTIST: 'Художник',
    WRITER: 'Сценарист',
    VIEWER: 'Наблюдатель',
  }
  return names[role]
}
