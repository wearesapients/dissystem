/**
 * Concept Art Form Component - Supports single & multiple image uploads
 */

/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, X, Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle,
  Link2, Search, Loader2, ImageIcon, Trash2, CheckCircle2, AlertCircle
} from 'lucide-react'

type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'
type AssetStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'

type Entity = { id: string; code: string; name: string; type: GameEntityType }
type ConceptArt = {
  id: string
  title: string
  description: string | null
  imageUrl: string
  status: AssetStatus
  entityId: string | null
  tags: string[]
}

interface FileUpload {
  id: string
  file: File
  preview: string
  title: string
  description: string
  imageUrl?: string
  status: 'pending' | 'uploading' | 'uploaded' | 'saving' | 'done' | 'error'
  error?: string
}

interface FormProps {
  art?: ConceptArt
  entities: Entity[]
  existingTags?: string[]
  preSelectedEntityId?: string
}

const statuses = [
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'IN_REVIEW', label: 'На проверке' },
  { value: 'APPROVED', label: 'Утверждено' },
  { value: 'REJECTED', label: 'Отклонено' },
]

const entityTypeLabels: Record<GameEntityType, string> = {
  HERO: 'Герои',
  UNIT: 'Юниты',
  FACTION: 'Фракции',
  SPELL: 'Заклинания',
  ARTIFACT: 'Артефакты',
  LOCATION: 'Локации',
  OBJECT: 'Объекты',
  OTHER: 'Другое',
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

export function ConceptArtForm({ art, entities, existingTags = [], preSelectedEntityId }: FormProps) {
  const router = useRouter()
  const isEdit = !!art
  
  // For single edit mode
  const [title, setTitle] = useState(art?.title || '')
  const [description, setDescription] = useState(art?.description || '')
  const [imageUrl, setImageUrl] = useState(art?.imageUrl || '')
  
  // Common settings
  const [status, setStatus] = useState<AssetStatus>(art?.status || 'DRAFT')
  const [entityId, setEntityId] = useState(art?.entityId || preSelectedEntityId || '')
  const [tagsInput, setTagsInput] = useState(art?.tags.join(', ') || '')
  
  // Multiple uploads
  const [files, setFiles] = useState<FileUpload[]>([])
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [entitySearch, setEntitySearch] = useState('')
  const [showEntityPicker, setShowEntityPicker] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  const selectedEntity = entities.find(e => e.id === entityId)
  const isMultiple = files.length > 0 && !isEdit
  
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
  
  // Handle file upload to server
  const uploadFileToServer = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Upload failed')
    }
    
    const data = await res.json()
    return data.imageUrl
  }
  
  // Handle single file upload (edit mode)
  const uploadSingleFile = async (file: File) => {
    setUploading(true)
    setError('')
    
    try {
      const url = await uploadFileToServer(file)
      setImageUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }
  
  // Handle multiple file selection
  const handleFilesSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return
    
    const newFiles: FileUpload[] = Array.from(selectedFiles)
      .filter(f => f.type.startsWith('image/'))
      .map(file => ({
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        file,
        preview: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        description: '',
        status: 'pending' as const,
      }))
    
    setFiles(prev => [...prev, ...newFiles])
  }
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEdit) {
      const file = e.target.files?.[0]
      if (file) uploadSingleFile(file)
    } else {
      handleFilesSelect(e.target.files)
    }
  }
  
  // Drag & Drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = e.dataTransfer.files
    if (isEdit) {
      const file = droppedFiles?.[0]
      if (file && file.type.startsWith('image/')) {
        uploadSingleFile(file)
      }
    } else {
      handleFilesSelect(droppedFiles)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit])
  
  // Update file properties
  const updateFile = (id: string, updates: Partial<FileUpload>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }
  
  // Remove file from list
  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file) URL.revokeObjectURL(file.preview)
      return prev.filter(f => f.id !== id)
    })
  }
  
  // Submit multiple files
  const handleMultipleSubmit = async () => {
    setLoading(true)
    setError('')
    
    const tags = parseTags(tagsInput)
    let successCount = 0
    let errorCount = 0
    const totalToProcess = files.filter(f => f.status !== 'done').length
    
    for (const fileUpload of files) {
      if (fileUpload.status === 'done') continue
      
      try {
        // Upload image
        updateFile(fileUpload.id, { status: 'uploading' })
        const uploadedUrl = await uploadFileToServer(fileUpload.file)
        updateFile(fileUpload.id, { imageUrl: uploadedUrl, status: 'saving' })
        
        // Create concept art
        const res = await fetch('/api/concept-arts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: fileUpload.title,
            description: fileUpload.description || null,
            imageUrl: uploadedUrl,
            status,
            tags,
            entityId: entityId || null,
          }),
        })
        
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to save')
        }
        
        updateFile(fileUpload.id, { status: 'done' })
        successCount++
      } catch (err) {
        updateFile(fileUpload.id, { 
          status: 'error', 
          error: err instanceof Error ? err.message : 'Ошибка' 
        })
        errorCount++
      }
    }
    
    setLoading(false)
    
    // Check if all done (no errors)
    if (errorCount === 0 && successCount === totalToProcess) {
      // Redirect to entity page if linked, otherwise to concept art list
      const redirectUrl = entityId 
        ? `/entities/${entityId}?tab=concepts` 
        : '/concept-art'
      router.push(redirectUrl)
      router.refresh()
    }
  }
  
  // Submit single (edit mode)
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (!imageUrl) {
      setError('Необходимо загрузить изображение')
      setLoading(false)
      return
    }
    
    const tags = parseTags(tagsInput)
    
    try {
      const url = isEdit ? `/api/concept-arts/${art.id}` : '/api/concept-arts'
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, description, imageUrl, status, tags,
          entityId: entityId || null,
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
        return
      }
      
      // Redirect to entity page if linked, otherwise to concept art list
      const redirectUrl = entityId 
        ? `/entities/${entityId}?tab=concepts` 
        : '/concept-art'
      router.push(redirectUrl)
      router.refresh()
    } catch {
      setError('Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isMultiple) {
      handleMultipleSubmit()
    } else {
      handleSingleSubmit(e)
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
  
  const completedCount = files.filter(f => f.status === 'done').length
  const hasErrors = files.some(f => f.status === 'error')
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-[#5A1E1E]/20 border border-[#5A1E1E]/30 rounded-xl text-[#B07070] text-sm">
          {error}
        </div>
      )}
      
      {/* IMAGE UPLOAD */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <ImageIcon size={16} strokeWidth={1.5} className="text-[#8A6A9A]" />
          {isEdit ? 'Изображение *' : 'Изображения *'}
          {!isEdit && <span className="text-white/40 font-normal">(можно выбрать несколько)</span>}
        </label>
        
        {/* Edit mode - single image */}
        {isEdit && (
          imageUrl ? (
            <div className="relative rounded-xl overflow-hidden bg-black/20">
              <div className="aspect-video flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
              >
                <X size={16} strokeWidth={1.5} className="text-white" />
              </button>
            </div>
          ) : (
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-[#8A6A9A] bg-[#8A6A9A]/10' 
                  : 'border-white/20 hover:border-[#8A6A9A]/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={32} className="text-[#8A6A9A] animate-spin" />
                  <p className="text-white/50">Загрузка...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload size={32} strokeWidth={1.5} className="text-white/30" />
                  <div>
                    <p className="text-white/70">Перетащите изображение сюда</p>
                    <p className="text-sm text-white/40 mt-1">или нажмите для выбора файла</p>
                  </div>
                  <p className="text-xs text-white/30">PNG, JPG, WebP, GIF • до 10MB</p>
                </div>
              )}
            </div>
          )
        )}
        
        {/* New mode - multiple images */}
        {!isEdit && (
          <>
            {/* Drop zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-[#8A6A9A] bg-[#8A6A9A]/10' 
                  : 'border-white/20 hover:border-[#8A6A9A]/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              
              <div className="flex flex-col items-center gap-3">
                <Upload size={32} strokeWidth={1.5} className="text-white/30" />
                <div>
                  <p className="text-white/70">Перетащите изображения сюда</p>
                  <p className="text-sm text-white/40 mt-1">или нажмите для выбора файлов</p>
                </div>
                <p className="text-xs text-white/30">PNG, JPG, WebP, GIF • до 10MB каждый</p>
              </div>
            </div>
            
            {/* Selected files list */}
            {files.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/60">
                    Выбрано файлов: {files.length}
                    {completedCount > 0 && (
                      <span className="text-[#7A8A5C] ml-2">
                        (загружено: {completedCount})
                      </span>
                    )}
                  </p>
                  {files.length > 0 && !loading && (
                    <button
                      type="button"
                      onClick={() => setFiles([])}
                      className="text-xs text-white/40 hover:text-[#9A4A4A] transition-colors"
                    >
                      Очистить все
                    </button>
                  )}
                </div>
                
                {files.map((fileUpload, index) => (
                  <div 
                    key={fileUpload.id}
                    className={`flex gap-4 p-3 rounded-xl border transition-colors ${
                      fileUpload.status === 'done' 
                        ? 'bg-[#4F5A3C]/20 border-[#4F5A3C]/30'
                        : fileUpload.status === 'error'
                        ? 'bg-[#5A1E1E]/10 border-[#5A1E1E]/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-black/20">
                      <img
                        src={fileUpload.preview}
                        alt={fileUpload.title}
                        className="w-full h-full object-cover"
                      />
                      {fileUpload.status === 'uploading' || fileUpload.status === 'saving' ? (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 size={20} className="text-white animate-spin" />
                        </div>
                      ) : fileUpload.status === 'done' ? (
                        <div className="absolute inset-0 bg-[#4F5A3C]/40 flex items-center justify-center">
                          <CheckCircle2 size={24} className="text-[#7A8A5C]" />
                        </div>
                      ) : fileUpload.status === 'error' ? (
                        <div className="absolute inset-0 bg-[#5A1E1E]/30 flex items-center justify-center">
                          <AlertCircle size={24} className="text-[#9A4A4A]" />
                        </div>
                      ) : null}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <input
                        type="text"
                        value={fileUpload.title}
                        onChange={(e) => updateFile(fileUpload.id, { title: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30"
                        placeholder={`Название ${index + 1}`}
                        disabled={fileUpload.status !== 'pending'}
                      />
                      <input
                        type="text"
                        value={fileUpload.description}
                        onChange={(e) => updateFile(fileUpload.id, { description: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/70 placeholder:text-white/20"
                        placeholder="Описание (опционально)"
                        disabled={fileUpload.status !== 'pending'}
                      />
                      {fileUpload.error && (
                        <p className="text-xs text-[#9A4A4A]">{fileUpload.error}</p>
                      )}
                    </div>
                    
                    {/* Remove button */}
                    {fileUpload.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => removeFile(fileUpload.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors self-start"
                      >
                        <Trash2 size={16} className="text-white/40 hover:text-[#9A4A4A]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* ENTITY LINK */}
      <div className="glass-card p-5">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <Link2 size={16} strokeWidth={1.5} className="text-[#A89C6A]" />
          Привязка к объекту
          <span className="text-white/40 font-normal">(рекомендуется)</span>
        </label>
        
        {selectedEntity ? (
          <div className="flex items-center gap-3 p-3 bg-[#A89C6A]/10 border border-[#A89C6A]/30 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <EntityIcon type={selectedEntity.type} size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">{selectedEntity.name}</p>
              <p className="text-xs text-white/50">{entityTypeLabels[selectedEntity.type]} • {selectedEntity.code}</p>
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
              Выбрать объект
            </button>
            
            {showEntityPicker && (
              <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10 max-h-80 overflow-y-auto">
                {/* Search */}
                <div className="relative mb-3">
                  <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    placeholder="Поиск объекта..."
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
                  <p className="text-center text-white/40 py-4">Объекты не найдены</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Main form - only for single upload or edit */}
      {(isEdit || !isMultiple) && (
        <div className="glass-card p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Название *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="input"
              placeholder="Название концепта"
              required={!isMultiple}
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Описание / Комментарий</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input min-h-[120px] resize-y"
              placeholder="Детали концепта, заметки для команды..."
            />
          </div>
        </div>
      )}
      
      {/* Common settings */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-sm font-medium text-white">
          {isMultiple ? 'Общие настройки для всех' : 'Настройки'}
        </h3>
        
        {/* Status */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Статус</label>
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value as AssetStatus)} 
            className="input"
          >
            {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Теги (через запятую)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            className="input"
            placeholder="персонаж, броня, оружие"
          />
          {suggestedTags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-white/40 mb-2">Существующие теги:</p>
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
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || uploading || (isMultiple && files.length === 0) || (!isMultiple && !isEdit && !imageUrl && files.length === 0)}
        >
          {loading ? (
            isMultiple 
              ? `Загрузка ${completedCount}/${files.length}...` 
              : 'Сохранение...'
          ) : isEdit ? (
            'Сохранить'
          ) : isMultiple ? (
            `Загрузить ${files.length} концептов`
          ) : (
            'Загрузить концепт'
          )}
        </button>
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="btn btn-ghost"
          disabled={loading}
        >
          Отмена
        </button>
        {hasErrors && !loading && (
          <button
            type="button"
            onClick={handleMultipleSubmit}
            className="btn btn-ghost text-[#A89C6A]"
          >
            Повторить неудачные
          </button>
        )}
      </div>
    </form>
  )
}

