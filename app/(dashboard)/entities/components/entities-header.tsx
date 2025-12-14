/**
 * Entities Page Header - Localized
 * Used for filtered entity type views
 */

'use client'

import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface EntitiesHeaderProps {
  total: number
  typeName?: string
}

const typeLabelsEn: Record<string, string> = {
  'Герои': 'Heroes',
  'Фракции': 'Factions',
  'Заклинания': 'Spells',
  'Артефакты': 'Artifacts',
  'Локации': 'Locations',
  'Объекты': 'Objects',
  'Другое': 'Other',
}

export function EntitiesHeader({ total, typeName }: EntitiesHeaderProps) {
  const { locale } = useLocale()
  
  // Get localized type name
  const displayTypeName = typeName 
    ? (locale === 'en' ? (typeLabelsEn[typeName] || typeName) : typeName)
    : t('entities.title', locale)
  
  return (
    <div className="mb-8">
      {/* Back link */}
      <Link 
        href="/entities" 
        className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        {locale === 'ru' ? 'К обзору сущностей' : 'Back to entities'}
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {displayTypeName}
          </h1>
          <p className="text-white/50">
            {total} {locale === 'ru' ? 'сущностей' : 'entities'}
          </p>
        </div>
        <Link href="/entities/new" className="btn btn-primary">
          <Plus size={18} strokeWidth={1.5} />
          {t('entities.newEntity', locale)}
        </Link>
      </div>
    </div>
  )
}

