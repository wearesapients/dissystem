/**
 * Lore Form Component - Full featured with multi-entity support
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, 
  Link2, X, Search, Plus, BookOpen
} from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { LORE_TYPE_LABELS, LoreType, AssetStatus } from '@/lib/lore/service'

type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'

type Entity = { id: string; code: string; name: string; type: GameEntityType }

type LoreEntry = {
  id: string
  title: string
  content: string
  summary: string | null
  loreType: LoreType
  status: AssetStatus
  entityId: string | null
  tags: string[]
  linkedEntities: { entity: Entity }[]
}

interface FormProps {
  entry?: LoreEntry
  entities: Entity[]
  existingTags?: string[]
  preSelectedEntityId?: string
}

const statuses: { value: AssetStatus; labelKey: string }[] = [
  { value: 'DRAFT', labelKey: 'status.draft' },
  { value: 'IN_REVIEW', labelKey: 'status.inReview' },
  { value: 'APPROVED', labelKey: 'status.approved' },
  { value: 'REJECTED', labelKey: 'status.rejected' },
  { value: 'ARCHIVED', labelKey: 'lore.archived' },
]

const entityTypeLabels: Record<GameEntityType, string> = {
  HERO: 'Heroes',
  UNIT: 'Units',
  FACTION: 'Factions',
  SPELL: 'Spells',
  ARTIFACT: 'Artifacts',
  LOCATION: 'Locations',
  OBJECT: 'Objects',
  OTHER: 'Other',
}

function EntityIcon({ type, size = 16 }: { type: GameEntityType; size?: number }) {
  const props = { size, strokeWidth: 1.5 }
  switch (type) {
    case 'UNIT': return <Swords {...props} />
    case 'HERO': return <Crown {...props} />
    case 'FACTION': return <Castle {...props} />
    case 'SPELL': return <Sparkles {...props} />
    case 'ARTIFACT': return <Gem {...props} />
    case 'LOCATION': return <MapPin {...props} />
    case 'OBJECT': return <Box {...props} />
    default: return <HelpCircle {...props} />
  }
}

export function LoreForm({ entry, entities, existingTags = [], preSelectedEntityId }: FormProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const isEdit = !!entry
  
  const [title, setTitle] = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')
  const [summary, setSummary] = useState(entry?.summary || '')
  const [loreType, setLoreType] = useState<LoreType>(entry?.loreType || 'OTHER')
  const [status, setStatus] = useState<AssetStatus>(entry?.status || 'DRAFT')
  const [entityId, setEntityId] = useState(entry?.entityId || preSelectedEntityId || '')
  const [linkedEntityIds, setLinkedEntityIds] = useState<string[]>(
    entry?.linkedEntities.map(le => le.entity.id) || []
  )
  const [tagsInput, setTagsInput] = useState(entry?.tags.join(', ') || '')
  const [changeNote, setChangeNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [entitySearch, setEntitySearch] = useState('')
  const [showEntityPicker, setShowEntityPicker] = useState(false)
  const [showLinkedPicker, setShowLinkedPicker] = useState(false)
  
  const selectedEntity = entities.find(e => e.id === entityId)
  const linkedEntities = entities.filter(e => linkedEntityIds.includes(e.id))
  
  // Group entities by type
  const groupedEntities = entities.reduce((acc, entity) => {
    if (!acc[entity.type]) acc[entity.type] = []
    acc[entity.type].push(entity)
    return acc
  }, {} as Record<GameEntityType, Entity[]>)
  
  // Filter entities by search
  const filteredGroups = Object.entries(groupedEntities).reduce((acc, [type, items]) => {
    const filtered = items.filter(e => 
      e.name.toLowerCase().includes(entitySearch.toLowerCase()) ||
      e.code.toLowerCase().includes(entitySearch.toLowerCase())
    )
    if (filtered.length > 0) acc[type as GameEntityType] = filtered
    return acc
  }, {} as Record<GameEntityType, Entity[]>)
  
  const parseTags = (input: string): string[] => {
    return input
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean)
      .filter((tag, index, arr) => arr.indexOf(tag) === index)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const tags = parseTags(tagsInput)
    
    try {
      const url = isEdit ? `/api/lore/${entry.id}` : '/api/lore'
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, 
          content, 
          summary: summary || null,
          loreType,
          status, 
          tags,
          entityId: entityId || null,
          linkedEntityIds,
          changeNote: isEdit ? changeNote : undefined,
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
        return
      }
      
      router.push('/lore')
      router.refresh()
    } catch {
      setError(t('common.saveError', locale))
    } finally {
      setLoading(false)
    }
  }
  
  const suggestedTags = existingTags.filter(tag => 
    !parseTags(tagsInput).includes(tag.toLowerCase())
  ).slice(0, 8)
  
  const addTag = (tag: string) => {
    const current = parseTags(tagsInput)
    if (!current.includes(tag.toLowerCase())) {
      setTagsInput(current.length > 0 ? `${tagsInput}, ${tag}` : tag)
    }
  }
  
  const addLinkedEntity = (id: string) => {
    if (!linkedEntityIds.includes(id) && id !== entityId) {
      setLinkedEntityIds([...linkedEntityIds, id])
    }
  }
  
  const removeLinkedEntity = (id: string) => {
    setLinkedEntityIds(linkedEntityIds.filter(eid => eid !== id))
  }
  
  // Lore type options
  const loreTypeOptions = Object.entries(LORE_TYPE_LABELS).map(([value, labels]) => ({
    value: value as LoreType,
    label: labels[locale],
  }))
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-[#5A1E1E]/20 border border-[#5A1E1E]/30 rounded-xl text-[#B07070] text-sm">
          {error}
        </div>
      )}
      
      {/* LORE TYPE - First and prominent */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <BookOpen size={16} strokeWidth={1.5} className="text-[#8A6A9A]" />
          {t('lore.type', locale)}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {loreTypeOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLoreType(opt.value)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                loreType === opt.value
                  ? 'bg-[#3E2F45]/30 text-[#8A6A9A] ring-2 ring-[#3E2F45]/50'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* PRIMARY ENTITY LINK */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <Link2 size={16} strokeWidth={1.5} className="text-[#A89C6A]" />
          {t('lore.primaryEntity', locale)}
          <span className="text-white/40 font-normal">({t('lore.optional', locale)})</span>
        </label>
        
        {selectedEntity ? (
          <div className="flex items-center gap-3 p-3 bg-[#A89C6A]/10 border border-[#A89C6A]/30 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <EntityIcon type={selectedEntity.type} size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">{selectedEntity.name}</p>
              <p className="text-xs text-white/50">{selectedEntity.type} • {selectedEntity.code}</p>
            </div>
            <button
              type="button"
              onClick={() => setEntityId('')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={16} strokeWidth={1.5} className="text-white/50" />
            </button>
          </div>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setShowEntityPicker(!showEntityPicker)}
              className="w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:border-[#A89C6A]/50 hover:text-[#A89C6A] transition-all flex items-center justify-center gap-2"
            >
              <Link2 size={18} strokeWidth={1.5} />
              {t('lore.selectPrimaryEntity', locale)}
            </button>
            
            {showEntityPicker && (
              <EntityPickerDropdown
                groups={filteredGroups}
                search={entitySearch}
                onSearchChange={setEntitySearch}
                onSelect={(id) => {
                  setEntityId(id)
                  setShowEntityPicker(false)
                  setEntitySearch('')
                }}
              />
            )}
          </div>
        )}
      </div>
      
      {/* LINKED ENTITIES (many-to-many) */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <Link2 size={16} strokeWidth={1.5} className="text-[#7A8A5C]" />
          {t('lore.linkedEntities', locale)}
          <span className="text-white/40 font-normal">({linkedEntities.length})</span>
        </label>
        
        {/* Selected linked entities */}
        {linkedEntities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {linkedEntities.map(entity => (
              <div 
                key={entity.id}
                className="flex items-center gap-2 px-3 py-2 bg-[#4F5A3C]/20 border border-[#4F5A3C]/30 rounded-lg"
              >
                <EntityIcon type={entity.type} size={14} />
                <span className="text-sm text-white">{entity.name}</span>
                <button
                  type="button"
                  onClick={() => removeLinkedEntity(entity.id)}
                  className="p-0.5 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={14} strokeWidth={1.5} className="text-white/50" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button
          type="button"
          onClick={() => setShowLinkedPicker(!showLinkedPicker)}
          className="w-full p-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:border-[#4F5A3C]/50 hover:text-[#7A8A5C] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} strokeWidth={1.5} />
          {t('lore.addLinkedEntity', locale)}
        </button>
        
        {showLinkedPicker && (
          <EntityPickerDropdown
            groups={filteredGroups}
            search={entitySearch}
            onSearchChange={setEntitySearch}
            onSelect={(id) => {
              addLinkedEntity(id)
              setEntitySearch('')
            }}
            excludeIds={[entityId, ...linkedEntityIds]}
          />
        )}
      </div>
      
      {/* Main form */}
      <div className="glass-card p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm text-white/60 mb-2">{t('form.title', locale)} *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="input"
            placeholder={t('lore.titlePlaceholder', locale)}
            required
          />
        </div>
        
        {/* Summary */}
        <div>
          <label className="block text-sm text-white/60 mb-2">{t('lore.summary', locale)}</label>
          <textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="input min-h-[80px] resize-y"
            placeholder={t('lore.summaryPlaceholder', locale)}
          />
          <p className="text-xs text-white/30 mt-1">{t('lore.summaryHint', locale)}</p>
        </div>
        
        {/* Content */}
        <div>
          <label className="block text-sm text-white/60 mb-2">{t('form.content', locale)} *</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="input min-h-[300px] resize-y font-mono text-sm"
            placeholder={t('lore.contentPlaceholder', locale)}
            required
          />
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm text-white/60 mb-2">{t('form.status', locale)}</label>
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value as AssetStatus)} 
            className="input"
          >
            {statuses.map(s => (
              <option key={s.value} value={s.value}>{t(s.labelKey, locale)}</option>
            ))}
          </select>
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm text-white/60 mb-2">{t('form.tags', locale)}</label>
          <input
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            className="input"
            placeholder={t('lore.tagsPlaceholder', locale)}
          />
          {suggestedTags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-white/40 mb-2">{t('lore.existingTags', locale)}:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-xs text-white/60 hover:text-white transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Change note (only for edit) */}
        {isEdit && (
          <div>
            <label className="block text-sm text-white/60 mb-2">{t('lore.changeNote', locale)}</label>
            <input
              type="text"
              value={changeNote}
              onChange={e => setChangeNote(e.target.value)}
              className="input"
              placeholder={t('lore.changeNotePlaceholder', locale)}
            />
            <p className="text-xs text-white/30 mt-1">{t('lore.changeNoteHint', locale)}</p>
          </div>
        )}
      </div>
      
      {/* Submit */}
      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t('common.loading', locale) : isEdit ? t('common.save', locale) : t('lore.createEntry', locale)}
        </button>
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="btn btn-ghost"
        >
          {t('common.cancel', locale)}
        </button>
      </div>
    </form>
  )
}

// Entity picker dropdown component
function EntityPickerDropdown({
  groups,
  search,
  onSearchChange,
  onSelect,
  excludeIds = [],
}: {
  groups: Record<GameEntityType, Entity[]>
  search: string
  onSearchChange: (v: string) => void
  onSelect: (id: string) => void
  excludeIds?: string[]
}) {
  return (
    <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10 max-h-80 overflow-y-auto">
      {/* Search */}
      <div className="relative mb-3">
        <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search entities..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full py-2 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
        />
      </div>
      
      {/* Grouped entities */}
      {Object.entries(groups).map(([type, items]) => {
        const filteredItems = items.filter(e => !excludeIds.includes(e.id))
        if (filteredItems.length === 0) return null
        
        return (
          <div key={type} className="mb-4 last:mb-0">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-2 flex items-center gap-2">
              <EntityIcon type={type as GameEntityType} size={12} />
              {entityTypeLabels[type as GameEntityType]}
            </p>
            <div className="space-y-1">
              {filteredItems.map(entity => (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => onSelect(entity.id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                >
                  <EntityIcon type={entity.type} size={16} />
                  <span className="text-white">{entity.name}</span>
                  <span className="text-xs text-white/30 ml-auto">{entity.code}</span>
                </button>
              ))}
            </div>
          </div>
        )
      })}
      
      {Object.keys(groups).length === 0 && (
        <p className="text-center text-white/40 py-4">No entities found</p>
      )}
    </div>
  )
}

