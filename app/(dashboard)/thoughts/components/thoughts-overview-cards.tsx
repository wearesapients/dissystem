/**
 * Thoughts Overview Cards - Entity type-based cards with recent items
 */

'use client'

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { 
  Crown, Swords, Castle, Sparkles, Gem, MapPin, HelpCircle,
  ArrowRight, Plus, Lightbulb
} from 'lucide-react'

type RecentThought = {
  id: string
  title: string
  updatedAt: Date
}

interface ThoughtsOverviewCardsProps {
  statsByType: Record<string, number>
  recentByType: Record<string, RecentThought[]>
  unlinkedCount: number
  recentUnlinked: RecentThought[]
}

export function ThoughtsOverviewCards({ 
  statsByType, 
  recentByType,
  unlinkedCount,
  recentUnlinked 
}: ThoughtsOverviewCardsProps) {
  const { locale } = useLocale()
  
  const entityTypes = [
    { 
      type: 'HERO', 
      icon: Crown, 
      labelRu: 'Герои', 
      labelEn: 'Heroes',
      descRu: 'Мысли о ключевых персонажах',
      descEn: 'Thoughts about key characters',
      color: 'from-[#3E2F45]/20 to-[#3E2F45]/5',
      iconColor: '#8A6A9A',
    },
    { 
      type: 'UNIT', 
      icon: Swords, 
      labelRu: 'Юниты', 
      labelEn: 'Units',
      descRu: 'Мысли о боевых единицах',
      descEn: 'Thoughts about combat units',
      color: 'from-[#5F646B]/20 to-[#5F646B]/5',
      iconColor: '#A8ABB0',
    },
    { 
      type: 'FACTION', 
      icon: Castle, 
      labelRu: 'Фракции', 
      labelEn: 'Factions',
      descRu: 'Мысли о расах и группировках',
      descEn: 'Thoughts about races and groups',
      color: 'from-[#A89C6A]/20 to-[#A89C6A]/5',
      iconColor: '#A89C6A',
    },
    { 
      type: 'SPELL', 
      icon: Sparkles, 
      labelRu: 'Заклинания', 
      labelEn: 'Spells',
      descRu: 'Мысли о магии и способностях',
      descEn: 'Thoughts about magic and abilities',
      color: 'from-[#3B4F52]/20 to-[#3B4F52]/5',
      iconColor: '#6B8F94',
    },
    { 
      type: 'ARTIFACT', 
      icon: Gem, 
      labelRu: 'Артефакты', 
      labelEn: 'Artifacts',
      descRu: 'Мысли о предметах и экипировке',
      descEn: 'Thoughts about items and equipment',
      color: 'from-[#A89C6A]/25 to-[#A89C6A]/10',
      iconColor: '#C7B97A',
    },
    { 
      type: 'LOCATION', 
      icon: MapPin, 
      labelRu: 'Локации', 
      labelEn: 'Locations',
      descRu: 'Мысли о местах и территориях',
      descEn: 'Thoughts about places and territories',
      color: 'from-[#4F5A3C]/20 to-[#4F5A3C]/5',
      iconColor: '#7A8A5C',
    },
  ]
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {entityTypes.map(({ type, icon: Icon, labelRu, labelEn, descRu, descEn, color, iconColor }) => {
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
                href={`/thoughts/new?entityType=${type}`}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
                title={locale === 'ru' ? 'Создать' : 'Create'}
              >
                <Plus size={16} strokeWidth={1.5} className="text-white/40 sm:w-[18px] sm:h-[18px]" />
              </Link>
            </div>
            
            {/* Description */}
            <p className="text-sm text-white/50 mb-4">{desc}</p>
            
            {/* Recent items */}
            {recent.length > 0 ? (
              <div className="space-y-2 mb-4">
                {recent.map(thought => (
                  <Link 
                    key={thought.id}
                    href={`/thoughts/${thought.id}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm text-white truncate flex items-center gap-2">
                      <Lightbulb size={12} strokeWidth={1.5} className="text-white/40 flex-shrink-0" />
                      {thought.title}
                    </span>
                    <span className="text-xs text-white/30 flex-shrink-0 ml-2">{formatRelativeTime(thought.updatedAt)}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-white/30 mb-4">
                {locale === 'ru' ? 'Нет записей' : 'No entries'}
              </div>
            )}
            
            {/* View all link */}
            <Link 
              href={`/thoughts?entityType=${type}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
            >
              {locale === 'ru' ? 'Смотреть все' : 'View all'}
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        )
      })}
      
      {/* Other / Unlinked card */}
      <div className="glass-card p-4 sm:p-6 bg-gradient-to-br from-[#6A665E]/15 to-[#6A665E]/5 border border-white/5">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#6A665E]/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle size={20} strokeWidth={1.5} className="text-[#9C9688] sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                {locale === 'ru' ? 'Другое' : 'Other'}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-white">{unlinkedCount}</p>
            </div>
          </div>
          <Link 
            href="/thoughts/new"
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Plus size={16} strokeWidth={1.5} className="text-white/40 sm:w-[18px] sm:h-[18px]" />
          </Link>
        </div>
        
        <p className="text-sm text-white/50 mb-4">
          {locale === 'ru' ? 'Мысли без привязки к сущности' : 'Thoughts without entity link'}
        </p>
        
        {recentUnlinked.length > 0 ? (
          <div className="space-y-2 mb-4">
            {recentUnlinked.map(thought => (
              <Link 
                key={thought.id}
                href={`/thoughts/${thought.id}`}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="text-sm text-white truncate flex items-center gap-2">
                  <Lightbulb size={12} strokeWidth={1.5} className="text-white/40 flex-shrink-0" />
                  {thought.title}
                </span>
                <span className="text-xs text-white/30 flex-shrink-0 ml-2">{formatRelativeTime(thought.updatedAt)}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-sm text-white/30 mb-4">
            {locale === 'ru' ? 'Нет записей' : 'No entries'}
          </div>
        )}
        
        <Link 
          href="/thoughts?unlinked=true"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
        >
          {locale === 'ru' ? 'Смотреть все' : 'View all'}
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  )
}

