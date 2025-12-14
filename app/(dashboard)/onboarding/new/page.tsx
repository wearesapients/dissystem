/**
 * New Onboarding Card Page
 */

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { OnboardingForm } from '../components/onboarding-form'
import { getGameEntities, getAllTags, getOnboardingCards } from '@/lib/onboarding/service'

export const dynamic = 'force-dynamic'

export default async function NewOnboardingPage() {
  const [entities, existingTags, allCards] = await Promise.all([
    getGameEntities(),
    getAllTags(),
    getOnboardingCards(),
  ])
  
  return (
    <div className="animate-in max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/onboarding" 
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
          Назад к онбордингу
        </Link>
        <h1 className="text-2xl font-semibold text-white">Новая карточка</h1>
        <p className="text-white/50 mt-1">Добавьте материал для онбординга команды</p>
      </div>
      
      <OnboardingForm 
        entities={entities}
        existingTags={existingTags}
        allCards={allCards.map(c => ({ id: c.id, title: c.title }))}
      />
    </div>
  )
}
