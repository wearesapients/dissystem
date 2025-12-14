/**
 * Edit Onboarding Card Page
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { OnboardingForm } from '../../components/onboarding-form'
import { getOnboardingCard, getGameEntities, getAllTags, getOnboardingCards } from '@/lib/onboarding/service'

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function EditOnboardingPage({ params }: PageProps) {
  const { id } = await params
  const [card, entities, existingTags, allCards] = await Promise.all([
    getOnboardingCard(id),
    getGameEntities(),
    getAllTags(),
    getOnboardingCards(),
  ])
  
  if (!card) {
    notFound()
  }
  
  return (
    <div className="animate-in max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href={`/onboarding/${id}`} 
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          Назад к карточке
        </Link>
        <h1 className="text-2xl font-semibold text-white">Редактирование</h1>
        <p className="text-white/50 mt-1">{card.title}</p>
      </div>
      
      <OnboardingForm 
        card={{
          id: card.id,
          title: card.title,
          description: card.description,
          category: card.category,
          status: card.status,
          order: card.order,
          isPinned: card.isPinned,
          tags: card.tags,
          links: card.links,
          parentId: card.parentId,
          images: card.images.map(img => ({
            id: img.id,
            imageUrl: img.imageUrl,
            caption: img.caption,
            order: img.order,
          })),
          linkedEntities: card.linkedEntities,
        }}
        entities={entities}
        existingTags={existingTags}
        allCards={allCards.map(c => ({ id: c.id, title: c.title }))}
      />
    </div>
  )
}


