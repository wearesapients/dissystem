/**
 * Concept Art Overview Cards - Entity type categories with recent items
 */

'use client'

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { 
  Crown, Swords, Castle, Sparkles, Gem, MapPin, Box, HelpCircle,
  ArrowRight, Plus, ImageIcon
} from 'lucide-react'

type RecentArt = {
  id: string
  title: string
  updatedAt: Date
  thumbnailUrl?: string | null
}

interface ConceptArtOverviewCardsProps {
  statsByType: Record<string, number>
  recentByType: Record<string, RecentArt[]>
  unlinkedCount: number
  recentUnlinked: RecentArt[]
}

export function ConceptArtOverviewCards({ 
  statsByType, 
  recentByType, 
  unlinkedCount,
  recentUnlinked 
}: ConceptArtOverviewCardsProps) {
  const { locale } = useLocale()
  
  const entityTypeCards = [
    { 
      type: 'HERO', 
      icon: Crown, 
      labelRu: 'Герои', 
      labelEn: 'Heroes',
      descRu: 'Арты ключевых персонажей',
      descEn: 'Key character artwork',
      color: 'from-[#3E2F45]/20 to-[#3E2F45]/5',
      iconColor: '#8A6A9A',
    },
    { 
      type: 'UNIT', 
      icon: Swords, 
      labelRu: 'Юниты', 
      labelEn: 'Units',
      descRu: 'Арты боевых единиц',
      descEn: 'Combat unit artwork',
      color: 'from-[#5F646B]/20 to-[#5F646B]/5',
      iconColor: '#A8ABB0',
    },
    { 
      type: 'FACTION', 
      icon: Castle, 
      labelRu: 'Фракции', 
      labelEn: 'Factions',
      descRu: 'Символика и стилистика фракций',
      descEn: 'Faction symbols and style',
      color: 'from-[#A89C6A]/20 to-[#A89C6A]/5',
      iconColor: '#A89C6A',
    },
    { 
      type: 'SPELL', 
      icon: Sparkles, 
      labelRu: 'Заклинания', 
      labelEn: 'Spells',
      descRu: 'Визуальные эффекты магии',
      descEn: 'Magic visual effects',
      color: 'from-[#3B4F52]/20 to-[#3B4F52]/5',
      iconColor: '#6B8F94',
    },
    { 
      type: 'ARTIFACT', 
      icon: Gem, 
      labelRu: 'Артефакты', 
      labelEn: 'Artifacts',
      descRu: 'Предметы и экипировка',
      descEn: 'Items and equipment',
      color: 'from-[#A89C6A]/25 to-[#A89C6A]/10',
      iconColor: '#C7B97A',
    },
    { 
      type: 'LOCATION', 
      icon: MapPin, 
      labelRu: 'Локации', 
      labelEn: 'Locations',
      descRu: 'Окружение и ландшафты',
      descEn: 'Environments and landscapes',
      color: 'from-[#4F5A3C]/20 to-[#4F5A3C]/5',
      iconColor: '#7A8A5C',
    },
    { 
      type: 'OBJECT', 
      icon: Box, 
      labelRu: 'Объекты', 
      labelEn: 'Objects',
      descRu: 'Интерактивные объекты мира',
      descEn: 'Interactive world objects',
      color: 'from-[#6A665E]/20 to-[#6A665E]/5',
      iconColor: '#9C9688',
    },
    { 
      type: 'OTHER', 
      icon: HelpCircle, 
      labelRu: 'Другое', 
      labelEn: 'Other',
      descRu: 'Прочие концепты',
      descEn: 'Miscellaneous concepts',
      color: 'from-[#5F646B]/15 to-[#5F646B]/5',
      iconColor: '#8A8F96',
    },
  ]
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {entityTypeCards.map(({ type, icon: Icon, labelRu, labelEn, descRu, descEn, color, iconColor }) => {
          const count = statsByType[type] || 0
          const recent = recentByType[type] || []
          const label = locale === 'ru' ? labelRu : labelEn
          const desc = locale === 'ru' ? descRu : descEn
          
          return (
            <div 
              key={type}
              className={`glass-card p-4 sm:p-6 bg-gradient-to-br ${color} border border-white/5`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${iconColor}15` }}
                  >
                    <Icon size={20} strokeWidth={1.5} style={{ color: iconColor }} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">{label}</h3>
                    <p className="text-xl sm:text-2xl font-bold text-white">{count}</p>
                  </div>
                </div>
                <Link 
                  href={`/concept-art/new?entityType=${type}`}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title={locale === 'ru' ? 'Загрузить' : 'Upload'}
                >
                  <Plus size={16} strokeWidth={1.5} className="text-white/40 sm:w-[18px] sm:h-[18px]" />
                </Link>
              </div>
              
              {/* Description */}
              <p className="text-sm text-white/50 mb-4">{desc}</p>
              
              {/* Recent items with thumbnails */}
              {recent.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {recent.map(art => (
                    <Link 
                      key={art.id}
                      href={`/concept-art/${art.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {art.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={art.thumbnailUrl} 
                          alt="" 
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                          <ImageIcon size={14} className="text-white/30" />
                        </div>
                      )}
                      <span className="text-sm text-white truncate flex-1">{art.title}</span>
                      <span className="text-xs text-white/30 flex-shrink-0">{formatRelativeTime(art.updatedAt)}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-white/30 mb-4">
                  {locale === 'ru' ? 'Нет работ' : 'No works'}
                </div>
              )}
              
              {/* View all link */}
              <Link 
                href={`/concept-art?entityType=${type}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
              >
                {locale === 'ru' ? 'Смотреть все' : 'View all'}
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          )
        })}
      </div>
      
      {/* Unlinked arts section */}
      {unlinkedCount > 0 && (
        <div className="mt-4 sm:mt-6 glass-card p-4 sm:p-6 bg-gradient-to-r from-[#5F646B]/10 to-transparent border border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#5F646B]/20 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={20} strokeWidth={1.5} className="text-[#9C9688] sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {locale === 'ru' ? 'Без привязки' : 'Unlinked'}
                </h3>
                <p className="text-sm text-white/50">
                  {unlinkedCount} {locale === 'ru' ? 'работ без объекта' : 'works without entity'}
                </p>
              </div>
            </div>
            <Link 
              href="/concept-art?unlinked=true"
              className="btn btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {locale === 'ru' ? 'Показать' : 'View'}
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
          
          {/* Recent unlinked */}
          {recentUnlinked.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {recentUnlinked.map(art => (
                <Link 
                  key={art.id}
                  href={`/concept-art/${art.id}`}
                  className="flex-shrink-0"
                >
                  {art.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={art.thumbnailUrl} 
                      alt={art.title}
                      className="w-16 h-16 rounded-lg object-cover hover:ring-2 hover:ring-white/20 transition-all"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center">
                      <ImageIcon size={20} className="text-white/30" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

