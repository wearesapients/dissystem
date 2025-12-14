/**
 * Onboarding Card Detail Page
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronLeft, 
  User, 
  Calendar, 
  Tag, 
  Link2, 
  ExternalLink,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react'
import { getOnboardingCard, ONBOARDING_CATEGORY_LABELS } from '@/lib/onboarding/service'
import { getCurrentUser } from '@/lib/auth/session'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { OnboardingActions } from './onboarding-actions'
import { OnboardingComments } from '../components/onboarding-comments'

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function OnboardingDetailPage({ params }: PageProps) {
  const { id } = await params
  const [card, user] = await Promise.all([
    getOnboardingCard(id),
    getCurrentUser(),
  ])
  
  if (!card || !user) {
    notFound()
  }
  
  const categoryLabel = ONBOARDING_CATEGORY_LABELS[card.category]
  
  return (
    <div className="animate-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link 
            href="/onboarding" 
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Назад к онбордингу
          </Link>
          
          {/* Breadcrumb if has parent */}
          {card.parent && (
            <div className="flex items-center gap-2 text-sm text-white/50 mb-2">
              <Link 
                href={`/onboarding/${card.parent.id}`}
                className="hover:text-white transition-colors"
              >
                {card.parent.title}
              </Link>
              <ChevronRight size={14} strokeWidth={1.5} />
              <span className="text-white/70">{card.title}</span>
            </div>
          )}
          
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 bg-[#6A665E]/30 text-[#9C9688] rounded text-sm font-medium">
              {categoryLabel?.ru || card.category}
            </span>
            <StatusBadge status={card.status} />
            {card.isPinned && (
              <span className="px-2 py-0.5 bg-[#A89C6A]/20 text-[#A89C6A] rounded text-xs">
                Закреплено
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-semibold text-white">{card.title}</h1>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <User size={14} strokeWidth={1.5} />
              {card.createdBy.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} strokeWidth={1.5} />
              {formatRelativeTime(card.updatedAt)}
            </span>
          </div>
        </div>
        
        <OnboardingActions card={card} userRole={user.role} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          {card.images.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-4">
                <ImageIcon size={16} strokeWidth={1.5} className="text-[#8A8F96]" />
                Галерея ({card.images.length})
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {card.images.map((img, idx) => (
                  <div key={img.id} className="group">
                    <a 
                      href={img.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block aspect-video rounded-xl overflow-hidden bg-white/5"
                    >
                      <img 
                        src={img.imageUrl} 
                        alt={img.caption || `Image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </a>
                    {img.caption && (
                      <p className="text-xs text-white/50 mt-2">{img.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Description */}
          {card.description && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-medium text-white/60 mb-3">Описание</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 whitespace-pre-wrap">{card.description}</p>
              </div>
            </div>
          )}
          
          {/* Links */}
          {card.links.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-4">
                <ExternalLink size={16} strokeWidth={1.5} className="text-[#6B8F94]" />
                Ссылки и референсы
              </h3>
              <div className="space-y-2">
                {card.links.map((link, idx) => {
                  let hostname = ''
                  try {
                    hostname = new URL(link).hostname
                  } catch {
                    hostname = link
                  }
                  
                  return (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#3B4F52]/30 flex items-center justify-center">
                        <ExternalLink size={14} strokeWidth={1.5} className="text-[#6B8F94]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white group-hover:text-[#A89C6A] transition-colors truncate">
                          {link}
                        </p>
                        <p className="text-xs text-white/40">{hostname}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Children cards */}
          {card.children.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-4">
                <ChevronRight size={16} strokeWidth={1.5} className="text-[#7A8A5C]" />
                Вложенные карточки ({card.children.length})
              </h3>
              <div className="space-y-2">
                {card.children.map(child => (
                  <Link
                    key={child.id}
                    href={`/onboarding/${child.id}`}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-white group-hover:text-[#A89C6A] transition-colors">
                        {child.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-white/40">{ONBOARDING_CATEGORY_LABELS[child.category]?.ru}</span>
                        <StatusBadge status={child.status} />
                      </div>
                    </div>
                    <ChevronRight size={16} strokeWidth={1.5} className="text-white/30" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Comments */}
          <OnboardingComments 
            cardId={card.id}
            comments={card.comments}
            currentUserId={user?.id || ''}
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Linked Entities */}
          {card.linkedEntities.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <Link2 size={16} strokeWidth={1.5} className="text-[#7A8A5C]" />
                Связанные сущности
              </h3>
              <div className="space-y-2">
                {card.linkedEntities.map(le => (
                  <Link
                    key={le.entity.id}
                    href={`/entities/${le.entity.id}`}
                    className="flex items-center gap-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                  >
                    <span className="text-white">{le.entity.name}</span>
                    <span className="text-xs text-white/40 ml-auto">{le.entity.type}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags */}
          {card.tags.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-white mb-3">
                <Tag size={16} strokeWidth={1.5} className="text-[#8A8F96]" />
                Теги
              </h3>
              <div className="flex flex-wrap gap-2">
                {card.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/onboarding?tag=${tag}`}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Meta info */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-medium text-white mb-3">Информация</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/50">Создано</dt>
                <dd className="text-white">{formatRelativeTime(card.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Обновлено</dt>
                <dd className="text-white">{formatRelativeTime(card.updatedAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Порядок</dt>
                <dd className="text-white">{card.order}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Изображений</dt>
                <dd className="text-white">{card._count.images}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Комментариев</dt>
                <dd className="text-white">{card._count.comments}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

