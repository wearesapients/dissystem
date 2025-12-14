/**
 * Entity Empty State - Localized
 */

'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface EntityEmptyStateProps {
  type?: string
}

export function EntityEmptyState({ type }: EntityEmptyStateProps) {
  const { locale } = useLocale()
  
  return (
    <div className="glass-card p-12 text-center">
      <p className="text-white/50 mb-4">
        {locale === 'ru' ? 'Нет сущностей этого типа' : 'No entities of this type'}
      </p>
      <Link 
        href={type ? `/entities/new?type=${type}` : '/entities/new'} 
        className="btn btn-secondary inline-flex items-center gap-2"
      >
        <Plus size={16} strokeWidth={1.5} />
        {t('common.create', locale)}
      </Link>
    </div>
  )
}


