/**
 * Entity Type Cards - Localized client component
 */

'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/locale-context'
import { t, getEntityTypePluralLabel } from '@/lib/i18n'
import { 
  Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, LayoutGrid,
  LucideIcon
} from 'lucide-react'

interface EntityTypeCardsProps {
  stats: Record<string, number>
  total: number
  currentType?: string
}

const typeIcons: Record<string, LucideIcon> = {
  HERO: Crown,
  UNIT: Swords,
  FACTION: Castle,
  SPELL: Sparkles,
  ARTIFACT: Gem,
  LOCATION: MapPin,
  OBJECT: Box,
  OTHER: HelpCircle,
}

const typeColors: Record<string, { bg: string; activeBg: string; text: string }> = {
  HERO: { bg: 'from-[#3E2F45]/15 to-[#3E2F45]/5', activeBg: 'from-[#3E2F45]/35 to-[#3E2F45]/20', text: '#8A6A9A' },
  UNIT: { bg: 'from-[#5F646B]/15 to-[#5F646B]/5', activeBg: 'from-[#5F646B]/35 to-[#5F646B]/20', text: '#A8ABB0' },
  FACTION: { bg: 'from-[#A89C6A]/15 to-[#A89C6A]/5', activeBg: 'from-[#A89C6A]/35 to-[#A89C6A]/20', text: '#A89C6A' },
  SPELL: { bg: 'from-[#3B4F52]/15 to-[#3B4F52]/5', activeBg: 'from-[#3B4F52]/35 to-[#3B4F52]/20', text: '#6B8F94' },
  ARTIFACT: { bg: 'from-[#A89C6A]/20 to-[#A89C6A]/10', activeBg: 'from-[#A89C6A]/40 to-[#A89C6A]/25', text: '#C7B97A' },
  LOCATION: { bg: 'from-[#4F5A3C]/15 to-[#4F5A3C]/5', activeBg: 'from-[#4F5A3C]/35 to-[#4F5A3C]/20', text: '#7A8A5C' },
  OBJECT: { bg: 'from-[#6A665E]/15 to-[#6A665E]/5', activeBg: 'from-[#6A665E]/35 to-[#6A665E]/20', text: '#9C9688' },
  OTHER: { bg: 'from-[#5F646B]/10 to-[#5F646B]/5', activeBg: 'from-[#5F646B]/30 to-[#5F646B]/20', text: '#8A8F96' },
}

export function EntityTypeCards({ stats, total, currentType }: EntityTypeCardsProps) {
  const { locale } = useLocale()
  
  const types = ['HERO', 'UNIT', 'FACTION', 'SPELL', 'ARTIFACT', 'LOCATION', 'OBJECT', 'OTHER']
  
  return (
    <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap overflow-x-auto pb-2 -mx-1 px-1">
      {/* All */}
      <Link 
        href="/entities"
        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-br transition-all hover:scale-[1.02] flex-shrink-0 ${
          !currentType 
            ? 'from-white/20 to-white/10 ring-2 ring-offset-2 ring-offset-[#0B0B0C] ring-white/50'
            : 'from-white/10 to-white/5'
        }`}
      >
        <LayoutGrid size={16} strokeWidth={1.5} className="text-white/70 sm:w-[18px] sm:h-[18px]" />
        <span className="font-semibold text-white text-sm sm:text-base">{total}</span>
        <span className="text-xs sm:text-sm text-white/60">{t('common.all', locale)}</span>
      </Link>
      
      {/* Type cards */}
      {types.map(type => {
        const count = stats[type] || 0
        if (count === 0) return null
        
        const Icon = typeIcons[type] || Swords
        const color = typeColors[type] || typeColors.UNIT
        const isActive = currentType === type
        
        return (
          <Link 
            key={type}
            href={isActive ? '/entities' : `/entities?type=${type}`}
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-br transition-all hover:scale-[1.02] flex-shrink-0 ${
              isActive 
                ? `${color.activeBg} ring-2 ring-offset-2 ring-offset-[#0B0B0C]`
                : color.bg
            }`}
            style={{ ['--tw-ring-color' as string]: color.text }}
          >
            <Icon size={16} strokeWidth={1.5} style={{ color: color.text }} className="sm:w-[18px] sm:h-[18px]" />
            <span className="font-semibold text-white text-sm sm:text-base">{count}</span>
            <span className="text-xs sm:text-sm text-white/60 whitespace-nowrap">{getEntityTypePluralLabel(type, locale)}</span>
          </Link>
        )
      })}
    </div>
  )
}


