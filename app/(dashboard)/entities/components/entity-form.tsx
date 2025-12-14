/**
 * Entity Form Component - Localized
 * For creating and editing game entities
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle,
  Tag, FileText, Check
} from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t, getEntityTypeLabel } from '@/lib/i18n'

type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'

type Entity = {
  id: string
  name: string
  code: string
  type: GameEntityType
  description: string | null
  shortDescription: string | null
  iconUrl: string | null
}

interface FormProps {
  entity?: Entity
}

const entityTypes: { value: GameEntityType; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
  { value: 'HERO', icon: Crown },
  { value: 'UNIT', icon: Swords },
  { value: 'FACTION', icon: Castle },
  { value: 'SPELL', icon: Sparkles },
  { value: 'ARTIFACT', icon: Gem },
  { value: 'LOCATION', icon: MapPin },
  { value: 'OBJECT', icon: Box },
  { value: 'OTHER', icon: HelpCircle },
]

const typeColors: Record<GameEntityType, { bg: string; border: string; text: string }> = {
  HERO: { bg: 'from-[#3E2F45]/25 to-[#3E2F45]/15', border: 'border-[#3E2F45]/40', text: 'text-[#8A6A9A]' },
  UNIT: { bg: 'from-[#5F646B]/25 to-[#5F646B]/15', border: 'border-[#5F646B]/40', text: 'text-[#A8ABB0]' },
  FACTION: { bg: 'from-[#A89C6A]/25 to-[#A89C6A]/15', border: 'border-[#A89C6A]/40', text: 'text-[#A89C6A]' },
  SPELL: { bg: 'from-[#3B4F52]/25 to-[#3B4F52]/15', border: 'border-[#3B4F52]/40', text: 'text-[#6B8F94]' },
  ARTIFACT: { bg: 'from-[#A89C6A]/30 to-[#A89C6A]/20', border: 'border-[#A89C6A]/50', text: 'text-[#C7B97A]' },
  LOCATION: { bg: 'from-[#4F5A3C]/25 to-[#4F5A3C]/15', border: 'border-[#4F5A3C]/40', text: 'text-[#7A8A5C]' },
  OBJECT: { bg: 'from-[#6A665E]/20 to-[#6A665E]/10', border: 'border-[#6A665E]/30', text: 'text-[#9C9688]' },
  OTHER: { bg: 'from-[#5F646B]/20 to-[#5F646B]/10', border: 'border-[#5F646B]/30', text: 'text-[#8A8F96]' },
}

// Transliteration map for Russian -> Latin
const translitMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
  'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'YO', 'Ж': 'ZH',
  'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
  'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'KH', 'Ц': 'TS',
  'Ч': 'CH', 'Ш': 'SH', 'Щ': 'SHCH', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'YU', 'Я': 'YA',
}

// Transliterate Russian to Latin
function transliterate(text: string): string {
  return text.split('').map(char => translitMap[char] || char).join('')
}

// Validate that code contains only Latin characters, numbers, and underscores
function isValidCode(code: string): boolean {
  return /^[A-Z0-9_]+$/.test(code)
}

export function EntityForm({ entity }: FormProps) {
  const router = useRouter()
  const { locale } = useLocale()
  const isEdit = !!entity
  
  const [name, setName] = useState(entity?.name || '')
  const [code, setCode] = useState(entity?.code || '')
  const [type, setType] = useState<GameEntityType>(entity?.type || 'HERO')
  const [description, setDescription] = useState(entity?.description || '')
  const [shortDescription, setShortDescription] = useState(entity?.shortDescription || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [autoCode, setAutoCode] = useState(!entity)
  const [codeError, setCodeError] = useState('')
  
  // Auto-generate code from name (with transliteration)
  const generateCode = (name: string, type: GameEntityType): string => {
    const prefix = type.substring(0, 3).toUpperCase()
    const transliterated = transliterate(name)
    const baseName = transliterated
      .toUpperCase()
      .replace(/[^A-Z0-9]/gi, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 20)
    return baseName ? `${prefix}_${baseName}` : ''
  }
  
  const handleNameChange = (value: string) => {
    setName(value)
    if (autoCode && !isEdit) {
      setCode(generateCode(value, type))
    }
  }
  
  const handleTypeChange = (newType: GameEntityType) => {
    setType(newType)
    if (autoCode && !isEdit && name) {
      setCode(generateCode(name, newType))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCodeError('')
    setLoading(true)
    
    // Validate code is Latin-only
    const finalCode = code.trim()
    if (finalCode && !isValidCode(finalCode)) {
      setError(locale === 'ru' 
        ? 'Код должен содержать только латиницу, цифры и подчёркивания' 
        : 'Code must contain only Latin letters, numbers and underscores')
      setLoading(false)
      return
    }
    
    try {
      const url = isEdit ? `/api/entities/${entity.id}` : '/api/entities'
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          code: finalCode || undefined,
          type,
          description: description.trim() || null,
          shortDescription: shortDescription.trim() || null,
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || (locale === 'ru' ? 'Ошибка сохранения' : 'Save error'))
        return
      }
      
      router.push('/entities')
      router.refresh()
    } catch {
      setError(locale === 'ru' ? 'Ошибка сохранения' : 'Save error')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-[#5A1E1E]/20 border border-[#5A1E1E]/30 rounded-xl text-[#B07070] text-sm">
          {error}
        </div>
      )}
      
      {/* Entity Type Selection - Prominent */}
      <div className="glass-card p-6">
        <label className="flex items-center gap-2 text-sm font-medium text-white mb-4">
          <Tag size={16} strokeWidth={1.5} className="text-[#A89C6A]" />
          {t('entities.category', locale)}
          <span className="text-[#9A4A4A]">*</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {entityTypes.map(({ value, icon: Icon }) => {
            const isSelected = type === value
            const colors = typeColors[value]
            
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleTypeChange(value)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? `bg-gradient-to-br ${colors.bg} ${colors.border}` 
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon 
                    size={24} 
                    strokeWidth={1.5} 
                    className={isSelected ? colors.text : 'text-white/50'} 
                  />
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>
                    {getEntityTypeLabel(value, locale)}
                  </span>
                </div>
                {isSelected && (
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
                    <Check size={12} className={colors.text} strokeWidth={2.5} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Main Form Fields */}
      <div className="glass-card p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm text-white/60 mb-2">
            {t('entities.name', locale)} <span className="text-[#9A4A4A]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            className="input"
            placeholder={locale === 'ru' ? 'Введите название сущности' : 'Enter entity name'}
            required
          />
        </div>
        
        {/* Code */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-white/60">
              {t('entities.code', locale)}
            </label>
            {!isEdit && (
              <label className="flex items-center gap-2 text-sm text-white/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoCode}
                  onChange={e => setAutoCode(e.target.checked)}
                  className="rounded border-white/20"
                />
                {t('entities.autoGenerateCode', locale)}
              </label>
            )}
          </div>
          <input
            type="text"
            value={code}
            onChange={e => {
              const newCode = transliterate(e.target.value).toUpperCase().replace(/[^A-Z0-9_]/g, '')
              setCode(newCode)
              setAutoCode(false)
              if (e.target.value !== newCode && e.target.value.length > 0) {
                setCodeError(locale === 'ru' 
                  ? 'Код автоматически транслитерирован в латиницу' 
                  : 'Code automatically transliterated to Latin')
                setTimeout(() => setCodeError(''), 3000)
              }
            }}
            className={`input font-mono ${codeError ? 'border-[#A89C6A]/50' : ''}`}
            placeholder="HERO_EXAMPLE"
            disabled={autoCode && !isEdit}
          />
          {codeError ? (
            <p className="text-xs text-[#A89C6A] mt-1">{codeError}</p>
          ) : (
            <p className="text-xs text-white/40 mt-1">
              {locale === 'ru' 
                ? 'Только латиница, цифры и подчёркивания (A-Z, 0-9, _)' 
                : 'Latin letters, numbers and underscores only (A-Z, 0-9, _)'}
            </p>
          )}
        </div>
        
        {/* Short Description */}
        <div>
          <label className="block text-sm text-white/60 mb-2">
            {t('entities.shortDescription', locale)}
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={e => setShortDescription(e.target.value)}
            className="input"
            placeholder={locale === 'ru' ? 'Короткое описание для карточки' : 'Short description for card'}
            maxLength={200}
          />
          <p className="text-xs text-white/40 mt-1">
            {shortDescription.length}/200 {locale === 'ru' ? 'символов' : 'characters'}
          </p>
        </div>
        
        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <FileText size={14} strokeWidth={1.5} />
            {t('entities.fullDescription', locale)}
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="input min-h-[160px] resize-y"
            placeholder={locale === 'ru' 
              ? 'Подробное описание сущности, её роль в игре, особенности...' 
              : 'Detailed description of the entity, its role in the game, features...'}
          />
        </div>
      </div>
      
      {/* Submit */}
      <div className="flex gap-4">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || !name.trim()}
        >
          {loading 
            ? t('common.loading', locale)
            : isEdit 
              ? t('entities.saveChanges', locale)
              : t('entities.createEntity', locale)
          }
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


