/**
 * Units Filters Component
 */

'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { useState, useEffect, useCallback } from 'react'

type Faction = {
  id: string
  name: string
  code: string
}

interface UnitsFiltersProps {
  currentFaction?: string
  currentSort?: string
  currentSearch?: string
  factions: Faction[]
}

const sortOptions = [
  { value: 'newest', labelKey: 'filters.sortNewest' },
  { value: 'oldest', labelKey: 'filters.sortOldest' },
  { value: 'name', labelKey: 'filters.sortName' },
]

export function UnitsFilters({ 
  currentFaction,
  currentSort = 'newest',
  currentSearch = '',
  factions,
}: UnitsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { locale } = useLocale()
  
  const [search, setSearch] = useState(currentSearch)
  
  const updateParams = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== currentSearch) {
        updateParams('search', search || null)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [search, currentSearch, updateParams])
  
  const hasFilters = currentFaction || currentSearch
  
  const clearFilters = () => {
    router.push(pathname)
    setSearch('')
  }
  
  return (
    <div className="glass-card p-5 sticky top-8">
      <div className="flex items-center gap-2 mb-5">
        <Filter size={16} strokeWidth={1.5} className="text-white/40" />
        <span className="text-sm font-medium text-white/60">{t('filters.title', locale)}</span>
      </div>
      
      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('common.search', locale)}
          className="input pl-9 text-sm"
        />
      </div>
      
      {/* Faction Filter */}
      {factions.length > 0 && (
        <div className="mb-5">
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">
            {t('units.faction', locale)}
          </label>
          <select
            value={currentFaction || ''}
            onChange={e => updateParams('factionId', e.target.value || null)}
            className="input text-sm"
          >
            <option value="">{t('common.all', locale)}</option>
            {factions.map(faction => (
              <option key={faction.id} value={faction.id}>
                {faction.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Sort */}
      <div className="mb-5">
        <label className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-wider mb-2">
          <SlidersHorizontal size={12} strokeWidth={1.5} />
          {t('filters.sort', locale)}
        </label>
        <select
          value={currentSort}
          onChange={e => updateParams('sort', e.target.value)}
          className="input text-sm"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {t(option.labelKey, locale)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
        >
          <X size={14} strokeWidth={1.5} />
          {t('filters.reset', locale)}
        </button>
      )}
    </div>
  )
}
