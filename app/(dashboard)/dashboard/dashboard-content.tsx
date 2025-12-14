/**
 * Dashboard Content - Localized Client Component
 */

'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { RelativeTime } from '@/components/ui/relative-time'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import {
  IconSkullRune,
  IconMysticBrush,
  IconGrimoire,
  IconAncientScroll,
  IconSparkle,
  IconQuill,
  IconStatusChange,
  IconComment,
  IconTrash,
  IconGitBranch,
} from '@/components/icons/fantasy-icons'

type Activity = {
  id: string
  type: string
  description: string
  metadata: Record<string, unknown> | null
  createdAt: string
  user: { name: string } | null
  entity: { id: string; name: string; code: string } | null
}

type ConceptArt = {
  id: string
  title: string
  imageUrl: string | null
  thumbnailUrl: string | null
  status: string
  createdAt: string
  entity: { id: string; name: string; type: string } | null
  createdBy: { name: string }
}

interface DashboardContentProps {
  stats: {
    entities: number
    conceptArts: number
    lore: number
    thoughts: number
    thoughtsByStatus: Record<string, number>
    recentActivity: Activity[]
    recentConceptArts: ConceptArt[]
  }
}

export function DashboardContent({ stats }: DashboardContentProps) {
  const { locale } = useLocale()
  
  return (
    <div className="animate-in lg:h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{t('dashboard.title', locale)}</h1>
        <p className="text-sm sm:text-base text-white/50">{t('dashboard.overview', locale)}</p>
      </div>
      
      {/* Main Layout: Left (Stats + Concept Arts) + Right (Activity) */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 flex-1 min-h-0">
        {/* Left Column: Stats + Concept Arts */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 min-w-0">
          {/* Stats Grid - responsive */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
            <StatCard
              icon={IconSkullRune}
              label={t('dashboard.gameEntities', locale)}
              value={stats.entities}
              href="/entities"
              addHref="/entities/new"
            />
            <StatCard
              icon={IconMysticBrush}
              label={t('dashboard.conceptArts', locale)}
              value={stats.conceptArts}
              href="/concept-art"
              addHref="/concept-art/new"
            />
            <StatCard
              icon={IconGrimoire}
              label={t('dashboard.loreEntries', locale)}
              value={stats.lore}
              href="/lore"
              addHref="/lore/new"
            />
            <StatCard
              icon={IconAncientScroll}
              label={t('thoughts.title', locale)}
              value={stats.thoughts}
              href="/thoughts"
              addHref="/thoughts/new"
            />
          </div>
          
          {/* Concept Arts Block */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-3 sm:mb-4 flex-shrink-0">
              <h2 className="text-base sm:text-lg font-semibold text-white">{t('dashboard.conceptArts', locale)}</h2>
              <Link href="/concept-art" className="text-sm text-white/50 hover:text-white transition-colors">
                {locale === 'ru' ? 'Все' : 'View all'} →
              </Link>
            </div>
            <div className="glass-card p-3 sm:p-5 flex-1 min-h-0 overflow-hidden">
              {stats.recentConceptArts.length === 0 ? (
                <div className="h-full min-h-[120px] flex flex-col items-center justify-center">
                  <IconMysticBrush size={32} strokeWidth={1.5} className="text-white/20 mb-3" />
                  <p className="text-white/40">{locale === 'ru' ? 'Нет концепт-артов' : 'No concept arts'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:h-full">
                  {stats.recentConceptArts.slice(0, 6).map(art => (
                    <Link key={art.id} href={`/concept-art/${art.id}`} className="block min-h-0">
                      <div className="group relative aspect-square lg:aspect-auto lg:h-full rounded-xl overflow-hidden bg-white/5">
                        {art.thumbnailUrl || art.imageUrl ? (
                          <Image
                            src={art.thumbnailUrl || art.imageUrl || ''}
                            alt={art.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <IconMysticBrush size={24} strokeWidth={1.5} className="text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-xs text-white font-medium truncate">{art.title}</p>
                            {art.entity && (
                              <p className="text-[10px] text-white/60 truncate">{art.entity.name}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column: Recent Activity with scroll */}
        <div className="w-full lg:w-[380px] flex flex-col min-h-0 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex-shrink-0">{t('dashboard.recentActivity', locale)}</h2>
          <div className="glass-card p-3 sm:p-4 flex-1 min-h-0 overflow-hidden">
            {stats.recentActivity.length === 0 ? (
              <p className="text-white/40 text-center py-8">{t('dashboard.noActivity', locale)}</p>
            ) : (
              <div className="max-h-[300px] lg:max-h-none lg:h-full overflow-y-auto custom-scrollbar pr-2 space-y-1">
                {stats.recentActivity.map(activity => (
                  <ActivityRow key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, href, addHref }: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  value: number
  href: string
  addHref: string
}) {
  return (
    <div className="stat-card relative group p-4 sm:p-6">
      <Link href={href} className="block">
        <div className="mb-2 sm:mb-3">
          <Icon size={24} strokeWidth={1.5} className="text-white/50 sm:w-7 sm:h-7" />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{value}</p>
        <p className="text-xs sm:text-sm text-white/50 line-clamp-1">{label}</p>
      </Link>
      
      {/* Add Button */}
      <Link 
        href={addHref}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110"
        title="Add new"
      >
        <Plus size={16} strokeWidth={1.5} className="text-white/70" />
      </Link>
    </div>
  )
}

function ActivityRow({ activity }: { activity: Activity }) {
  // Determine the link based on metadata or description
  const getActivityLink = (): string | null => {
    // First try metadata for direct link
    if (activity.metadata) {
      const itemType = activity.metadata.itemType as string | undefined
      const itemId = activity.metadata.itemId as string | undefined
      
      if (itemType && itemId && !itemId.includes('-list')) {
        switch (itemType) {
          case 'entity': return `/entities/${itemId}`
          case 'conceptArt': return `/concept-art/${itemId}`
          case 'lore': return `/lore/${itemId}`
          case 'thought': return `/thoughts/${itemId}`
        }
      }
      
      // If itemId is a list reference, go to the section
      if (itemType && itemId?.includes('-list')) {
        switch (itemType) {
          case 'conceptArt': return '/concept-art'
          case 'lore': return '/lore'
          case 'thought': return '/thoughts'
        }
      }
    }
    
    // Fallback: parse description
    const desc = activity.description.toLowerCase()
    
    // Check for concept art
    if (desc.includes('концепт-арт') || desc.includes('concept art') || desc.includes('concept-art')) {
      return '/concept-art'
    }
    
    // Check for lore
    if (desc.includes('лор') || desc.includes('lore')) {
      return '/lore'
    }
    
    // Check for thoughts
    if (desc.includes('мысл') || desc.includes('thought') || desc.includes('комментарий')) {
      return '/thoughts'
    }
    
    // Check for entity
    if (activity.entity) {
      return `/entities/${activity.entity.id}`
    }
    
    // Default based on description
    if (desc.includes('объект') || desc.includes('entity')) {
      return '/entities'
    }
    
    return null
  }
  
  const link = getActivityLink()
  
  const content = (
    <div className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl transition-colors hover:bg-white/5">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
        <ActivityIcon type={activity.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-base text-white/80 line-clamp-2">{activity.description}</p>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs text-white/40">
          {activity.user && <span>{activity.user.name}</span>}
          {activity.entity && (
            <>
              <span>•</span>
              <span className="text-[#A89C6A] truncate max-w-[100px] sm:max-w-none">{activity.entity.name}</span>
            </>
          )}
          <span>•</span>
          <RelativeTime date={activity.createdAt} />
        </div>
      </div>
    </div>
  )
  
  if (link) {
    return <Link href={link} className="block">{content}</Link>
  }
  
  return content
}

function ActivityIcon({ type }: { type: string }) {
  const iconProps = { size: 14, strokeWidth: 1.5, className: 'text-white/60' }
  
  switch (type) {
    case 'CREATED': return <IconSparkle {...iconProps} />
    case 'UPDATED': return <IconQuill {...iconProps} />
    case 'STATUS_CHANGED': return <IconStatusChange {...iconProps} />
    case 'COMMENTED': return <IconComment {...iconProps} />
    case 'DELETED': return <IconTrash {...iconProps} />
    case 'GITHUB_PUSH': return <IconGitBranch {...iconProps} />
    default: return <IconSparkle {...iconProps} />
  }
}

