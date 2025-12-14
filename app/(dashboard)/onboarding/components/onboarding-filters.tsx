/**
 * Onboarding Filters Sidebar
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, LayoutGrid, Palette, FileText, Wrench, Lightbulb, MoreHorizontal } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { ONBOARDING_CATEGORY_LABELS, OnboardingCategory } from '@/lib/onboarding/service'

interface FiltersProps {
  currentStatus?: string
  currentCategory?: string
  currentSearch?: string
  currentTag?: string
  currentSort?: string
  allTags: string[]
}

const categoryIcons: Record<OnboardingCategory, typeof LayoutGrid> = {
  DESIGN_SYSTEM: Palette,
  GAME_FILES: FileText,
  GUIDELINES: LayoutGrid,
  TOOLS: Wrench,
  REFERENCES: Lightbulb,
  OTHER: MoreHorizontal,
}

const statuses = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'ARCHIVED']

const sortOptions = [
  { value: 'newest', key: 'filters.sortNewest' },
  { value: 'oldest', key: 'filters.sortOldest' },
  { value: 'updated', key: 'filters.sortUpdated' },
  { value: 'title', key: 'filters.sortName' },
  { value: 'order', key: 'onboarding.sortOrder' },
]

export function OnboardingFilters({
  currentStatus,
  currentCategory,
  currentSearch,
  currentTag,
  currentSort,
  allTags,
}: FiltersProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/onboarding?${params.toString()}`)
  }
  
  const clearFilters = () => {
    router.push('/onboarding')
  }
  
  const hasFilters = currentStatus || currentCategory || currentSearch || currentTag
  
  return (
    <div className="glass-card p-5 sticky top-6">
      <h3 className="text-sm font-medium text-white mb-4">{t('filters.title', locale)}</h3>
      
      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder={t('common.search', locale)}
          defaultValue={currentSearch || ''}
          onChange={(e) => updateFilter('search', e.target.value || null)}
          className="w-full py-2 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30"
        />
      </div>
      
      {/* Sort */}
      <div className="mb-5">
        <label className="text-xs text-white/40 uppercase tracking-wide mb-2 block">
          {t('filters.sort', locale)}
        </label>
        <select
          value={currentSort || 'newest'}
          onChange={(e) => updateFilter('sort', e.target.value === 'newest' ? null : e.target.value)}
          className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {t(opt.key, locale)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Category */}
      <div className="mb-5">
        <label className="text-xs text-white/40 uppercase tracking-wide mb-2 block">
          {t('onboarding.category', locale)}
        </label>
        <div className="space-y-1">
          {Object.entries(ONBOARDING_CATEGORY_LABELS).map(([value, labels]) => {
            const Icon = categoryIcons[value as OnboardingCategory]
            const isActive = currentCategory === value
            
            return (
              <button
                key={value}
                onClick={() => updateFilter('category', isActive ? null : value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-[#A89C6A]/20 text-[#A89C6A] border border-[#A89C6A]/30'
                    : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={14} strokeWidth={1.5} />
                {labels[locale]}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Status */}
      <div className="mb-5">
        <label className="text-xs text-white/40 uppercase tracking-wide mb-2 block">
          {t('form.status', locale)}
        </label>
        <div className="space-y-1">
          {statuses.map(status => {
            const isActive = currentStatus === status
            return (
              <button
                key={status}
                onClick={() => updateFilter('status', isActive ? null : status)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t(`status.${status.toLowerCase().replace('_', '')}`, locale) || status}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Tags */}
      {allTags.length > 0 && (
        <div className="mb-5">
          <label className="text-xs text-white/40 uppercase tracking-wide mb-2 block">
            {t('filters.tags', locale)}
          </label>
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 10).map(tag => {
              const isActive = currentTag === tag
              return (
                <button
                  key={tag}
                  onClick={() => updateFilter('tag', isActive ? null : tag)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <X size={14} strokeWidth={1.5} />
          {t('filters.reset', locale)}
        </button>
      )}
    </div>
  )
}
