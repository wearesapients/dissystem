/**
 * Onboarding Page Header
 */

'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface OnboardingHeaderProps {
  total: number
}

export function OnboardingHeader({ total }: OnboardingHeaderProps) {
  const { locale } = useLocale()
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white">
          {t('onboarding.title', locale)}
        </h1>
        <p className="text-sm sm:text-base text-white/50 mt-1">
          {t('onboarding.subtitle', locale)} • {total} {t('common.records', locale)}
        </p>
      </div>
      
      <Link 
        href="/onboarding/new"
        className="btn btn-primary w-full sm:w-auto justify-center"
      >
        <Plus size={18} strokeWidth={2} />
        {t('onboarding.newCard', locale)}
      </Link>
    </div>
  )
}

