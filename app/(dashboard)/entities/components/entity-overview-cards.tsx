/**
 * Entity Overview Cards - Localized grid of entity type cards
 */

'use client'

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { 
  Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, Swords,
  ArrowRight, Plus
} from 'lucide-react'

type RecentEntity = {
  id: string
  name: string
  code: string
  type: string
  updatedAt: Date
}

interface EntityOverviewCardsProps {
  stats: Record<string, number>
  recentByType: Record<string, RecentEntity[]>
}

export function EntityOverviewCards({ stats, recentByType }: EntityOverviewCardsProps) {
  const { locale } = useLocale()
  
  const entityTypes = [
    { 
      type: 'HERO', 
      icon: Crown, 
      labelRu: 'Герои', 
      labelEn: 'Heroes',
      descRu: 'Ключевые персонажи игрового мира',
      descEn: 'Key characters of the game world',
      color: 'from-[#3E2F45]/20 to-[#3E2F45]/5',
      iconColor: '#8A6A9A',
    },
    { 
      type: 'UNIT', 
      icon: Swords, 
      labelRu: 'Юниты', 
      labelEn: 'Units',
      descRu: 'Боевые единицы с характеристиками',
      descEn: 'Combat units with stats',
      color: 'from-[#5F646B]/20 to-[#5F646B]/5',
      iconColor: '#A8ABB0',
    },
    { 
      type: 'FACTION', 
      icon: Castle, 
      labelRu: 'Фракции', 
      labelEn: 'Factions',
      descRu: 'Игровые расы и группировки',
      descEn: 'Game races and groups',
      color: 'from-[#A89C6A]/20 to-[#A89C6A]/5',
      iconColor: '#A89C6A',
    },
    { 
      type: 'SPELL', 
      icon: Sparkles, 
      labelRu: 'Заклинания', 
      labelEn: 'Spells',
      descRu: 'Магические способности и эффекты',
      descEn: 'Magical abilities and effects',
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
      descRu: 'Места и территории игрового мира',
      descEn: 'Places and territories of the game world',
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
      descRu: 'Прочие сущности',
      descEn: 'Miscellaneous entities',
      color: 'from-[#5F646B]/15 to-[#5F646B]/5',
      iconColor: '#8A8F96',
    },
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entityTypes.map(({ type, icon: Icon, labelRu, labelEn, descRu, descEn, color, iconColor }) => {
        const count = stats[type] || 0
        const recent = recentByType[type] || []
        const label = locale === 'ru' ? labelRu : labelEn
        const desc = locale === 'ru' ? descRu : descEn
        
        // Units have their own dedicated page
        const isUnit = type === 'UNIT'
        const viewAllHref = isUnit ? '/units' : `/entities?type=${type}`
        const createHref = `/entities/new?type=${type}`
        const itemHref = (id: string) => `/entities/${id}`
        
        const displayItems = recent
        
        return (
          <div 
            key={type}
            className={`glass-card p-6 bg-gradient-to-br ${color} border border-white/5`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${iconColor}15` }}
                >
                  <Icon size={24} strokeWidth={1.5} style={{ color: iconColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{label}</h3>
                  <p className="text-2xl font-bold text-white">{count}</p>
                </div>
              </div>
              <Link 
                href={createHref}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title={locale === 'ru' ? 'Создать' : 'Create'}
              >
                <Plus size={18} strokeWidth={1.5} className="text-white/40" />
              </Link>
            </div>
            
            {/* Description */}
            <p className="text-sm text-white/50 mb-4">{desc}</p>
            
            {/* Recent items */}
            {displayItems.length > 0 ? (
              <div className="space-y-2 mb-4">
                {displayItems.map(item => (
                  <Link 
                    key={item.id}
                    href={itemHref(item.id)}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm text-white truncate">{item.name}</span>
                    <span className="text-xs text-white/30">{formatRelativeTime(item.updatedAt)}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-white/30 mb-4">
                {locale === 'ru' ? 'Нет сущностей' : 'No entities'}
              </div>
            )}
            
            {/* View all link */}
            <Link 
              href={viewAllHref}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-medium transition-all"
            >
              {locale === 'ru' ? 'Смотреть все' : 'View all'}
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
