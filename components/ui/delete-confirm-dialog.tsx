/**
 * Delete Confirmation Dialog with Password
 * Only admins can delete, and they must enter password "deleteit"
 */

'use client'

import { useState } from 'react'
import { AlertTriangle, X, Loader2 } from 'lucide-react'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => Promise<void>
  title?: string
  description?: string
  itemName?: string
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Удаление',
  description = 'Это действие необратимо. Для подтверждения введите пароль.',
  itemName,
}: DeleteConfirmDialogProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!password.trim()) {
      setError('Введите пароль')
      return
    }
    
    setIsLoading(true)
    try {
      await onConfirm(password)
      setPassword('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-[#0F0F10] border border-[#6A665E]/20 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#6A665E]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-[#C7BFAE]">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-[#C7BFAE]/50 hover:text-[#C7BFAE] hover:bg-[#6A665E]/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-[#C7BFAE]/70 text-sm">
            {description}
          </p>
          
          {itemName && (
            <div className="p-3 bg-[#6A665E]/10 rounded-lg border border-[#6A665E]/15">
              <p className="text-sm text-[#C7BFAE]/50">Удаляемый элемент:</p>
              <p className="text-[#C7BFAE] font-medium mt-1">{itemName}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm text-[#C7BFAE]/60 mb-2">
              Пароль для удаления
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Введите пароль..."
              className="w-full px-4 py-3 bg-[#0B0B0C] border border-[#6A665E]/20 rounded-xl text-[#C7BFAE] placeholder:text-[#C7BFAE]/30 focus:outline-none focus:border-[#6A665E]/40 transition-colors"
              autoFocus
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl text-[#C7BFAE]/70 hover:text-[#C7BFAE] hover:bg-[#6A665E]/10 border border-[#6A665E]/20 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Удаление...</span>
                </>
              ) : (
                <span>Удалить</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

