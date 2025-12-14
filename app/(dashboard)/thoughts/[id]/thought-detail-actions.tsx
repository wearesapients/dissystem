/**
 * Thought Detail Actions - Three-dot menu
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { 
  MoreHorizontal, Pin, PinOff, FileEdit, Clock, CheckCircle, 
  XCircle, Trash2, ArrowRight 
} from 'lucide-react'
import { Role } from '@prisma/client'
import { canDelete, canEditModule } from '@/lib/auth/permissions'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'

type ThoughtStatus = 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'

interface Props {
  thought: { 
    id: string
    title: string
    status: ThoughtStatus
    isPinned: boolean 
  }
  userRole: Role
}

export function ThoughtDetailActions({ thought, userRole }: Props) {
  const { locale } = useLocale()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(false)
  
  const canEdit = canEditModule(userRole, 'thoughts')
  const canDeleteThought = canDelete(userRole)
  
  // If user can't edit, don't show the menu
  if (!canEdit) {
    return null
  }
  
  const handleAction = async (action: string, data?: Record<string, unknown>) => {
    setLoading(true)
    try {
      await fetch(`/api/thoughts/${thought.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      })
      router.refresh()
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }
  
  const handleDelete = async (password: string) => {
    const res = await fetch(`/api/thoughts/${thought.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmPassword: password }),
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Ошибка удаления')
    }
    
    router.push('/thoughts')
    router.refresh()
  }
  
  const handleReject = async () => {
    await handleAction('changeStatus', { status: 'REJECTED', rejectionReason: rejectReason })
    setShowRejectModal(false)
    setRejectReason('')
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
        disabled={loading}
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
            {/* Pin/Unpin */}
            <button
              onClick={() => handleAction('togglePin')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              {thought.isPinned ? (
                <>
                  <PinOff size={16} className="text-[#A89C6A]" />
                  {t('thoughts.unpin', locale)}
                </>
              ) : (
                <>
                  <Pin size={16} className="text-white/50" />
                  {t('thoughts.pin', locale)}
                </>
              )}
            </button>
            
            <div className="my-2 border-t border-white/10" />
            <p className="px-3 py-1.5 text-xs text-white/40 uppercase">
              {locale === 'ru' ? 'Изменить статус' : 'Change status'}
            </p>
            
            {thought.status !== 'DRAFT' && (
              <button
                onClick={() => handleAction('changeStatus', { status: 'DRAFT' })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              >
                <FileEdit size={16} className="text-[#8A8F96]" />
                {locale === 'ru' ? 'Черновик' : 'Draft'}
              </button>
            )}
            
            {thought.status !== 'IN_PROGRESS' && (
              <button
                onClick={() => handleAction('changeStatus', { status: 'IN_PROGRESS' })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              >
                <ArrowRight size={16} className="text-[#A89C6A]" />
                {t('thoughts.toWork', locale)}
              </button>
            )}
            
            {thought.status !== 'PENDING' && (
              <button
                onClick={() => handleAction('changeStatus', { status: 'PENDING' })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              >
                <Clock size={16} className="text-[#A89C6A]" />
                {locale === 'ru' ? 'На утверждение' : 'To Review'}
              </button>
            )}
            
            {thought.status !== 'APPROVED' && (
              <button
                onClick={() => handleAction('changeStatus', { status: 'APPROVED' })}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              >
                <CheckCircle size={16} className="text-[#7A8A5C]" />
                {t('thoughts.approve', locale)}
              </button>
            )}
            
            {thought.status !== 'REJECTED' && (
              <button
                onClick={() => {
                  setShowMenu(false)
                  setShowRejectModal(true)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              >
                <XCircle size={16} className="text-[#9A4A4A]" />
                {t('thoughts.reject', locale)}
              </button>
            )}
            
            {canDeleteThought && (
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
                  {t('common.delete', locale)}
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
        title="Удаление мысли"
        description="Комментарии также будут удалены. Это действие необратимо."
        itemName={thought.title}
      />
      
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 max-w-md mx-4 w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
              {t('thoughts.reject', locale)}
            </h3>
            <div className="mb-4">
              <label className="block text-sm text-white/60 mb-2">
                {t('thoughts.rejectionReason', locale)}
              </label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="input"
                placeholder={locale === 'ru' ? 'Укажите причину отклонения...' : 'Specify rejection reason...'}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                }}
                className="flex-1 btn btn-ghost"
              >
                {t('common.cancel', locale)}
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 btn btn-danger"
              >
                {loading 
                  ? (locale === 'ru' ? 'Отклонение...' : 'Rejecting...') 
                  : t('thoughts.reject', locale)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
