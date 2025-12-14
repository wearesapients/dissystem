/**
 * Concept Art Actions Component
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, MoreHorizontal, CheckCircle, Clock, XCircle, FileEdit } from 'lucide-react'
import { Role } from '@prisma/client'
import { canDelete, canEditModule } from '@/lib/auth/permissions'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'

type Props = {
  id: string
  title: string
  userRole: Role
}

export function ConceptArtActions({ id, title, userRole }: Props) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const canEdit = canEditModule(userRole, 'concept-art')
  const canDeleteArt = canDelete(userRole)
  
  const handleStatusChange = async (status: string) => {
    setLoading(true)
    try {
      await fetch(`/api/concept-arts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to change status:', error)
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }
  
  const handleDelete = async (password: string) => {
    const res = await fetch(`/api/concept-arts/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmPassword: password }),
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Ошибка удаления')
    }
    
    router.push('/concept-art')
    router.refresh()
  }
  
  // If user can't edit, don't show the menu at all
  if (!canEdit) {
    return null
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
      >
        <MoreHorizontal size={18} className="text-white/70" />
      </button>
      
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-[#1c1c1e] border border-white/10 rounded-xl shadow-xl z-50">
            <p className="px-3 py-1.5 text-xs text-white/40 uppercase">Изменить статус</p>
            
            <button
              onClick={() => handleStatusChange('DRAFT')}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              <FileEdit size={16} className="text-[#8A8F96]" />
              Черновик
            </button>
            <button
              onClick={() => handleStatusChange('IN_REVIEW')}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              <Clock size={16} className="text-[#A89C6A]" />
              На проверку
            </button>
            <button
              onClick={() => handleStatusChange('APPROVED')}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              <CheckCircle size={16} className="text-[#7A8A5C]" />
              Утвердить
            </button>
            <button
              onClick={() => handleStatusChange('REJECTED')}
              disabled={loading}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              <XCircle size={16} className="text-[#9A4A4A]" />
              Отклонить
            </button>
            
            {canDeleteArt && (
              <>
                <div className="my-2 border-t border-white/10" />
                
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowDeleteConfirm(true)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#9A4A4A] hover:bg-[#9A4A4A]/10"
                >
                  <Trash2 size={16} />
                  Удалить
                </button>
              </>
            )}
          </div>
        </>
      )}
      
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Удаление концепт-арта"
        description="Файл изображения также будет удалён. Это действие необратимо."
        itemName={title}
      />
    </div>
  )
}
