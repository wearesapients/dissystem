/**
 * Lore Filters Component
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t, getStatusLabel, getEntityTypeLabel } from '@/lib/i18n'
import { LORE_TYPE_LABELS, LoreType } from '@/lib/lore/service'

interface FiltersProps {
  currentStatus?: string
  currentLoreType?: string
  currentEntityType?: string
  currentSearch?: string
  currentTag?: string
  currentSort?: string
  allTags: string[]
}

export function LoreFilters({ 
  currentStatus, 
  currentLoreType,
  currentEntityType,
  currentSearch, 
  currentTag,
  currentSort,
  allTags 
}: FiltersProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch || '')
  
  const statuses = [
    { value: '', label: t('filters.allStatuses', locale) },
    { value: 'DRAFT', label: getStatusLabel('DRAFT', locale) },
    { value: 'IN_REVIEW', label: getStatusLabel('IN_REVIEW', locale) },
    { value: 'APPROVED', label: getStatusLabel('APPROVED', locale) },
    { value: 'REJECTED', label: getStatusLabel('REJECTED', locale) },
    { value: 'ARCHIVED', label: t('lore.archived', locale) },
  ]
  
  const loreTypes: { value: string; label: string }[] = [
    { value: '', label: t('lore.allTypes', locale) },
    ...Object.entries(LORE_TYPE_LABELS).map(([value, labels]) => ({
      value,
      label: labels[locale],
    })),
  ]
  
  const entityTypes = [
    { value: '', label: t('filters.entityType', locale) + ': ' + t('common.all', locale) },
    { value: 'HERO', label: getEntityTypeLabel('HERO', locale) },
    { value: 'UNIT', label: getEntityTypeLabel('UNIT', locale) },
    { value: 'FACTION', label: getEntityTypeLabel('FACTION', locale) },
    { value: 'SPELL', label: getEntityTypeLabel('SPELL', locale) },
    { value: 'ARTIFACT', label: getEntityTypeLabel('ARTIFACT', locale) },
    { value: 'LOCATION', label: getEntityTypeLabel('LOCATION', locale) },
    { value: 'OBJECT', label: getEntityTypeLabel('OBJECT', locale) },
  ]

  const sortOptions = [
    { value: 'newest', label: t('filters.sortNewest', locale) },
    { value: 'oldest', label: t('filters.sortOldest', locale) },
    { value: 'updated', label: t('filters.sortUpdated', locale) },
    { value: 'title', label: t('filters.sortName', locale) },
    { value: 'version', label: t('lore.sortVersion', locale) },
  ]
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`/lore?${params.toString()}`)
    })
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }
  
  const clearFilters = () => {
    setSearch('')
    startTransition(() => {
      router.push('/lore')
    })
  }
  
  const hasFilters = currentStatus || currentLoreType || currentEntityType || currentSearch || currentTag
  
  return (
    <div className="glass-card p-5 space-y-6 sticky top-8">
      <h3 className="font-semibold text-white flex items-center gap-2">
        <Filter size={16} strokeWidth={1.5} className="text-white/50" />
        {t('filters.title', locale)}
      </h3>
      
      {/* Search */}
      <div>
        <label className="block text-sm text-white/50 mb-2">{t('common.search', locale).replace('...', '')}</label>
        <form onSubmit={handleSearch} className="relative">
          <Search size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder={t('common.search', locale)}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input text-sm"
            style={{ paddingLeft: 44 }}
          />
        </form>
      </div>
      
      {/* Sort */}
      <div>
        <label className="block text-sm text-white/50 mb-2">{t('filters.sort', locale)}</label>
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
      
      {/* Status */}
      <div>
        <label className="block text-sm text-white/50 mb-2">{t('form.status', locale)}</label>
        <select
          value={currentStatus || ''}
          onChange={e => updateFilter('status', e.target.value)}
          className="input text-sm"
          disabled={isPending}
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      
      {/* Lore Type */}
      <div>
        <label className="block text-sm text-white/50 mb-2">{t('lore.type', locale)}</label>
        <select
          value={currentLoreType || ''}
          onChange={e => updateFilter('loreType', e.target.value)}
          className="input text-sm"
          disabled={isPending}
        >
          {loreTypes.map(lt => (
            <option key={lt.value} value={lt.value}>{lt.label}</option>
          ))}
        </select>
      </div>
      
      {/* Entity Type */}
      <div>
        <label className="block text-sm text-white/50 mb-2">{t('filters.entityType', locale)}</label>
        <select
          value={currentEntityType || ''}
          onChange={e => updateFilter('entityType', e.target.value)}
          className="input text-sm"
          disabled={isPending}
        >
          {entityTypes.map(et => (
            <option key={et.value} value={et.value}>{et.label}</option>
          ))}
        </select>
      </div>
      
      {/* Tags */}
      {allTags.length > 0 && (
        <div>
          <label className="block text-sm text-white/50 mb-2">{t('filters.tags', locale)}</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => updateFilter('tag', currentTag === tag ? '' : tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentTag === tag
                    ? 'bg-[#A89C6A] text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
                }`}
                disabled={isPending}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
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


