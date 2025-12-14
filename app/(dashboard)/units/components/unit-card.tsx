/**
 * Unit Card Component
 * Shows GameEntity with type=UNIT and optional Unit stats
 */

'use client'

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { Heart, Shield, Zap, Target, Swords, Crosshair, Wand2, HeartHandshake, Palette, BookOpen, Lightbulb, User } from 'lucide-react'
import { cn } from '@/lib/utils'

type UnitEntity = {
  id: string
  code: string
  name: string
  description: string | null
  createdBy: {
    id: string
    name: string
  }
  unitProfile?: {
    id: string
    role: string
    level: number
    hpMax: number
    armor: number
    faction: {
      id: string
      name: string
      code: string
    }
    attacks: {
      id: string
      name: string
      damage: number | null
      heal: number | null
      initiative: number
    }[]
  } | null
  _count: {
    conceptArts: number
    loreEntries: number
    thoughts: number
  }
  updatedAt: Date
}

interface UnitCardProps {
  unit: UnitEntity
}

const roleConfig = {
  MELEE: { icon: Swords, color: 'text-[#9A4A4A]', bg: 'from-[#5A1E1E]/20 to-[#2A2A2D]/20', border: 'border-[#5A1E1E]/30' },
  RANGED: { icon: Crosshair, color: 'text-[#7A8A5C]', bg: 'from-[#4F5A3C]/20 to-[#2A2A2D]/20', border: 'border-[#4F5A3C]/30' },
  MAGE: { icon: Wand2, color: 'text-[#6B8F94]', bg: 'from-[#3B4F52]/20 to-[#2A2A2D]/20', border: 'border-[#3B4F52]/30' },
  SUPPORT: { icon: HeartHandshake, color: 'text-[#A89C6A]', bg: 'from-[#A89C6A]/20 to-[#2A2A2D]/20', border: 'border-[#A89C6A]/30' },
}

export function UnitCard({ unit }: UnitCardProps) {
  const { locale } = useLocale()
  const profile = unit.unitProfile
  const config = profile ? (roleConfig[profile.role as keyof typeof roleConfig] || roleConfig.MELEE) : roleConfig.MELEE
  const RoleIcon = config.icon
  const primaryAttack = profile?.attacks[0]
  
  return (
    <Link href={`/entities/${unit.id}`}>
      <div className="glass-card p-5 h-full hover:bg-white/[0.08] transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center',
            config.bg
          )}>
            <RoleIcon size={22} strokeWidth={1.5} className={config.color} />
          </div>
          {profile && (
            <div className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-medium border',
              config.bg,
              config.border,
              config.color
            )}>
              {t(`units.role${profile.role.charAt(0) + profile.role.slice(1).toLowerCase()}`, locale)}
            </div>
          )}
        </div>
        
        {/* Name & Faction */}
        <h3 className="text-lg font-semibold text-white mb-1">{unit.name}</h3>
        <p className="text-sm text-white/40 mb-4">
          {profile?.faction.name || unit.code}
        </p>
        
        {/* Stats Grid - only if has profile */}
        {profile && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-xs">
              <Heart size={13} className="text-[#9A4A4A]" strokeWidth={1.5} />
              <span className="text-white/60">{profile.hpMax}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Shield size={13} className="text-[#6B8F94]" strokeWidth={1.5} />
              <span className="text-white/60">{profile.armor}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Zap size={13} className="text-[#A89C6A]" strokeWidth={1.5} />
              <span className="text-white/60">Lv.{profile.level}</span>
            </div>
          </div>
        )}
        
        {/* Primary Attack - only if has profile */}
        {primaryAttack && (
          <div className="p-3 rounded-lg bg-white/5 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40">{primaryAttack.name}</span>
              <span className="text-white/60 flex items-center gap-1">
                <Target size={11} strokeWidth={1.5} />
                {primaryAttack.damage || primaryAttack.heal}
              </span>
            </div>
          </div>
        )}
        
        {/* No stats hint */}
        {!profile && (
          <div className="p-3 rounded-lg bg-white/5 mb-4 text-center">
            <p className="text-xs text-white/30">
              {locale === 'ru' ? 'Статистика не задана' : 'No stats configured'}
            </p>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-white/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title={locale === 'ru' ? 'Концепт-арты' : 'Concept Arts'}>
              <Palette size={12} strokeWidth={1.5} />
              {unit._count.conceptArts}
            </span>
            <span className="flex items-center gap-1" title={locale === 'ru' ? 'Лор' : 'Lore'}>
              <BookOpen size={12} strokeWidth={1.5} />
              {unit._count.loreEntries}
            </span>
            <span className="flex items-center gap-1" title={locale === 'ru' ? 'Мысли' : 'Thoughts'}>
              <Lightbulb size={12} strokeWidth={1.5} />
              {unit._count.thoughts}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <User size={11} strokeWidth={1.5} />
            {unit.createdBy.name}
          </span>
        </div>
      </div>
    </Link>
  )
}


