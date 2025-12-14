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
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          {t('onboarding.title', locale)}
        </h1>
        <p className="text-white/50 mt-1">
          {t('onboarding.subtitle', locale)} • {total} {t('common.records', locale)}
        </p>
      </div>
      
      <Link 
        href="/onboarding/new"
        className="btn btn-primary"
      >
        <Plus size={18} strokeWidth={2} />
        {t('onboarding.newCard', locale)}
      </Link>
    </div>
  )
}

