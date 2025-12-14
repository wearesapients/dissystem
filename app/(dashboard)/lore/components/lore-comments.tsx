/**
 * Lore Comments Component
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Trash2, MessageSquare } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

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

interface LoreCommentsProps {
  loreEntryId: string
  comments: Comment[]
  currentUserId: string
}

export function LoreComments({ loreEntryId, comments, currentUserId }: LoreCommentsProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || loading) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/lore/${loreEntryId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
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
      const res = await fetch(`/api/lore/${loreEntryId}/comments?commentId=${commentId}`, {
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
      <h4 className="font-medium text-white flex items-center gap-2 mb-4">
        <MessageSquare size={16} strokeWidth={1.5} className="text-white/50" />
        {t('thoughts.comments', locale)}
        <span className="text-white/40 font-normal text-sm">({comments.length})</span>
      </h4>
      
      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-white/40 text-xs py-3 text-center">
          {t('thoughts.noComments', locale)}
        </p>
      ) : (
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3E2F45] to-[#5A1E1E] flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0">
                {comment.author.avatarUrl ? (
                  <img 
                    src={comment.author.avatarUrl} 
                    alt={comment.author.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  comment.author.name[0]
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">{comment.author.name}</span>
                  <span className="text-[10px] text-white/40">{formatRelativeTime(comment.createdAt)}</span>
                  {comment.author.id === currentUserId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto p-0.5 text-white/30 hover:text-[#9A4A4A] transition-colors"
                    >
                      <Trash2 size={12} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-white/70 whitespace-pre-wrap mt-0.5">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder={t('thoughts.addComment', locale)}
          className="input flex-1 text-sm py-2"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="btn btn-primary px-3 py-2"
        >
          <Send size={14} strokeWidth={1.5} />
        </button>
      </form>
    </div>
  )
}

