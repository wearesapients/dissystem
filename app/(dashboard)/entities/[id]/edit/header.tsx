/**
 * Edit Entity Page Header - Localized
 */

'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

interface EditEntityHeaderProps {
  entityId: string
  entityName: string
}

export function EditEntityHeader({ entityId, entityName }: EditEntityHeaderProps) {
  const { locale } = useLocale()
  
  return (
    <>
      <Link 
        href={`/entities/${entityId}`}
        className="text-white/50 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        {locale === 'ru' ? 'Назад к объекту' : 'Back to entity'}
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {locale === 'ru' ? 'Редактирование' : 'Editing'}: {entityName}
        </h1>
        <p className="text-white/50">
          {t('entities.changesApplied', locale)}
        </p>
      </div>
    </>
  )
}



