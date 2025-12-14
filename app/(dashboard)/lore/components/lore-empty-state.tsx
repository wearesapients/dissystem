/**
 * Lore Empty State Component
 */

'use client'

import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

export function LoreEmptyState() {
  const { locale } = useLocale()
  
  return (
    <div className="glass-card p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#3E2F45]/30 flex items-center justify-center">
        <BookOpen size={32} strokeWidth={1.5} className="text-[#8A6A9A]" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {t('lore.noEntries', locale)}
      </h3>
      <p className="text-white/50 mb-6 max-w-md mx-auto">
        {t('lore.noEntriesHint', locale)}
      </p>
      <Link href="/lore/new" className="btn btn-primary inline-flex items-center gap-2">
        <Plus size={18} strokeWidth={2} />
        {t('lore.createFirst', locale)}
      </Link>
    </div>
  )
}


