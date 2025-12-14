/**
 * New Thought Page - Supports pre-selecting entity from URL params
 */

import Link from 'next/link'
import { ArrowLeft, Box } from 'lucide-react'
import { ThoughtForm } from '../components/thought-form'
import { getGameEntities, getAssignableUsers, getAllTags } from '@/lib/thoughts/service'

interface PageProps {
  searchParams: Promise<{ entityId?: string; entityName?: string }>
}

export default async function NewThoughtPage({ searchParams }: PageProps) {
  const params = await searchParams
  const [entities, users, existingTags] = await Promise.all([
    getGameEntities(),
    getAssignableUsers(),
    getAllTags(),
  ])
  
  // Find pre-selected entity if coming from entity page
  const preSelectedEntity = params.entityId 
    ? entities.find(e => e.id === params.entityId) 
    : undefined
  
  return (
    <div className="max-w-3xl mx-auto animate-in">
      {/* Back navigation - contextual */}
      {params.entityId && params.entityName ? (
        <Link 
          href={`/entities/${params.entityId}?tab=thoughts`}
          className="text-white/50 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          <Box size={14} strokeWidth={1.5} className="text-[#A89C6A]" />
          <span>Назад к <span className="text-[#A89C6A]">{params.entityName}</span></span>
        </Link>
      ) : (
        <Link 
          href="/thoughts"
          className="text-white/50 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Назад к мыслям
        </Link>
      )}
      
      <h1 className="text-3xl font-bold text-white mb-2">Новая мысль</h1>
      {preSelectedEntity && (
        <p className="text-white/50 mb-8">
          Для сущности: <span className="text-[#A89C6A]">{preSelectedEntity.name}</span>
        </p>
      )}
      {!preSelectedEntity && <div className="mb-8" />}
      
      <ThoughtForm 
        entities={entities} 
        users={users} 
        existingTags={existingTags}
        preSelectedEntityId={preSelectedEntity?.id}
      />
    </div>
  )
}
