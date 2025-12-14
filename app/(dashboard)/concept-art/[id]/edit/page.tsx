/**
 * Edit Concept Art Page
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getConceptArt, getGameEntities, getAllTags } from '@/lib/concept-art/service'
import { ConceptArtForm } from '../../components/concept-art-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditConceptArtPage({ params }: PageProps) {
  const { id } = await params
  const [art, entities, existingTags] = await Promise.all([
    getConceptArt(id),
    getGameEntities(),
    getAllTags(),
  ])
  
  if (!art) notFound()
  
  return (
    <div className="animate-in max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href={`/concept-art/${id}`}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Назад к концепту
        </Link>
        <h1 className="text-3xl font-bold text-white">Редактировать концепт-арт</h1>
        <p className="text-white/50 mt-2">{art.title}</p>
      </div>
      
      {/* Form */}
      <ConceptArtForm 
        art={art} 
        entities={entities} 
        existingTags={existingTags}
      />
    </div>
  )
}


