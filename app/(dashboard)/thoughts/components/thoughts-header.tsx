/**
 * Thoughts Header - Localized client component
 * Used for filtered views with back navigation
 */

'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { Plus, ArrowLeft } from 'lucide-react'

interface ThoughtsHeaderProps {
  total: number
  statusName?: string
}

const labelsEn: Record<string, string> = {
  // Entity type labels
  'Герои': 'Heroes',
  'Юниты': 'Units',
  'Фракции': 'Factions',
  'Заклинания': 'Spells',
  'Артефакты': 'Artifacts',
  'Локации': 'Locations',
  'Другое': 'Other',
}

export function ThoughtsHeader({ total, statusName }: ThoughtsHeaderProps) {
  const { locale } = useLocale()
  
  // Get localized name
  const displayStatusName = statusName 
    ? (locale === 'en' ? (labelsEn[statusName] || statusName) : statusName)
    : t('thoughts.title', locale)
  
  return (
    <div className="mb-6">
      {/* Back link - only shown for filtered views */}
      {statusName && (
        <Link 
          href="/thoughts" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {locale === 'ru' ? 'К обзору мыслей' : 'Back to thoughts'}
        </Link>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {displayStatusName}
          </h1>
          <p className="text-white/50">
            {total} {t('common.records', locale)}
          </p>
        </div>
        <Link href="/thoughts/new" className="btn btn-primary">
          <Plus size={18} strokeWidth={1.5} />
          {t('thoughts.newThought', locale)}
        </Link>
      </div>
    </div>
  )
}


