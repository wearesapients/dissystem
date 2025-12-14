/**
 * Edit Thought Page
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getThought, getGameEntities, getAssignableUsers, getAllTags } from '@/lib/thoughts/service'
import { ThoughtForm } from '../../components/thought-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditThoughtPage({ params }: PageProps) {
  const { id } = await params
  
  const [thought, entities, users, existingTags] = await Promise.all([
    getThought(id),
    getGameEntities(),
    getAssignableUsers(),
    getAllTags(),
  ])
  
  if (!thought) notFound()
  
  return (
    <div className="max-w-3xl mx-auto animate-in">
      <Link href={`/thoughts/${id}`} className="text-white/50 hover:text-white mb-6 inline-block">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold text-white mb-8">Edit Thought</h1>
      <ThoughtForm thought={thought} entities={entities} users={users} existingTags={existingTags} />
    </div>
  )
}
