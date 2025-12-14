/**
 * Entity Actions Component
 * Delete and other actions for entity detail page
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { Role } from '@prisma/client'
import { canDelete } from '@/lib/auth/permissions'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'

interface EntityActionsProps {
  entityId: string
  entityName: string
  userRole: Role
}

export function EntityActions({ entityId, entityName, userRole }: EntityActionsProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const canDeleteEntity = canDelete(userRole)
  
  // If user can't delete, don't show the menu
  if (!canDeleteEntity) {
    return null
  }
  
  const handleDelete = async (password: string) => {
    const res = await fetch(`/api/entities/${entityId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmPassword: password }),
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Ошибка удаления')
    }
    
    router.push('/entities')
    router.refresh()
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <MoreHorizontal size={20} strokeWidth={1.5} className="text-white/50" />
      </button>
      
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#161616] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            <button
              onClick={() => {
                setShowMenu(false)
                setShowDeleteConfirm(true)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#9A4A4A] hover:bg-[#5A1E1E]/10 transition-colors"
            >
              <Trash2 size={16} strokeWidth={1.5} />
              Удалить сущность
            </button>
          </div>
        </>
      )}
      
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Удаление сущности"
        description="Связи с концепт-артами, лором и мыслями будут удалены, но сами записи сохранятся."
        itemName={entityName}
      />
    </div>
  )
}
