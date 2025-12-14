/**
 * Thought Form Component - With Links & References
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/lib/locale-context'
import { 
  Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, 
  Link2, X, Search, Plus, ExternalLink, Globe 
} from 'lucide-react'

type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'
type ThoughtStatus = 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'
type ThoughtPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

type Entity = { id: string; code: string; name: string; type: GameEntityType }
type User = { id: string; name: string }
type Thought = {
  id: string
  title: string
  content: string
  status: ThoughtStatus
  priority: ThoughtPriority
  entityId: string | null
  tags: string[]
  links: string[]
  color: string | null
  assigneeId: string | null
}

interface FormProps {
  thought?: Thought
  entities: Entity[]
  users: User[]
  existingTags?: string[]
  preSelectedEntityId?: string
}

const COLORS = ['#9A4A4A', '#A89C6A', '#C7B97A', '#7A8A5C', '#6B8F94', '#3E2F45', '#8A6A9A', '#8A8F96']

const statuses = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'APPROVED', label: 'Approved' },
]

const priorities = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
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

export function ThoughtForm({ thought, entities, users, existingTags = [], preSelectedEntityId }: FormProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const isEdit = !!thought
  
  const [title, setTitle] = useState(thought?.title || '')
  const [content, setContent] = useState(thought?.content || '')
  const [status, setStatus] = useState<ThoughtStatus>(thought?.status || 'DRAFT')
  const [priority, setPriority] = useState<ThoughtPriority>(thought?.priority || 'MEDIUM')
  const [entityId, setEntityId] = useState(thought?.entityId || preSelectedEntityId || '')
  const [color, setColor] = useState(thought?.color || COLORS[4])
  const [assigneeId, setAssigneeId] = useState(thought?.assigneeId || '')
  const [tagsInput, setTagsInput] = useState(thought?.tags.join(', ') || '')
  const [links, setLinks] = useState<string[]>(thought?.links || [])
  const [newLink, setNewLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [entitySearch, setEntitySearch] = useState('')
  const [showEntityPicker, setShowEntityPicker] = useState(false)
  
  const selectedEntity = entities.find(e => e.id === entityId)
  
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
      const url = isEdit ? `/api/thoughts/${thought.id}` : '/api/thoughts'
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, content, status, priority, color, tags, links,
          entityId: entityId || null,
          assigneeId: assigneeId || null,
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
        return
      }
      
      router.push('/thoughts')
      router.refresh()
    } catch {
      setError('Save error')
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
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-[#5A1E1E]/20 border border-[#5A1E1E]/30 rounded-xl text-[#B07070] text-sm">
          {error}
        </div>
      )}
      
      {/* ENTITY LINK - First and prominent */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <Link2 size={16} strokeWidth={1.5} className="text-[#A89C6A]" />
          Link to Game Entity
          <span className="text-white/40 font-normal">(recommended)</span>
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
              Click to select entity
            </button>
            
            {showEntityPicker && (
              <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10 max-h-80 overflow-y-auto">
                {/* Search */}
                <div className="relative mb-3">
                  <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search entities..."
                    value={entitySearch}
                    onChange={e => setEntitySearch(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
                  />
                </div>
                
                {/* Grouped entities */}
                {Object.entries(filteredGroups).map(([type, items]) => (
                  <div key={type} className="mb-4 last:mb-0">
                    <p className="text-xs text-white/40 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <EntityIcon type={type as GameEntityType} size={12} />
                      {entityTypeLabels[type as GameEntityType]}
                    </p>
                    <div className="space-y-1">
                      {items.map(entity => (
                        <button
                          key={entity.id}
                          type="button"
                          onClick={() => {
                            setEntityId(entity.id)
                            setShowEntityPicker(false)
                            setEntitySearch('')
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                        >
                          <EntityIcon type={entity.type} size={16} />
                          <span className="text-white">{entity.name}</span>
                          <span className="text-xs text-white/30 ml-auto">{entity.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
                {Object.keys(filteredGroups).length === 0 && (
                  <p className="text-center text-white/40 py-4">No entities found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Main form */}
      <div className="glass-card p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="input"
            placeholder="What is this thought about?"
            required
          />
        </div>
        
        {/* Content */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Content *</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="input min-h-[200px] resize-y"
            placeholder="Detailed description..."
            required
          />
        </div>
        
        {/* Status & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Status</label>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value as ThoughtStatus)} 
              className="input"
            >
              {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Priority</label>
            <select 
              value={priority} 
              onChange={e => setPriority(e.target.value as ThoughtPriority)} 
              className="input"
            >
              {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>
        
        {/* Assignee */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Assignee</label>
          <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="input">
            <option value="">Not assigned</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        
        {/* Color */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Color</label>
          <div className="flex gap-3">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-9 h-9 rounded-xl transition-all ${
                  color === c ? 'scale-110 ring-2 ring-white/50 ring-offset-2 ring-offset-[#0B0B0C]' : 'hover:scale-105'
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm text-white/60 mb-2">
            {locale === 'ru' ? 'Теги (через запятую)' : 'Tags (comma separated)'}
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            className="input"
            placeholder={locale === 'ru' ? 'баланс, механика, визуал' : 'balance, mechanics, visual'}
          />
          {suggestedTags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-white/40 mb-2">
                {locale === 'ru' ? 'Существующие теги:' : 'Existing tags:'}
              </p>
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
      
      {/* Links & References */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <Globe size={16} strokeWidth={1.5} className="text-[#8A6A9A]" />
          {locale === 'ru' ? 'Ссылки и референсы' : 'Links & References'}
        </label>
        
        {/* Add new link */}
        <div className="flex gap-2 mb-3">
          <input
            type="url"
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
            className="input flex-1"
            placeholder={locale === 'ru' ? 'https://example.com/reference' : 'https://example.com/reference'}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (newLink.trim() && !links.includes(newLink.trim())) {
                  setLinks([...links, newLink.trim()])
                  setNewLink('')
                }
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (newLink.trim() && !links.includes(newLink.trim())) {
                setLinks([...links, newLink.trim()])
                setNewLink('')
              }
            }}
            className="btn btn-ghost px-4"
            disabled={!newLink.trim()}
          >
            <Plus size={18} strokeWidth={1.5} />
          </button>
        </div>
        
        {/* Links list */}
        {links.length > 0 ? (
          <div className="space-y-2">
            {links.map((link, index) => {
              let displayUrl = link
              try {
                const url = new URL(link)
                displayUrl = url.hostname + (url.pathname !== '/' ? url.pathname : '')
              } catch {
                // Keep original if not valid URL
              }
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#8A6A9A]/20 flex items-center justify-center flex-shrink-0">
                    <ExternalLink size={14} strokeWidth={1.5} className="text-[#8A6A9A]" />
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-sm text-white/70 hover:text-white truncate transition-colors"
                  >
                    {displayUrl}
                  </a>
                  <button
                    type="button"
                    onClick={() => setLinks(links.filter((_, i) => i !== index))}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X size={14} className="text-white/50" />
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-white/30 text-center py-4">
            {locale === 'ru' ? 'Добавьте ссылки на референсы, документы или внешние источники' : 'Add links to references, documents or external sources'}
          </p>
        )}
      </div>
      
      {/* Submit */}
      <div className="flex gap-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Save' : 'Create Thought'}
        </button>
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="btn btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
