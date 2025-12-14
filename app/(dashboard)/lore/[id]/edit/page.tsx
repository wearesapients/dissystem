/**
 * Edit Lore Entry Page
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { getLoreEntry, getGameEntities, getAllTags } from '@/lib/lore/service'
import { LoreForm } from '../../components/lore-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function EditLorePage({ params }: PageProps) {
  const { id } = await params
  
  const [entry, entities, existingTags] = await Promise.all([
    getLoreEntry(id),
    getGameEntities(),
    getAllTags(),
  ])
  
  if (!entry) {
    notFound()
  }
  
  // Transform entry for form
  const formEntry = {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    summary: entry.summary,
    loreType: entry.loreType,
    status: entry.status,
    entityId: entry.entityId,
    tags: entry.tags,
    linkedEntities: entry.linkedEntities,
  }
  
  return (
    <div className="animate-in max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href={`/lore/${id}`}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Назад к записи
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E2F45]/20 to-[#5A1E1E]/20 flex items-center justify-center">
            <BookOpen size={24} strokeWidth={1.5} className="text-[#8A6A9A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Редактирование записи</h1>
            <p className="text-white/50">{entry.title}</p>
          </div>
        </div>
      </div>
      
      {/* Form */}
      <LoreForm 
        entry={formEntry}
        entities={entities}
        existingTags={existingTags}
      />
    </div>
  )
}


