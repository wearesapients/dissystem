/**
 * Onboarding Status Cards
 */

'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { ONBOARDING_CATEGORY_LABELS, OnboardingCategory, AssetStatus } from '@/lib/onboarding/service'

interface Stats {
  total: number
  byStatus: Record<AssetStatus, number>
  byCategory: Record<OnboardingCategory, number>
}

interface OnboardingStatusCardsProps {
  stats: Stats
  currentCategory?: string
}

const categoryColors: Record<OnboardingCategory, string> = {
  DESIGN_SYSTEM: 'from-[#3E2F45]/30 to-[#2A2A2D]/20 border-[#3E2F45]/25',
  GAME_FILES: 'from-[#3B4F52]/30 to-[#2A2A2D]/20 border-[#3B4F52]/25',
  GUIDELINES: 'from-[#4F5A3C]/30 to-[#2A2A2D]/20 border-[#4F5A3C]/25',
  TOOLS: 'from-[#6A665E]/30 to-[#2A2A2D]/20 border-[#6A665E]/25',
  REFERENCES: 'from-[#5F646B]/30 to-[#2A2A2D]/20 border-[#5F646B]/25',
  OTHER: 'from-[#5F646B]/30 to-[#2A2A2D]/20 border-[#5F646B]/25',
}

export function OnboardingStatusCards({ stats, currentCategory }: OnboardingStatusCardsProps) {
  const { locale } = useLocale()
  const searchParams = useSearchParams()
  
  const categories = Object.entries(ONBOARDING_CATEGORY_LABELS) as [OnboardingCategory, { en: string; ru: string }][]
  
  const buildUrl = (category: OnboardingCategory | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    return `/onboarding?${params.toString()}`
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 sm:mb-8">
      {categories.map(([cat, labels]) => {
        const count = stats.byCategory[cat] || 0
        const isActive = currentCategory === cat
        
        return (
          <Link
            key={cat}
            href={buildUrl(isActive ? null : cat)}
            className={cn(
              'p-4 rounded-xl border transition-all',
              'bg-gradient-to-br',
              categoryColors[cat],
              isActive && 'ring-2 ring-white/30'
            )}
          >
            <p className="text-xl sm:text-2xl font-bold text-white">{count}</p>
            <p className="text-xs text-white/60 mt-1 truncate">{labels[locale]}</p>
          </Link>
        )
      })}
    </div>
  )
}

