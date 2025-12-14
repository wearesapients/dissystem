/**
 * Create New Lore Entry Page
 */

import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { LoreForm } from '../components/lore-form'
import { getGameEntities, getAllTags } from '@/lib/lore/service'

interface PageProps {
  searchParams: Promise<{
    entityId?: string
  }>
}

export default async function NewLorePage({ searchParams }: PageProps) {
  const params = await searchParams
  
  const [entities, existingTags] = await Promise.all([
    getGameEntities(),
    getAllTags(),
  ])
  
  return (
    <div className="animate-in max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/lore" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Назад к лору
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E2F45]/20 to-[#5A1E1E]/20 flex items-center justify-center">
            <BookOpen size={24} strokeWidth={1.5} className="text-[#8A6A9A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Новая запись лора</h1>
            <p className="text-white/50">Создание нарративного контента</p>
          </div>
        </div>
      </div>
      
      {/* Form */}
      <LoreForm 
        entities={entities}
        existingTags={existingTags}
        preSelectedEntityId={params.entityId}
      />
    </div>
  )
}

