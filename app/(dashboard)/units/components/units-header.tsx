/**
 * Units Header Component
 */

'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface UnitsHeaderProps {
  total: number
}

export function UnitsHeader({ total }: UnitsHeaderProps) {
  const { locale } = useLocale()
  
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          {t('units.title', locale)}
        </h1>
        <p className="text-white/50">
          {total} {t('common.records', locale)}
        </p>
      </div>
      
      <Link href="/entities/new?type=UNIT" className="btn btn-primary flex items-center gap-2">
        <Plus size={18} strokeWidth={1.5} />
        {t('units.newUnit', locale)}
      </Link>
    </div>
  )
}
