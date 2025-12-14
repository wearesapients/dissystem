/**
 * Entity Tabs Component
 * Tabs for related content blocks (Concept Arts, Lore, Thoughts, Unit Stats)
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { Palette, BookOpen, Lightbulb, Activity, Plus, Swords, Shield, Heart, Zap, Target } from 'lucide-react'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { t, getStatusLabel } from '@/lib/i18n'

type TabType = 'stats' | 'concepts' | 'lore' | 'thoughts' | 'activity'

interface ConceptArt {
  id: string
  title: string
  status: string
  imageUrl: string
  thumbnailUrl: string | null
  createdAt: Date
}

interface LoreEntry {
  id: string
  title: string
  status: string
  version: number
  createdAt: Date
}

interface Thought {
  id: string
  title: string
  status: string
  color: string | null
  createdBy: { name: string }
  createdAt: Date
}

interface Attack {
  id: string
  name: string
  hitChance: number
  damage: number | null
  heal: number | null
  damageSource: string
  initiative: number
  reach: string
  targets: number
}

interface UnitProfile {
  id: string
  name: string
  role: string
  level: number
  xpCurrent: number
  xpToNext: number
  hpMax: number
  armor: number
  immunities: unknown
  wards: unknown
  hpRegenPercent: number
  xpOnKill: number
  description: string | null
  attacks: Attack[]
  faction: { id: string; name: string; code: string } | null
  prevEvolution: { id: string; name: string; code: string; type: string } | null
  nextEvolutionIds: string[]
}

interface EntityTabsProps {
  entityId: string
  entityName: string
  entityType: string
  conceptArts: ConceptArt[]
  loreEntries: LoreEntry[]
  thoughts: Thought[]
  unitProfile: UnitProfile | null
  counts: {
    conceptArts: number
    loreEntries: number
    thoughts: number
  }
}

export function EntityTabs({ entityId, entityName, entityType, conceptArts, loreEntries, thoughts, unitProfile, counts }: EntityTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useLocale()
  
  // Heroes and Units both have stats
  const hasStats = entityType === 'UNIT' || entityType === 'HERO'
  
  // Default to 'stats' tab for UNIT/HERO entities, otherwise 'concepts'
  const defaultTab = hasStats ? 'stats' : 'concepts'
  const activeTab = (searchParams.get('tab') as TabType) || defaultTab
  
  // Build tabs array - include 'stats' for UNIT and HERO entities
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
    ...(hasStats ? [{ id: 'stats' as TabType, label: t('entityTabs.stats', locale), icon: Swords }] : []),
    { id: 'concepts', label: t('entityTabs.conceptArts', locale), icon: Palette },
    { id: 'lore', label: t('entityTabs.lore', locale), icon: BookOpen },
    { id: 'thoughts', label: t('entityTabs.thoughts', locale), icon: Lightbulb },
    { id: 'activity', label: t('entityTabs.activity', locale), icon: Activity },
  ]
  
  const handleTabChange = (tab: TabType) => {
    router.push(`/entities/${entityId}?tab=${tab}`, { scroll: false })
  }
  
  const getCount = (tab: TabType): number => {
    switch (tab) {
      case 'stats': return unitProfile ? unitProfile.attacks.length : 0
      case 'concepts': return counts.conceptArts
      case 'lore': return counts.loreEntries
      case 'thoughts': return counts.thoughts
      case 'activity': return 0
    }
  }
  
  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-white/10 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          const count = getCount(id)
          
          return (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                isActive
                  ? 'border-[#A89C6A] text-white'
                  : 'border-transparent text-white/50 hover:text-white/70'
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span className="font-medium">{label}</span>
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#A89C6A]/20 text-[#A89C6A]' : 'bg-white/10 text-white/50'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'stats' && hasStats && (
          <UnitStatsTabContent
            entityId={entityId}
            entityType={entityType}
            unitProfile={unitProfile}
            locale={locale}
          />
        )}
        
        {activeTab === 'concepts' && (
          <ConceptsTabContent
            entityId={entityId}
            entityName={entityName}
            items={conceptArts}
            locale={locale}
          />
        )}
        
        {activeTab === 'lore' && (
          <TabContent
            items={loreEntries}
            emptyMessage={t('entityTabs.noLoreEntries', locale)}
            addLabel={t('entityTabs.addLore', locale)}
            addHref={`/lore/new?entityId=${entityId}&entityName=${encodeURIComponent(entityName)}`}
            renderItem={(lore) => (
              <Link 
                key={lore.id} 
                href={`/lore/${lore.id}?fromEntity=${entityId}&entityName=${encodeURIComponent(entityName)}`}
              >
                <div className="glass-card p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                  <h4 className="font-medium text-white line-clamp-1 flex-1">{lore.title}</h4>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <StatusBadge status={lore.status} />
                    <span className="text-xs text-white/40">v{lore.version}</span>
                  </div>
                </div>
              </Link>
            )}
          />
        )}
        
        {activeTab === 'thoughts' && (
          <TabContent
            items={thoughts}
            emptyMessage={t('entityTabs.noThoughts', locale)}
            addLabel={t('entityTabs.addThought', locale)}
            addHref={`/thoughts/new?entityId=${entityId}&entityName=${encodeURIComponent(entityName)}`}
            renderItem={(thought) => (
              <Link 
                key={thought.id} 
                href={`/thoughts/${thought.id}?fromEntity=${entityId}&entityName=${encodeURIComponent(entityName)}`}
              >
                <div 
                  className="glass-card p-4 hover:bg-white/5 transition-colors flex items-center justify-between"
                  style={{ borderLeftWidth: 3, borderLeftColor: thought.color || '#6A665E' }}
                >
                  <h4 className="font-medium text-white line-clamp-1 flex-1">{thought.title}</h4>
                  <div className="flex items-center gap-3 ml-4 flex-shrink-0 text-xs">
                    <span className={`status-${thought.status.toLowerCase()} px-2 py-0.5 rounded border`}>
                      {getStatusLabel(thought.status, locale)}
                    </span>
                    <span className="text-white/40">{thought.createdBy.name}</span>
                  </div>
                </div>
              </Link>
            )}
          />
        )}
        
        {activeTab === 'activity' && (
          <div className="glass-card p-8 text-center">
            <Activity size={32} strokeWidth={1.5} className="text-white/30 mx-auto mb-3" />
            <p className="text-white/50">{t('entityTabs.activitySoon', locale)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface TabContentProps<T> {
  items: T[]
  emptyMessage: string
  addLabel: string
  addHref: string
  renderItem: (item: T) => React.ReactNode
}

function TabContent<T extends { id: string }>({ items, emptyMessage, addLabel, addHref, renderItem }: TabContentProps<T>) {
  if (items.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-white/50 mb-4">{emptyMessage}</p>
        <Link href={addHref} className="btn btn-secondary inline-flex items-center gap-2">
          <Plus size={16} strokeWidth={1.5} />
          {addLabel}
        </Link>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href={addHref} className="btn btn-secondary text-sm inline-flex items-center gap-2">
          <Plus size={14} strokeWidth={1.5} />
          {addLabel}
        </Link>
      </div>
      <div className="space-y-3">
        {items.map(renderItem)}
      </div>
    </div>
  )
}

// Special component for Concepts tab with batch upload
interface ConceptsTabContentProps {
  entityId: string
  entityName: string
  items: ConceptArt[]
  locale: 'ru' | 'en'
}

function ConceptsTabContent({ entityId, entityName, items, locale }: ConceptsTabContentProps) {
  if (items.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-white/50 mb-4">{t('entityTabs.noConceptArts', locale)}</p>
        <Link 
          href={`/concept-art/new?entityId=${entityId}&entityName=${encodeURIComponent(entityName)}`} 
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <Plus size={16} strokeWidth={1.5} />
          {t('entityTabs.addConcept', locale)}
        </Link>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link 
          href={`/concept-art/new?entityId=${entityId}&entityName=${encodeURIComponent(entityName)}`} 
          className="btn btn-secondary text-sm inline-flex items-center gap-2"
        >
          <Plus size={14} strokeWidth={1.5} />
          {t('entityTabs.addConcept', locale)}
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((art) => (
          <Link 
            key={art.id} 
            href={`/concept-art/${art.id}?fromEntity=${entityId}&entityName=${encodeURIComponent(entityName)}`}
          >
            <div className="glass-card overflow-hidden group hover:ring-2 hover:ring-white/20 transition-all">
              {/* Image Preview */}
              <div className="aspect-square bg-white/5 overflow-hidden">
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Info */}
              <div className="p-3">
                <h4 className="font-medium text-white text-sm line-clamp-1 mb-2">{art.title}</h4>
                <div className="flex items-center justify-between">
                  <StatusBadge status={art.status} />
                  <span className="text-xs text-white/40">{formatRelativeTime(art.createdAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============================================
// UNIT STATS TAB
// ============================================

interface UnitStatsTabContentProps {
  entityId: string
  entityType: string
  unitProfile: UnitProfile | null
  locale: 'ru' | 'en'
}

function UnitStatsTabContent({ entityId, entityType, unitProfile, locale }: UnitStatsTabContentProps) {
  const isHero = entityType === 'HERO'
  
  if (!unitProfile) {
    return (
      <div className="glass-card p-8 text-center">
        <Swords size={48} strokeWidth={1} className="text-white/20 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          {locale === 'ru' ? 'Характеристики не заданы' : 'No stats configured'}
        </h3>
        <p className="text-white/50 mb-6 max-w-md mx-auto">
          {isHero
            ? (locale === 'ru'
              ? 'Герой — это уникальный юнит. Добавьте его боевые характеристики: HP, броню, атаки и другие параметры'
              : 'A Hero is a unique unit. Add combat stats: HP, armor, attacks and other parameters')
            : (locale === 'ru'
              ? 'Добавьте характеристики юнита: HP, броню, атаки и другие параметры'
              : 'Add unit stats: HP, armor, attacks and other parameters')}
        </p>
        <Link
          href={`/entities/${entityId}/stats/new`}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} strokeWidth={1.5} />
          {locale === 'ru' ? 'Добавить характеристики' : 'Add Stats'}
        </Link>
      </div>
    )
  }

  const immunities = Array.isArray(unitProfile.immunities) ? unitProfile.immunities as string[] : []
  const wards = Array.isArray(unitProfile.wards) ? unitProfile.wards as string[] : []

  return (
    <div className="space-y-6">
      {/* Edit button */}
      <div className="flex justify-end">
        <Link 
          href={`/entities/${entityId}/stats/edit`}
          className="btn btn-secondary text-sm inline-flex items-center gap-2"
        >
          {locale === 'ru' ? 'Редактировать' : 'Edit Stats'}
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* HP */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
            <Heart size={16} strokeWidth={1.5} className="text-[#9A4A4A]" />
            <span>HP</span>
          </div>
          <p className="text-2xl font-bold text-white">{unitProfile.hpMax}</p>
          {unitProfile.hpRegenPercent > 0 && (
            <p className="text-xs text-[#7A8A5C] mt-1">+{unitProfile.hpRegenPercent}% / ход</p>
          )}
        </div>

        {/* Armor */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
            <Shield size={16} strokeWidth={1.5} className="text-[#6B8F94]" />
            <span>{locale === 'ru' ? 'Броня' : 'Armor'}</span>
          </div>
          <p className="text-2xl font-bold text-white">{unitProfile.armor}</p>
        </div>

        {/* Level */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
            <Zap size={16} strokeWidth={1.5} className="text-[#A89C6A]" />
            <span>{locale === 'ru' ? 'Уровень' : 'Level'}</span>
          </div>
          <p className="text-2xl font-bold text-white">{unitProfile.level}</p>
          <p className="text-xs text-white/40 mt-1">
            {unitProfile.xpCurrent} / {unitProfile.xpToNext} XP
          </p>
        </div>

        {/* Role */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
            <Target size={16} strokeWidth={1.5} className="text-[#8A6A9A]" />
            <span>{locale === 'ru' ? 'Роль' : 'Role'}</span>
          </div>
          <p className="text-lg font-bold text-white">{getRoleLabel(unitProfile.role, locale)}</p>
        </div>
      </div>

      {/* Faction & Evolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Faction */}
        {unitProfile.faction && (
          <div className="glass-card p-4">
            <h4 className="text-white/50 text-sm mb-2">{locale === 'ru' ? 'Фракция' : 'Faction'}</h4>
            <Link 
              href={`/entities/${unitProfile.faction.id}`}
              className="text-white hover:text-white/80 font-medium transition-colors"
            >
              {unitProfile.faction.name}
              <span className="text-white/40 ml-2 font-mono text-sm">{unitProfile.faction.code}</span>
            </Link>
          </div>
        )}

        {/* Evolution Tree */}
        <div className="glass-card p-4">
          <h4 className="text-white/50 text-sm mb-3">
            {locale === 'ru' ? 'Древо развития' : 'Evolution Tree'}
          </h4>
          <div className="space-y-3">
            {/* Previous Evolution */}
            {unitProfile.prevEvolution ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 w-16">{locale === 'ru' ? 'Из:' : 'From:'}</span>
                <Link 
                  href={`/entities/${unitProfile.prevEvolution.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-white">{unitProfile.prevEvolution.name}</span>
                  <span className="text-white/30 font-mono text-xs">{unitProfile.prevEvolution.code}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-white/30 text-sm">
                <span className="w-16">{locale === 'ru' ? 'Из:' : 'From:'}</span>
                <span className="italic">{locale === 'ru' ? 'Базовый юнит' : 'Base unit'}</span>
              </div>
            )}

            {/* Next Evolutions */}
            {unitProfile.nextEvolutionIds && unitProfile.nextEvolutionIds.length > 0 ? (
              <div className="flex items-start gap-2">
                <span className="text-xs text-white/40 w-16 pt-1.5">{locale === 'ru' ? 'В:' : 'To:'}</span>
                <div className="flex flex-wrap gap-2">
                  {/* Note: We only have IDs here, we'd need to fetch names separately or include them in schema */}
                  <span className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-sm">
                    {unitProfile.nextEvolutionIds.length} {locale === 'ru' ? 'вариантов' : 'options'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-white/30 text-sm">
                <span className="w-16">{locale === 'ru' ? 'В:' : 'To:'}</span>
                <span className="italic">{locale === 'ru' ? 'Финальный юнит' : 'Final unit'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Immunities & Wards */}
      {(immunities.length > 0 || wards.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {immunities.length > 0 && (
            <div className="glass-card p-4">
              <h4 className="text-white/50 text-sm mb-3">{locale === 'ru' ? 'Иммунитеты' : 'Immunities'}</h4>
              <div className="flex flex-wrap gap-2">
                {immunities.map((immunity, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-[#5A1E1E]/20 text-[#B07070] text-sm">
                    {immunity}
                  </span>
                ))}
              </div>
            </div>
          )}
          {wards.length > 0 && (
            <div className="glass-card p-4">
              <h4 className="text-white/50 text-sm mb-3">{locale === 'ru' ? 'Защиты' : 'Wards'}</h4>
              <div className="flex flex-wrap gap-2">
                {wards.map((ward, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-[#3B4F52]/20 text-[#6B8F94] text-sm">
                    {ward}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attacks */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Swords size={20} strokeWidth={1.5} />
          {locale === 'ru' ? 'Атаки' : 'Attacks'}
          <span className="text-white/40 text-sm font-normal">({unitProfile.attacks.length})</span>
        </h3>
        
        {unitProfile.attacks.length === 0 ? (
          <p className="text-white/50">{locale === 'ru' ? 'Нет атак' : 'No attacks'}</p>
        ) : (
          <div className="space-y-3">
            {unitProfile.attacks.map((attack) => (
              <div key={attack.id} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">{attack.name}</h4>
                  <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/60">
                    {getDamageSourceLabel(attack.damageSource, locale)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-white/40">{locale === 'ru' ? 'Шанс' : 'Hit'}</span>
                    <p className="text-white font-medium">{Math.round(attack.hitChance * 100)}%</p>
                  </div>
                  {attack.damage && (
                    <div>
                      <span className="text-white/40">{locale === 'ru' ? 'Урон' : 'Damage'}</span>
                      <p className="text-[#9A4A4A] font-medium">{attack.damage}</p>
                    </div>
                  )}
                  {attack.heal && (
                    <div>
                      <span className="text-white/40">{locale === 'ru' ? 'Лечение' : 'Heal'}</span>
                      <p className="text-[#7A8A5C] font-medium">{attack.heal}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-white/40">{locale === 'ru' ? 'Инициатива' : 'Initiative'}</span>
                    <p className="text-[#A89C6A] font-medium">{attack.initiative}</p>
                  </div>
                  <div>
                    <span className="text-white/40">{locale === 'ru' ? 'Дальность' : 'Reach'}</span>
                    <p className="text-white font-medium">{getReachLabel(attack.reach, locale)}</p>
                  </div>
                  <div>
                    <span className="text-white/40">{locale === 'ru' ? 'Цели' : 'Targets'}</span>
                    <p className="text-white font-medium">{attack.targets}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      {unitProfile.description && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            {locale === 'ru' ? 'Описание' : 'Description'}
          </h3>
          <p className="text-white/70 whitespace-pre-wrap">{unitProfile.description}</p>
        </div>
      )}
    </div>
  )
}

// Helper functions for labels
function getRoleLabel(role: string, locale: 'ru' | 'en'): string {
  const labels: Record<string, { ru: string; en: string }> = {
    MELEE: { ru: 'Ближний бой', en: 'Melee' },
    RANGED: { ru: 'Стрелок', en: 'Ranged' },
    MAGE: { ru: 'Маг', en: 'Mage' },
    SUPPORT: { ru: 'Поддержка', en: 'Support' },
  }
  return labels[role]?.[locale] || role
}

function getDamageSourceLabel(source: string, locale: 'ru' | 'en'): string {
  const labels: Record<string, { ru: string; en: string }> = {
    WEAPON: { ru: 'Оружие', en: 'Weapon' },
    AIR: { ru: 'Воздух', en: 'Air' },
    FIRE: { ru: 'Огонь', en: 'Fire' },
    WATER: { ru: 'Вода', en: 'Water' },
    EARTH: { ru: 'Земля', en: 'Earth' },
    LIFE: { ru: 'Жизнь', en: 'Life' },
    DEATH: { ru: 'Смерть', en: 'Death' },
    MIND: { ru: 'Разум', en: 'Mind' },
  }
  return labels[source]?.[locale] || source
}

function getReachLabel(reach: string, locale: 'ru' | 'en'): string {
  const labels: Record<string, { ru: string; en: string }> = {
    ADJACENT: { ru: 'Ближняя', en: 'Adjacent' },
    ANY: { ru: 'Любая', en: 'Any' },
  }
  return labels[reach]?.[locale] || reach
}
