/**
 * New Concept Art Page
 */

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getGameEntities, getAllTags } from '@/lib/concept-art/service'
import { requireModuleEdit } from '@/lib/auth/require-module-access'
import { ConceptArtForm } from '../components/concept-art-form'

interface PageProps {
  searchParams: Promise<{ entityId?: string }>
}

export default async function NewConceptArtPage({ searchParams }: PageProps) {
  // Check edit permission
  await requireModuleEdit('concept-art')
  
  const params = await searchParams
  const [entities, existingTags] = await Promise.all([
    getGameEntities(),
    getAllTags(),
  ])
  
  return (
    <div className="animate-in max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/concept-art" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Назад к концепт-артам
        </Link>
        <h1 className="text-3xl font-bold text-white">Загрузить концепт-арт</h1>
        <p className="text-white/50 mt-2">Добавьте визуальный материал к проекту</p>
      </div>
      
      {/* Form */}
      <ConceptArtForm 
        entities={entities} 
        existingTags={existingTags}
        preSelectedEntityId={params.entityId}
      />
    </div>
  )
}

