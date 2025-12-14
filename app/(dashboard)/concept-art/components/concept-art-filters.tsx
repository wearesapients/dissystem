/**
 * Concept Art Filters Sidebar Component
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, SlidersHorizontal, Tag, Layers } from 'lucide-react'
import { useState, useEffect } from 'react'

type Props = {
  currentStatus?: string
  currentEntityType?: string
  currentSearch?: string
  currentTag?: string
  currentSort?: string
  allTags: string[]
}

const statusOptions = [
  { value: 'DRAFT', label: 'Черновик', color: 'text-[#8A8F96]' },
  { value: 'IN_REVIEW', label: 'На проверке', color: 'text-[#A89C6A]' },
  { value: 'APPROVED', label: 'Утверждено', color: 'text-[#7A8A5C]' },
  { value: 'REJECTED', label: 'Отклонено', color: 'text-[#9A4A4A]' },
]

const entityTypeOptions = [
  { value: 'HERO', label: 'Герои' },
  { value: 'UNIT', label: 'Юниты' },
  { value: 'FACTION', label: 'Фракции' },
  { value: 'SPELL', label: 'Заклинания' },
  { value: 'ARTIFACT', label: 'Артефакты' },
  { value: 'LOCATION', label: 'Локации' },
  { value: 'OBJECT', label: 'Объекты' },
  { value: 'OTHER', label: 'Другое' },
]

const sortOptions = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'updated', label: 'Недавно обновлённые' },
  { value: 'title', label: 'По названию' },
]

export function ConceptArtFilters({ 
  currentStatus,
  currentEntityType,
  currentSearch,
  currentTag,
  currentSort,
  allTags 
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(currentSearch || '')
  
  useEffect(() => {
    setSearchInput(currentSearch || '')
  }, [currentSearch])
  
  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/concept-art?${params.toString()}`)
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('search', searchInput || null)
  }
  
  const clearFilters = () => {
    router.push('/concept-art')
  }
  
  const hasFilters = currentStatus || currentEntityType || currentSearch || currentTag || currentSort
  
  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="glass-card p-4">
        <div className="relative">
          <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                updateParams('search', null)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} className="text-white/30 hover:text-white/60" />
            </button>
          )}
        </div>
      </form>
      
      {/* Filters Card */}
      <div className="glass-card p-4 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-medium text-white">
            <SlidersHorizontal size={16} strokeWidth={1.5} className="text-white/50" />
            Фильтры
          </h3>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#A89C6A] hover:text-[#A89C6A]/80"
            >
              Сбросить
            </button>
          )}
        </div>
        
        {/* Status */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Статус</p>
          <div className="space-y-1">
            {statusOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateParams('status', currentStatus === opt.value ? null : opt.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  currentStatus === opt.value
                    ? 'bg-[#A89C6A]/15 text-[#A89C6A]'
                    : 'text-[#C7BFAE]/60 hover:bg-[#6A665E]/10 hover:text-[#C7BFAE]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  opt.value === 'DRAFT' ? 'bg-[#8A8F96]' :
                  opt.value === 'IN_REVIEW' ? 'bg-[#A89C6A]' :
                  opt.value === 'APPROVED' ? 'bg-[#7A8A5C]' :
                  'bg-[#9A4A4A]'
                }`} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Entity Type */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Layers size={12} />
            Тип сущности
          </p>
          <div className="space-y-1">
            {entityTypeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateParams('entityType', currentEntityType === opt.value ? null : opt.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  currentEntityType === opt.value
                    ? 'bg-[#A89C6A]/15 text-[#A89C6A]'
                    : 'text-[#C7BFAE]/60 hover:bg-[#6A665E]/10 hover:text-[#C7BFAE]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sort */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Сортировка</p>
          <select
            value={currentSort || 'newest'}
            onChange={e => updateParams('sort', e.target.value === 'newest' ? null : e.target.value)}
            className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tags */}
      {allTags.length > 0 && (
        <div className="glass-card p-4">
          <p className="text-xs text-white/40 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Tag size={12} />
            Теги
          </p>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => updateParams('tag', currentTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  currentTag === tag
                    ? 'bg-[#A89C6A]/20 text-[#A89C6A] border border-[#A89C6A]/30'
                    : 'bg-[#6A665E]/15 text-[#C7BFAE]/60 hover:bg-[#6A665E]/25 hover:text-[#C7BFAE]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


