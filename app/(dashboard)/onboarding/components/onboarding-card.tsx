/**
 * Onboarding Card Component
 */

'use client'

import Link from 'next/link'
import { Link2, MessageSquare, Image as ImageIcon, User, Tag, Pin, ChevronRight, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { t, getEntityTypeLabel } from '@/lib/i18n'
import { ONBOARDING_CATEGORY_LABELS, OnboardingCategory } from '@/lib/onboarding/service'

type Entity = {
  id: string
  code: string
  name: string
  type: string
}

type LinkedEntity = {
  entity: Entity
}

type OnboardingImage = {
  id: string
  imageUrl: string
  caption: string | null
}

type OnboardingCardType = {
  id: string
  title: string
  description: string | null
  category: OnboardingCategory
  status: string
  isPinned: boolean
  tags: string[]
  links: string[]
  updatedAt: Date
  createdBy: {
    id: string
    name: string
    avatarUrl: string | null
  }
  images: OnboardingImage[]
  linkedEntities: LinkedEntity[]
  _count: {
    comments: number
    images: number
    children: number
  }
}

interface OnboardingCardProps {
  card: OnboardingCardType
}

export function OnboardingCard({ card }: OnboardingCardProps) {
  const { locale } = useLocale()
  
  const categoryLabel = ONBOARDING_CATEGORY_LABELS[card.category]?.[locale] || card.category
  
  // Preview text
  const previewText = card.description?.substring(0, 120) + (card.description && card.description.length > 120 ? '...' : '')
  
  return (
    <Link 
      href={`/onboarding/${card.id}`}
      className="glass-card p-5 hover:bg-white/[0.08] transition-all group block relative"
    >
      {/* Pinned indicator */}
      {card.isPinned && (
        <div className="absolute top-3 right-3">
          <Pin size={14} strokeWidth={1.5} className="text-[#A89C6A] fill-[#A89C6A]" />
        </div>
      )}
      
      {/* Image preview */}
      {card.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-hidden">
          {card.images.slice(0, 3).map((img, idx) => (
            <div 
              key={img.id}
              className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden flex-shrink-0"
            >
              <img 
                src={img.imageUrl} 
                alt={img.caption || `Image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {card._count.images > 3 && (
            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-white/60">+{card._count.images - 3}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 bg-[#6A665E]/30 text-[#9C9688] rounded text-xs font-medium">
              {categoryLabel}
            </span>
            <StatusBadge status={card.status} />
          </div>
          <h3 className="font-semibold text-white group-hover:text-[#A89C6A] transition-colors line-clamp-2">
            {card.title}
          </h3>
        </div>
      </div>
      
      {/* Preview */}
      {previewText && (
        <p className="text-sm text-white/60 line-clamp-2 mb-4">
          {previewText}
        </p>
      )}
      
      {/* Links preview */}
      {card.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {card.links.slice(0, 2).map((link, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#3B4F52]/30 text-[#6B8F94] rounded text-xs"
            >
              <ExternalLink size={10} strokeWidth={1.5} />
              {new URL(link).hostname}
            </span>
          ))}
          {card.links.length > 2 && (
            <span className="px-2 py-0.5 text-xs text-white/40">
              +{card.links.length - 2} {t('common.more', locale) || 'more'}
            </span>
          )}
        </div>
      )}
      
      {/* Linked Entities */}
      {card.linkedEntities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {card.linkedEntities.slice(0, 2).map(le => (
            <span 
              key={le.entity.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg text-xs text-white/60"
            >
              <Link2 size={10} strokeWidth={1.5} />
              <span>{le.entity.name}</span>
              <span className="text-white/30">({getEntityTypeLabel(le.entity.type, locale)})</span>
            </span>
          ))}
          {card.linkedEntities.length > 2 && (
            <span className="px-2 py-1 bg-white/5 rounded-lg text-xs text-white/40">
              +{card.linkedEntities.length - 2}
            </span>
          )}
        </div>
      )}
      
      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {card.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded text-xs text-white/50"
            >
              <Tag size={10} strokeWidth={1.5} />
              {tag}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-white/30">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-white/40 pt-3 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <User size={12} strokeWidth={1.5} />
            {card.createdBy.name}
          </span>
          <span>{formatRelativeTime(card.updatedAt)}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {card._count.images > 0 && (
            <span className="flex items-center gap-1">
              <ImageIcon size={12} strokeWidth={1.5} />
              {card._count.images}
            </span>
          )}
          {card._count.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={12} strokeWidth={1.5} />
              {card._count.comments}
            </span>
          )}
          {card._count.children > 0 && (
            <span className="flex items-center gap-1">
              <ChevronRight size={12} strokeWidth={1.5} />
              {card._count.children}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}


