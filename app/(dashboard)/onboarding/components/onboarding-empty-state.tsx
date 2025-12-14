/**
 * Onboarding Empty State
 */

'use client'

import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

export function OnboardingEmptyState() {
  const { locale } = useLocale()
  
  return (
    <div className="glass-card p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#3B4F52]/30 to-[#2A2A2D]/20 flex items-center justify-center">
        <BookOpen size={32} strokeWidth={1.5} className="text-[#6B8F94]" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {t('onboarding.noCards', locale)}
      </h3>
      <p className="text-white/50 mb-6 max-w-md mx-auto">
        {t('onboarding.noCardsHint', locale)}
      </p>
      
      <Link 
        href="/onboarding/new"
        className="btn btn-primary inline-flex"
      >
        <Plus size={18} strokeWidth={2} />
        {t('onboarding.createFirst', locale)}
      </Link>
    </div>
  )
}


