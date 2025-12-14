/**
 * Concept Art Header Component - For filtered views
 */

'use client'

import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

type Props = {
  total: number
  statusName?: string
}

const labelsEn: Record<string, string> = {
  // Status labels
  'Черновики': 'Drafts',
  'На проверке': 'In Review',
  'Утверждено': 'Approved',
  'Архив': 'Archived',
  // Entity type labels
  'Герои': 'Heroes',
  'Юниты': 'Units',
  'Фракции': 'Factions',
  'Заклинания': 'Spells',
  'Артефакты': 'Artifacts',
  'Локации': 'Locations',
  'Объекты': 'Objects',
  'Другое': 'Other',
  'Без привязки': 'Unlinked',
}

export function ConceptArtHeader({ total, statusName }: Props) {
  const { locale } = useLocale()
  
  const displayStatusName = statusName 
    ? (locale === 'en' ? (labelsEn[statusName] || statusName) : statusName)
    : t('conceptArt.title', locale)
  
  return (
    <div className="mb-8">
      {/* Back link - only shown for filtered views */}
      {statusName && (
        <Link 
          href="/concept-art" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          {locale === 'ru' ? 'К обзору концепт-артов' : 'Back to concept art'}
        </Link>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {displayStatusName}
          </h1>
          <p className="text-white/50">
            {total} {locale === 'ru' ? 'работ' : 'works'}
          </p>
        </div>
        <Link href="/concept-art/new" className="btn btn-primary">
          <Plus size={18} strokeWidth={1.5} />
          {t('conceptArt.upload', locale)}
        </Link>
      </div>
    </div>
  )
}


