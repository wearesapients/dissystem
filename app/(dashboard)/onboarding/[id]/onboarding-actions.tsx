/**
 * Onboarding Card Actions Component
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Trash2, Pin, PinOff, MoreHorizontal } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { Role } from '@prisma/client'
import { canDelete, canEditModule } from '@/lib/auth/permissions'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'

interface OnboardingActionsProps {
  card: {
    id: string
    title: string
    isPinned: boolean
  }
  userRole: Role
}

export function OnboardingActions({ card, userRole }: OnboardingActionsProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const canEdit = canEditModule(userRole, 'onboarding')
  const canDeleteCard = canDelete(userRole)
  
  // If user can't edit, don't show the menu
  if (!canEdit) {
    return null
  }
  
  const handleTogglePin = async () => {
    setLoading(true)
    try {
      await fetch(`/api/onboarding/${card.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'togglePin' }),
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to toggle pin:', error)
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }
  
  const handleDelete = async (password: string) => {
    const res = await fetch(`/api/onboarding/${card.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmPassword: password }),
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Ошибка удаления')
    }
    
    router.push('/onboarding')
    router.refresh()
  }
  
  return (
    <div className="flex items-center gap-2 relative">
      <Link
        href={`/onboarding/${card.id}/edit`}
        className="btn btn-ghost"
      >
        <Edit size={16} strokeWidth={1.5} />
        {t('common.edit', locale)}
      </Link>
      
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <MoreHorizontal size={20} strokeWidth={1.5} className="text-white/60" />
        </button>
        
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
              <button
                onClick={handleTogglePin}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
              >
                {card.isPinned ? (
                  <>
                    <PinOff size={16} strokeWidth={1.5} />
                    {t('thoughts.unpin', locale)}
                  </>
                ) : (
                  <>
                    <Pin size={16} strokeWidth={1.5} />
                    {t('thoughts.pin', locale)}
                  </>
                )}
              </button>
              
              {canDeleteCard && (
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowDeleteConfirm(true)
                  }}
                  disabled={loading}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#9A4A4A] hover:bg-[#5A1E1E]/10 transition-colors"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                  {t('common.delete', locale)}
                </button>
              )}
            </div>
          </>
        )}
      </div>
      
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Удаление карточки"
        description="Все изображения и комментарии также будут удалены. Это действие необратимо."
        itemName={card.title}
      />
    </div>
  )
}

