/**
 * Onboarding Form Component
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, 
  Link2, X, Search, Plus, Image as ImageIcon, ExternalLink, Trash2, GripVertical
} from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { ONBOARDING_CATEGORY_LABELS, OnboardingCategory, AssetStatus } from '@/lib/onboarding/service'

type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'

type Entity = { id: string; code: string; name: string; type: GameEntityType }

type OnboardingImage = {
  id?: string
  imageUrl: string
  caption: string | null
  order: number
}

type OnboardingCard = {
  id: string
  title: string
  description: string | null
  category: OnboardingCategory
  status: AssetStatus
  order: number
  isPinned: boolean
  tags: string[]
  links: string[]
  parentId: string | null
  images: OnboardingImage[]
  linkedEntities: { entity: Entity }[]
}

interface FormProps {
  card?: OnboardingCard
  entities: Entity[]
  existingTags?: string[]
  allCards?: { id: string; title: string }[]
}

const statuses: { value: AssetStatus; labelKey: string }[] = [
  { value: 'DRAFT', labelKey: 'status.draft' },
  { value: 'IN_REVIEW', labelKey: 'status.inReview' },
  { value: 'APPROVED', labelKey: 'status.approved' },
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

export function OnboardingForm({ card, entities, existingTags = [], allCards = [] }: FormProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const isEdit = !!card
  
  const [title, setTitle] = useState(card?.title || '')
  const [description, setDescription] = useState(card?.description || '')
  const [category, setCategory] = useState<OnboardingCategory>(card?.category || 'OTHER')
  const [status, setStatus] = useState<AssetStatus>(card?.status || 'DRAFT')
  const [order, setOrder] = useState(card?.order || 0)
  const [isPinned, setIsPinned] = useState(card?.isPinned || false)
  const [parentId, setParentId] = useState(card?.parentId || '')
  const [linkedEntityIds, setLinkedEntityIds] = useState<string[]>(
    card?.linkedEntities.map(le => le.entity.id) || []
  )
  const [tagsInput, setTagsInput] = useState(card?.tags.join(', ') || '')
  const [linksInput, setLinksInput] = useState(card?.links || [''])
  const [images, setImages] = useState<OnboardingImage[]>(card?.images || [])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [entitySearch, setEntitySearch] = useState('')
  const [showEntityPicker, setShowEntityPicker] = useState(false)
  
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
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    
    setUploading(true)
    
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (res.ok) {
          const data = await res.json()
          setImages(prev => [...prev, {
            imageUrl: data.imageUrl,
            caption: null,
            order: prev.length,
          }])
        }
      } catch (err) {
        console.error('Upload error:', err)
      }
    }
    
    setUploading(false)
    e.target.value = ''
  }
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }
  
  const updateImageCaption = (index: number, caption: string) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, caption } : img
    ))
  }
  
  const addLink = () => {
    setLinksInput(prev => [...prev, ''])
  }
  
  const updateLink = (index: number, value: string) => {
    setLinksInput(prev => prev.map((link, i) => i === index ? value : link))
  }
  
  const removeLink = (index: number) => {
    setLinksInput(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const tags = parseTags(tagsInput)
    const validLinks = linksInput.filter(link => link.trim())
    
    try {
      const url = isEdit ? `/api/onboarding/${card.id}` : '/api/onboarding'
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, 
          description: description || null,
          category,
          status,
          order,
          isPinned,
          parentId: parentId || null,
          tags,
          links: validLinks,
          linkedEntityIds,
          images: images.map((img, idx) => ({
            imageUrl: img.imageUrl,
            caption: img.caption,
            order: idx,
          })),
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
        return
      }
      
      router.push('/onboarding')
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
    if (!linkedEntityIds.includes(id)) {
      setLinkedEntityIds([...linkedEntityIds, id])
    }
  }
  
  const removeLinkedEntity = (id: string) => {
    setLinkedEntityIds(linkedEntityIds.filter(eid => eid !== id))
  }
  
  // Category options
  const categoryOptions = Object.entries(ONBOARDING_CATEGORY_LABELS).map(([value, labels]) => ({
    value: value as OnboardingCategory,
    label: labels[locale],
  }))
  
  // Filter parent cards (exclude self if editing)
  const parentOptions = allCards.filter(c => c.id !== card?.id)
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-[#5A1E1E]/20 border border-[#5A1E1E]/30 rounded-xl text-[#B07070] text-sm">
          {error}
        </div>
      )}
      
      {/* CATEGORY - First and prominent */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          {t('onboarding.category', locale)}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categoryOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCategory(opt.value)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                category === opt.value
                  ? 'bg-[#A89C6A]/20 text-[#A89C6A] ring-2 ring-[#A89C6A]/40'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* IMAGES GALLERY */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <ImageIcon size={16} strokeWidth={1.5} className="text-[#8A8F96]" />
          {t('onboarding.gallery', locale)}
          <span className="text-white/40 font-normal">({images.length})</span>
        </label>
        
        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="aspect-video rounded-lg overflow-hidden bg-white/5">
                  <img 
                    src={img.imageUrl} 
                    alt={img.caption || `Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-2 bg-[#5A1E1E]/80 rounded-lg hover:bg-[#5A1E1E] transition-colors"
                  >
                    <Trash2 size={14} strokeWidth={1.5} className="text-white" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={t('onboarding.imageCaption', locale)}
                  value={img.caption || ''}
                  onChange={(e) => updateImageCaption(idx, e.target.value)}
                  className="mt-2 w-full py-1.5 px-2 bg-white/5 border border-white/10 rounded text-xs text-white placeholder-white/30"
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Upload button */}
        <label className="block">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
          <div className="w-full p-6 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:border-[#6A665E]/50 hover:text-[#9C9688] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer">
            <ImageIcon size={24} strokeWidth={1.5} />
            <span className="text-sm">
              {uploading ? t('conceptArt.uploading', locale) : t('onboarding.uploadImages', locale)}
            </span>
            <span className="text-xs text-white/30">{t('conceptArt.fileTypes', locale)}</span>
          </div>
        </label>
      </div>
      
      {/* LINKS AND REFERENCES */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <ExternalLink size={16} strokeWidth={1.5} className="text-[#6B8F94]" />
          {t('onboarding.linksReferences', locale)}
        </label>
        
        <div className="space-y-2">
          {linksInput.map((link, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="url"
                value={link}
                onChange={(e) => updateLink(idx, e.target.value)}
                placeholder="https://..."
                className="flex-1 py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30"
              />
              <button
                type="button"
                onClick={() => removeLink(idx)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={16} strokeWidth={1.5} className="text-white/50" />
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addLink}
            className="w-full p-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:border-[#3B4F52]/50 hover:text-[#6B8F94] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} strokeWidth={1.5} />
            {t('onboarding.addLink', locale)}
          </button>
        </div>
      </div>
      
      {/* LINKED ENTITIES */}
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
          onClick={() => setShowEntityPicker(!showEntityPicker)}
          className="w-full p-3 border border-dashed border-white/20 rounded-xl text-white/50 hover:border-[#4F5A3C]/50 hover:text-[#7A8A5C] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} strokeWidth={1.5} />
          {t('lore.addLinkedEntity', locale)}
        </button>
        
        {showEntityPicker && (
          <EntityPickerDropdown
            groups={filteredGroups}
            search={entitySearch}
            onSearchChange={setEntitySearch}
            onSelect={(id) => {
              addLinkedEntity(id)
              setEntitySearch('')
            }}
            excludeIds={linkedEntityIds}
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
            placeholder={t('onboarding.titlePlaceholder', locale)}
            required
          />
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm text-white/60 mb-2">{t('onboarding.description', locale)}</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="input min-h-[200px] resize-y"
            placeholder={t('onboarding.descriptionPlaceholder', locale)}
          />
        </div>
        
        {/* Status & Order row */}
        <div className="grid grid-cols-2 gap-4">
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
          
          <div>
            <label className="block text-sm text-white/60 mb-2">{t('onboarding.order', locale)}</label>
            <input
              type="number"
              value={order}
              onChange={e => setOrder(parseInt(e.target.value) || 0)}
              className="input"
              min={0}
            />
          </div>
        </div>
        
        {/* Parent card */}
        {parentOptions.length > 0 && (
          <div>
            <label className="block text-sm text-white/60 mb-2">{t('onboarding.parentCard', locale)}</label>
            <select 
              value={parentId} 
              onChange={e => setParentId(e.target.value)} 
              className="input"
            >
              <option value="">{t('form.noLink', locale)}</option>
              {parentOptions.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Pin toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isPinned
                ? 'bg-[#A89C6A]/25 text-[#A89C6A] ring-2 ring-[#A89C6A]/40'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {isPinned ? t('thoughts.unpin', locale) : t('thoughts.pin', locale)}
          </button>
          <span className="text-xs text-white/40">{t('onboarding.pinHint', locale)}</span>
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
      </div>
      
      {/* Submit */}
      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
          {loading ? t('common.loading', locale) : isEdit ? t('common.save', locale) : t('onboarding.createCard', locale)}
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
