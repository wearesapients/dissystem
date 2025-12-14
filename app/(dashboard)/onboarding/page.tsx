/**
 * Onboarding List Page
 */

import { 
  getOnboardingCards, 
  getOnboardingStats, 
  getAllTags,
  OnboardingSort,
  AssetStatus,
  OnboardingCategory
} from '@/lib/onboarding/service'
import { OnboardingCard } from './components/onboarding-card'
import { OnboardingFilters } from './components/onboarding-filters'
import { OnboardingHeader } from './components/onboarding-header'
import { OnboardingStatusCards } from './components/onboarding-status-cards'
import { OnboardingEmptyState } from './components/onboarding-empty-state'

interface PageProps {
  searchParams: Promise<{
    status?: string
    category?: string
    search?: string
    tag?: string
    sort?: string
  }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function OnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams
  
  const [cards, stats, allTags] = await Promise.all([
    getOnboardingCards({
      status: params.status as AssetStatus | undefined,
      category: params.category as OnboardingCategory | undefined,
      search: params.search,
      tag: params.tag,
      sort: (params.sort as OnboardingSort) || 'newest',
      parentId: null, // Only top-level cards
    }),
    getOnboardingStats(),
    getAllTags(),
  ])
  
  return (
    <div className="animate-in">
      {/* Header */}
      <OnboardingHeader total={stats.total} />
      
      {/* Category Cards */}
      <OnboardingStatusCards stats={stats} currentCategory={params.category} />
      
      {/* Main Content with Filters Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Cards Grid */}
        <div className="flex-1 order-2 lg:order-1">
          {cards.length === 0 ? (
            <OnboardingEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {cards.map((card: any) => (
                <OnboardingCard key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
          <OnboardingFilters
            currentStatus={params.status}
            currentCategory={params.category}
            currentSearch={params.search}
            currentTag={params.tag}
            currentSort={params.sort}
            allTags={allTags}
          />
        </div>
      </div>
    </div>
  )
}

