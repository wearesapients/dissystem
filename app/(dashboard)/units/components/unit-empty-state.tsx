/**
 * Units Empty State Component
 */

'use client'

import Link from 'next/link'
import { Swords, Plus } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

export function UnitEmptyState() {
  const { locale } = useLocale()
  
  return (
    <div className="glass-card p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mx-auto mb-4">
        <Swords size={32} strokeWidth={1.5} className="text-white/40" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">
        {t('units.noUnits', locale)}
      </h3>
      <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">
        {t('units.noUnitsHint', locale)}
      </p>
      <Link href="/entities/new?type=UNIT" className="btn btn-primary inline-flex items-center gap-2">
        <Plus size={16} strokeWidth={1.5} />
        {t('units.createFirst', locale)}
      </Link>
    </div>
  )
}

