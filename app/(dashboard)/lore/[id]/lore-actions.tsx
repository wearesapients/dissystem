/**
 * Lore Actions Component - Status change and delete
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, CheckCircle, XCircle, Clock, Archive, Trash2, FileText } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { Role } from '@prisma/client'
import { canDelete, canEditModule } from '@/lib/auth/permissions'
import { DeleteConfirmDialog } from '@/components/ui/delete-confirm-dialog'

type AssetStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'

interface LoreActionsProps {
  entry: {
    id: string
    title: string
    status: AssetStatus
  }
  userRole: Role
}

export function LoreActions({ entry, userRole }: LoreActionsProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const canEdit = canEditModule(userRole, 'lore')
  const canDeleteEntry = canDelete(userRole)
  
  // If user can't edit, don't show the menu
  if (!canEdit) {
    return null
  }
  
  const statusActions = [
    { status: 'DRAFT' as AssetStatus, icon: FileText, label: t('status.draft', locale), color: 'text-[#8A8F96]' },
    { status: 'IN_REVIEW' as AssetStatus, icon: Clock, label: t('status.inReview', locale), color: 'text-[#A89C6A]' },
    { status: 'APPROVED' as AssetStatus, icon: CheckCircle, label: t('status.approved', locale), color: 'text-[#7A8A5C]' },
    { status: 'REJECTED' as AssetStatus, icon: XCircle, label: t('status.rejected', locale), color: 'text-[#9A4A4A]' },
    { status: 'ARCHIVED' as AssetStatus, icon: Archive, label: t('lore.archived', locale), color: 'text-[#8A8F96]' },
  ]
  
  const handleStatusChange = async (newStatus: AssetStatus) => {
    if (loading || newStatus === entry.status) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/lore/${entry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changeStatus',
          status: newStatus,
        }),
      })
      
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to change status:', error)
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }
  
  const handleDelete = async (password: string) => {
    const res = await fetch(`/api/lore/${entry.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmPassword: password }),
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Ошибка удаления')
    }
    
    router.push('/lore')
    router.refresh()
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="btn btn-ghost p-2"
        disabled={loading}
      >
        <MoreHorizontal size={20} strokeWidth={1.5} />
      </button>
      
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-white/10">
              <p className="px-3 py-1.5 text-xs text-white/40 uppercase tracking-wide">
                {t('lore.changeStatus', locale)}
              </p>
              {statusActions.map(action => {
                const Icon = action.icon
                const isActive = entry.status === action.status
                
                return (
                  <button
                    key={action.status}
                    onClick={() => handleStatusChange(action.status)}
                    disabled={isActive || loading}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive 
                        ? 'bg-white/10 text-white cursor-default' 
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.5} className={action.color} />
                    <span>{action.label}</span>
                    {isActive && (
                      <span className="ml-auto text-xs text-white/40">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
            
            {canDeleteEntry && (
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowDeleteConfirm(true)
                  }}
                  disabled={loading}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#9A4A4A] hover:bg-[#5A1E1E]/10 transition-colors"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                  <span>{t('common.delete', locale)}</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Удаление записи лора"
        description="Все версии записи также будут удалены. Это действие необратимо."
        itemName={entry.title}
      />
    </div>
  )
}

