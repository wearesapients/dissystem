/**
 * Entities Overview Page Header - Localized
 */

'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface EntitiesOverviewHeaderProps {
  total: number
}

export function EntitiesOverviewHeader({ total }: EntitiesOverviewHeaderProps) {
  const { locale } = useLocale()
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
          {t('entities.title', locale)}
        </h1>
        <p className="text-sm sm:text-base text-white/50">
          {total} {locale === 'ru' ? 'объектов всего' : 'entities total'}
        </p>
      </div>
      <Link href="/entities/new" className="btn btn-primary w-full sm:w-auto justify-center">
        <Plus size={18} strokeWidth={1.5} />
        {t('entities.newEntity', locale)}
      </Link>
    </div>
  )
}

