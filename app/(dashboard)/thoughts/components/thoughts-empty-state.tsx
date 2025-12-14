/**
 * Thoughts Empty State - Localized
 */

'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { Plus } from 'lucide-react'

export function ThoughtsEmptyState() {
  const { locale } = useLocale()
  
  return (
    <div className="glass-card p-12 text-center">
      <p className="text-white/50 mb-4">{t('common.noResults', locale)}</p>
      <Link href="/thoughts/new" className="btn btn-primary">
        <Plus size={18} strokeWidth={1.5} />
        {t('thoughts.newThought', locale)}
      </Link>
    </div>
  )
}



