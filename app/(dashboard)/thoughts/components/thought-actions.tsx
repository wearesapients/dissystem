/**
 * Thought Actions Component - Sidebar Layout
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pin, PinOff, Check, X, Pencil, Trash2 } from 'lucide-react'

type ThoughtStatus = 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'
type Entity = { id: string; code: string; name: string }
type User = { id: string; name: string }

interface ActionsProps {
  thought: { id: string; status: ThoughtStatus; isPinned: boolean }
  entities: Entity[]
  users: User[]
}

export function ThoughtActions({ thought }: ActionsProps) {
  const router = useRouter()
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [loading, setLoading] = useState(false)
  
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
    }
  }
  
  const handleDelete = async () => {
    if (!confirm('Delete this thought?')) return
    setLoading(true)
    try {
      await fetch(`/api/thoughts/${thought.id}`, { method: 'DELETE' })
      router.push('/thoughts')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }
  
  const handleReject = async () => {
    await handleAction('changeStatus', { status: 'REJECTED', rejectionReason: rejectReason })
    setShowReject(false)
  }
  
  return (
    <div className="relative space-y-2">
      <button
        onClick={() => handleAction('togglePin')}
        className="btn btn-ghost text-sm w-full justify-start gap-2"
        disabled={loading}
      >
        {thought.isPinned ? (
          <>
            <PinOff size={14} strokeWidth={1.5} className="text-[#A89C6A]" />
            Unpin
          </>
        ) : (
          <>
            <Pin size={14} strokeWidth={1.5} />
            Pin
          </>
        )}
      </button>
      
      {thought.status !== 'APPROVED' && (
        <button
          onClick={() => handleAction('changeStatus', { status: 'APPROVED' })}
          className="btn btn-ghost text-sm w-full justify-start gap-2 text-[#7A8A5C]"
          disabled={loading}
        >
          <Check size={14} strokeWidth={1.5} />
          Approve
        </button>
      )}
      
      {thought.status !== 'REJECTED' && (
        <button
          onClick={() => setShowReject(!showReject)}
          className="btn btn-ghost text-sm w-full justify-start gap-2 text-[#9A4A4A]"
          disabled={loading}
        >
          <X size={14} strokeWidth={1.5} />
          Reject
        </button>
      )}
      
      <Link href={`/thoughts/${thought.id}/edit`} className="btn btn-ghost text-sm w-full justify-start gap-2">
        <Pencil size={14} strokeWidth={1.5} />
        Edit
      </Link>
      
      <button onClick={handleDelete} className="btn btn-danger text-sm w-full justify-start gap-2" disabled={loading}>
        <Trash2 size={14} strokeWidth={1.5} />
        Delete
      </button>
      
      {showReject && (
        <div className="mt-3 p-3 bg-white/5 rounded-xl">
          <label className="block text-xs text-white/60 mb-2">Rejection reason</label>
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            className="input text-sm mb-2"
            placeholder="Why is this rejected?"
            rows={3}
          />
          <div className="flex gap-2">
            <button onClick={handleReject} className="btn btn-danger text-xs flex-1 py-2">
              Reject
            </button>
            <button onClick={() => setShowReject(false)} className="btn btn-ghost text-xs py-2">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
