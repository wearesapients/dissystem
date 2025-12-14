/**
 * Thoughts Overview Page Header - Localized
 */

'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface ThoughtsOverviewHeaderProps {
  total: number
}

export function ThoughtsOverviewHeader({ total }: ThoughtsOverviewHeaderProps) {
  const { locale } = useLocale()
  
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('thoughts.title', locale)}
        </h1>
        <p className="text-white/50">
          {total} {locale === 'ru' ? 'записей всего' : 'entries total'}
        </p>
      </div>
      <Link href="/thoughts/new" className="btn btn-primary">
        <Plus size={18} strokeWidth={1.5} />
        {t('thoughts.newThought', locale)}
      </Link>
    </div>
  )
}
