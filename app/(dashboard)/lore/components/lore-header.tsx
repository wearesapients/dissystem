/**
 * Lore Header Component - For filtered views
 */

'use client'

import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface LoreHeaderProps {
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

export function LoreHeader({ total, statusName }: LoreHeaderProps) {
  const { locale } = useLocale()
  
  const displayStatusName = statusName 
    ? (locale === 'en' ? (labelsEn[statusName] || statusName) : statusName)
    : t('lore.title', locale)
  
  return (
    <div className="mb-6 sm:mb-8">
      {/* Back link - only shown for filtered views */}
      {statusName && (
        <Link 
          href="/lore" 
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-3 sm:mb-4 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {locale === 'ru' ? 'К обзору лора' : 'Back to lore'}
        </Link>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            {displayStatusName}
          </h1>
          <p className="text-sm sm:text-base text-white/50">
            {total} {t('common.records', locale)}
          </p>
        </div>
        <Link href="/lore/new" className="btn btn-primary w-full sm:w-auto justify-center">
          <Plus size={18} strokeWidth={1.5} />
          {t('lore.newEntry', locale)}
        </Link>
      </div>
    </div>
  )
}

