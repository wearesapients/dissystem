/**
 * Entities Filters Component - Right Sidebar - Localized
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Filter, X, Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t, getEntityTypePluralLabel } from '@/lib/i18n'

interface FiltersProps {
  currentType?: string
  currentSort?: string
  stats: Record<string, number>
}

const types = [
  { value: 'HERO', icon: Crown },
  { value: 'UNIT', icon: Swords },
  { value: 'FACTION', icon: Castle },
  { value: 'SPELL', icon: Sparkles },
  { value: 'ARTIFACT', icon: Gem },
  { value: 'LOCATION', icon: MapPin },
  { value: 'OBJECT', icon: Box },
  { value: 'OTHER', icon: HelpCircle },
]

export function EntitiesFilters({ currentType, currentSort, stats }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { locale } = useLocale()
  
  const sortOptions = [
    { value: 'newest', label: t('filters.sortNewest', locale) },
    { value: 'oldest', label: t('filters.sortOldest', locale) },
    { value: 'updated', label: t('filters.sortUpdated', locale) },
    { value: 'name', label: t('filters.sortName', locale) },
  ]
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`/entities?${params.toString()}`)
    })
  }
  
  const clearFilters = () => {
    startTransition(() => {
      router.push('/entities')
    })
  }
  
  const hasFilters = currentType || (currentSort && currentSort !== 'newest')
  
  return (
    <div className="glass-card p-5 space-y-6 sticky top-8">
      <h3 className="font-semibold text-white flex items-center gap-2">
        <Filter size={16} strokeWidth={1.5} className="text-white/50" />
        {t('filters.title', locale)}
      </h3>
      
      {/* Sort */}
      <div>
        <label className="block text-sm text-white/50 mb-2">
          {t('filters.sort', locale)}
        </label>
        <select
          value={currentSort || 'newest'}
          onChange={e => updateFilter('sort', e.target.value === 'newest' ? '' : e.target.value)}
          className="input text-sm"
          disabled={isPending}
        >
          {sortOptions.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      
      {/* Type */}
      <div>
        <label className="block text-sm text-white/50 mb-3">
          {t('filters.entityType', locale)}
        </label>
        <div className="space-y-1">
          {types.map(type => {
            const Icon = type.icon
            const count = stats[type.value] || 0
            const isActive = currentType === type.value
            
            return (
              <button
                key={type.value}
                onClick={() => updateFilter('type', isActive ? '' : type.value)}
                disabled={isPending || count === 0}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-[#A89C6A]/20 text-[#A89C6A]'
                    : count > 0
                      ? 'text-white/70 hover:bg-white/5 hover:text-white'
                      : 'text-white/30 cursor-not-allowed'
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span className="flex-1 text-left">{getEntityTypePluralLabel(type.value, locale)}</span>
                <span className={`text-xs ${isActive ? 'text-[#A89C6A]' : 'text-white/40'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Clear */}
      {hasFilters && (
        <button 
          onClick={clearFilters} 
          className="w-full btn btn-ghost text-sm flex items-center justify-center gap-2"
          disabled={isPending}
        >
          <X size={14} strokeWidth={1.5} />
          {t('filters.reset', locale)}
        </button>
      )}
    </div>
  )
}

