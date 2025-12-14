/**
 * Thoughts Filters Component - Localized
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t, getStatusLabel, getPriorityLabel } from '@/lib/i18n'

interface FiltersProps {
  currentStatus?: string
  currentPriority?: string
  currentSearch?: string
  currentTag?: string
  currentSort?: string
  allTags: string[]
}

export function ThoughtsFilters({ 
  currentStatus, 
  currentPriority, 
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
    { value: 'PENDING', label: getStatusLabel('PENDING', locale) },
    { value: 'IN_PROGRESS', label: getStatusLabel('IN_PROGRESS', locale) },
    { value: 'APPROVED', label: getStatusLabel('APPROVED', locale) },
    { value: 'REJECTED', label: getStatusLabel('REJECTED', locale) },
  ]

  const priorities = [
    { value: '', label: t('filters.allPriorities', locale) },
    { value: 'LOW', label: getPriorityLabel('LOW', locale) },
    { value: 'MEDIUM', label: getPriorityLabel('MEDIUM', locale) },
    { value: 'HIGH', label: getPriorityLabel('HIGH', locale) },
    { value: 'CRITICAL', label: getPriorityLabel('CRITICAL', locale) },
  ]

  const sortOptions = [
    { value: 'newest', label: t('filters.sortNewest', locale) },
    { value: 'oldest', label: t('filters.sortOldest', locale) },
    { value: 'updated', label: t('filters.sortUpdated', locale) },
    { value: 'priority', label: t('filters.sortPriority', locale) },
  ]
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`/thoughts?${params.toString()}`)
    })
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }
  
  const clearFilters = () => {
    setSearch('')
    startTransition(() => {
      router.push('/thoughts')
    })
  }
  
  const hasFilters = currentStatus || currentPriority || currentSearch || currentTag
  
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
      
      {/* Priority */}
      <div>
        <label className="block text-sm text-white/50 mb-2">{t('form.priority', locale)}</label>
        <select
          value={currentPriority || ''}
          onChange={e => updateFilter('priority', e.target.value)}
          className="input text-sm"
          disabled={isPending}
        >
          {priorities.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
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
