/**
 * Onboarding Comments Component
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Trash2 } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { formatRelativeTime } from '@/lib/utils'

type Comment = {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

interface OnboardingCommentsProps {
  cardId: string
  comments: Comment[]
  currentUserId: string
}

export function OnboardingComments({ cardId, comments, currentUserId }: OnboardingCommentsProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || loading) return
    
    setLoading(true)
    
    try {
      const res = await fetch(`/api/onboarding/${cardId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() }),
      })
      
      if (res.ok) {
        setNewComment('')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (commentId: string) => {
    if (!confirm(t('common.confirmDelete', locale))) return
    
    try {
      const res = await fetch(`/api/onboarding/${cardId}/comments?commentId=${commentId}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }
  
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-white mb-4">
        {t('thoughts.comments', locale)} ({comments.length})
      </h3>
      
      {/* Comments list */}
      <div className="space-y-4 mb-4">
        {comments.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-4">
            {t('thoughts.noComments', locale)}
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3E2F45] to-[#5A1E1E] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                {comment.author.avatarUrl ? (
                  <img 
                    src={comment.author.avatarUrl} 
                    alt={comment.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  comment.author.name[0]
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{comment.author.name}</span>
                  <span className="text-xs text-white/40">{formatRelativeTime(comment.createdAt)}</span>
                  {comment.author.id === currentUserId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                    >
                      <Trash2 size={12} strokeWidth={1.5} className="text-white/40 hover:text-[#9A4A4A]" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-white/70 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder={t('thoughts.addComment', locale)}
          className="flex-1 py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30"
        />
        <button
          type="submit"
          disabled={!newComment.trim() || loading}
          className="px-4 py-2 bg-[#A89C6A] hover:bg-[#A89C6A]/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Send size={14} strokeWidth={1.5} />
          {t('thoughts.send', locale)}
        </button>
      </form>
    </div>
  )
}


