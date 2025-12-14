/**
 * New Entity Page Header - Localized
 */

'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

export function NewEntityHeader() {
  const { locale } = useLocale()
  
  return (
    <>
      <Link 
        href="/entities" 
        className="text-white/50 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        {t('entities.backToEntities', locale)}
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('entities.newEntity', locale)}
        </h1>
        <p className="text-white/50">
          {locale === 'ru' 
            ? 'Создайте новую игровую сущность для связи с концептами, лором и мыслями'
            : 'Create a new game entity to link with concepts, lore and thoughts'
          }
        </p>
      </div>
    </>
  )
}



