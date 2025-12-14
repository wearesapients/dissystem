/**
 * Thought Comments Component - Localized
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { MessageSquare } from 'lucide-react'

type Comment = {
  id: string
  content: string
  createdAt: Date
  author: { id: string; name: string; avatarUrl: string | null }
}

interface CommentsProps {
  thoughtId: string
  comments: Comment[]
}

export function ThoughtComments({ thoughtId, comments }: CommentsProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    
    setLoading(true)
    try {
      await fetch(`/api/thoughts/${thoughtId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      setContent('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
        <MessageSquare size={14} strokeWidth={1.5} />
        {t('thoughts.comments', locale)} ({comments.length})
      </h3>
      
      {/* Comment list */}
      <div className="space-y-4 mb-4">
        {comments.map(comment => (
          <div key={comment.id} className="p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3E2F45] to-[#5A1E1E] flex items-center justify-center text-white text-sm font-medium">
                {comment.author.name[0]}
              </div>
              <span className="font-medium text-white">{comment.author.name}</span>
              <span className="text-white/40 text-sm">{formatRelativeTime(comment.createdAt)}</span>
            </div>
            <p className="text-white/80 pl-11">{comment.content}</p>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-white/40 text-center py-4">{t('thoughts.noComments', locale)}</p>
        )}
      </div>
      
      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="input flex-1"
          placeholder={t('thoughts.addComment', locale)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !content.trim()}>
          {loading ? '...' : t('thoughts.send', locale)}
        </button>
      </form>
    </div>
  )
}
