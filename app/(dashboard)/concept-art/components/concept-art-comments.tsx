/**
 * Concept Art Comments Component
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatRelativeTime } from '@/lib/utils'
import { Send, MessageSquare, Trash2 } from 'lucide-react'

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

type Props = {
  conceptArtId: string
  comments: Comment[]
  currentUserId: string
}

export function ConceptArtComments({ conceptArtId, comments, currentUserId }: Props) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || loading) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/concept-arts/${conceptArtId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      })
      
      if (res.ok) {
        setContent('')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (commentId: string) => {
    if (deleting) return
    
    setDeleting(commentId)
    try {
      await fetch(`/api/concept-arts/${conceptArtId}/comments?commentId=${commentId}`, {
        method: 'DELETE',
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to delete comment:', error)
    } finally {
      setDeleting(null)
    }
  }
  
  return (
    <div className="glass-card p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
        <MessageSquare size={20} strokeWidth={1.5} className="text-[#A89C6A]" />
        Комментарии
        {comments.length > 0 && (
          <span className="text-sm font-normal text-white/40">({comments.length})</span>
        )}
      </h3>
      
      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3E2F45] to-[#5A1E1E] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {comment.author.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{comment.author.name}</span>
                  <span className="text-xs text-white/30">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-white/70 whitespace-pre-wrap">{comment.content}</p>
              </div>
              {comment.author.id === currentUserId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={deleting === comment.id}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#5A1E1E]/20 rounded-lg transition-all"
                >
                  <Trash2 size={14} className="text-[#9A4A4A]" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/40 text-sm mb-6">Пока нет комментариев</p>
      )}
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Написать комментарий..."
          className="flex-1 py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30"
        />
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className="px-4 py-2.5 bg-[#A89C6A] hover:bg-[#A89C6A]/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
        >
          <Send size={16} strokeWidth={2} className="text-white" />
        </button>
      </form>
    </div>
  )
}



