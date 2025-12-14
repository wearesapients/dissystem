/**
 * Back Navigation Component
 * Shows contextual back link - to entity or to list
 */

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Box } from 'lucide-react'

interface BackNavigationProps {
  defaultHref: string
  defaultLabel: string
}

export function BackNavigation({ defaultHref, defaultLabel }: BackNavigationProps) {
  const searchParams = useSearchParams()
  const fromEntity = searchParams.get('fromEntity')
  const entityName = searchParams.get('entityName')
  
  if (fromEntity && entityName) {
    return (
      <Link 
        href={`/entities/${fromEntity}?tab=thoughts`}
        className="text-white/50 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        <Box size={14} strokeWidth={1.5} className="text-[#A89C6A]" />
        <span>Назад к <span className="text-[#A89C6A]">{entityName}</span></span>
      </Link>
    )
  }
  
  return (
    <Link 
      href={defaultHref}
      className="text-white/50 hover:text-white mb-6 inline-flex items-center gap-2 transition-colors"
    >
      <ArrowLeft size={16} strokeWidth={1.5} />
      {defaultLabel}
    </Link>
  )
}

