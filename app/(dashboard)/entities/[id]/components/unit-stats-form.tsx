/**
 * Unit Stats Form
 * For creating and editing unit stats
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Heart, Shield, Zap, Target, Swords } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

type UnitRole = 'MELEE' | 'RANGED' | 'MAGE' | 'SUPPORT'
type DamageSource = 'WEAPON' | 'AIR' | 'FIRE' | 'WATER' | 'EARTH' | 'LIFE' | 'DEATH' | 'MIND'
type AttackReach = 'ADJACENT' | 'ANY'

interface Attack {
  id?: string
  name: string
  hitChance: number
  damage: number | null
  heal: number | null
  damageSource: DamageSource
  initiative: number
  reach: AttackReach
  targets: number
}

interface Faction {
  id: string
  name: string
  code: string
}

interface UnitEntity {
  id: string
  name: string
  code: string
}

interface UnitStats {
  id: string
  factionId: string
  name: string
  role: UnitRole
  level: number
  xpCurrent: number
  xpToNext: number
  hpMax: number
  armor: number
  immunities: string[]
  wards: string[]
  hpRegenPercent: number
  xpOnKill: number
  description: string | null
  prevEvolutionId: string | null
  nextEvolutionIds: string[]
  attacks: Attack[]
}

interface FormProps {
  entityId: string
  entityName: string
  entityType?: string
  factions: Faction[]
  unitEntities: UnitEntity[]
  existingStats?: UnitStats
}

const roles: { value: UnitRole; label: { ru: string; en: string } }[] = [
  { value: 'MELEE', label: { ru: 'Ближний бой', en: 'Melee' } },
  { value: 'RANGED', label: { ru: 'Стрелок', en: 'Ranged' } },
  { value: 'MAGE', label: { ru: 'Маг', en: 'Mage' } },
  { value: 'SUPPORT', label: { ru: 'Поддержка', en: 'Support' } },
]

const damageSources: { value: DamageSource; label: { ru: string; en: string } }[] = [
  { value: 'WEAPON', label: { ru: 'Оружие', en: 'Weapon' } },
  { value: 'AIR', label: { ru: 'Воздух', en: 'Air' } },
  { value: 'FIRE', label: { ru: 'Огонь', en: 'Fire' } },
  { value: 'WATER', label: { ru: 'Вода', en: 'Water' } },
  { value: 'EARTH', label: { ru: 'Земля', en: 'Earth' } },
  { value: 'LIFE', label: { ru: 'Жизнь', en: 'Life' } },
  { value: 'DEATH', label: { ru: 'Смерть', en: 'Death' } },
  { value: 'MIND', label: { ru: 'Разум', en: 'Mind' } },
]

const defaultAttack: Attack = {
  name: '',
  hitChance: 0.8,
  damage: 25,
  heal: null,
  damageSource: 'WEAPON',
  initiative: 50,
  reach: 'ADJACENT',
  targets: 1,
}

export function UnitStatsForm({ entityId, entityName, entityType = 'UNIT', factions, unitEntities, existingStats }: FormProps) {
  const router = useRouter()
  const { locale } = useLocale()
  const isHero = entityType === 'HERO'
  const isEdit = !!existingStats
  
  // Form state
  const [factionId, setFactionId] = useState(existingStats?.factionId || '')
  const [role, setRole] = useState<UnitRole>(existingStats?.role || 'MELEE')
  const [level, setLevel] = useState(existingStats?.level || 1)
  const [xpCurrent, setXpCurrent] = useState(existingStats?.xpCurrent || 0)
  const [xpToNext, setXpToNext] = useState(existingStats?.xpToNext || 80)
  const [hpMax, setHpMax] = useState(existingStats?.hpMax || 100)
  const [armor, setArmor] = useState(existingStats?.armor || 0)
  const [hpRegenPercent, setHpRegenPercent] = useState(existingStats?.hpRegenPercent || 0)
  const [xpOnKill, setXpOnKill] = useState(existingStats?.xpOnKill || 25)
  const [description, setDescription] = useState(existingStats?.description || '')
  const [prevEvolutionId, setPrevEvolutionId] = useState(existingStats?.prevEvolutionId || '')
  const [attacks, setAttacks] = useState<Attack[]>(existingStats?.attacks || [{ ...defaultAttack }])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const addAttack = () => {
    setAttacks([...attacks, { ...defaultAttack, name: `Атака ${attacks.length + 1}` }])
  }
  
  const removeAttack = (index: number) => {
    setAttacks(attacks.filter((_, i) => i !== index))
  }
  
  const updateAttack = (index: number, field: keyof Attack, value: unknown) => {
    const updated = [...attacks]
    updated[index] = { ...updated[index], [field]: value }
    setAttacks(updated)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!factionId) {
      setError(locale === 'ru' ? 'Выберите фракцию' : 'Select a faction')
      return
    }
    
    if (hpMax <= 0) {
      setError(locale === 'ru' ? 'HP должен быть больше 0' : 'HP must be greater than 0')
      return
    }
    
    if (attacks.length === 0) {
      setError(locale === 'ru' ? 'Добавьте хотя бы одну атаку' : 'Add at least one attack')
      return
    }
    
    for (const attack of attacks) {
      if (!attack.name.trim()) {
        setError(locale === 'ru' ? 'Все атаки должны иметь название' : 'All attacks must have a name')
        return
      }
    }
    
    setLoading(true)
    
    try {
      const url = isEdit 
        ? `/api/entities/${entityId}/stats` 
        : `/api/entities/${entityId}/stats`
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId,
          factionId,
          name: entityName,
          role,
          level,
          xpCurrent,
          xpToNext,
          hpMax,
          armor,
          hpRegenPercent,
          xpOnKill,
          description: description.trim() || null,
          prevEvolutionId: prevEvolutionId || null,
          attacks: attacks.map(a => ({
            ...a,
            name: a.name.trim(),
            damage: a.damage || null,
            heal: a.heal || null,
          })),
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || (locale === 'ru' ? 'Ошибка сохранения' : 'Save error'))
        return
      }
      
      router.push(`/entities/${entityId}?tab=stats`)
      router.refresh()
    } catch {
      setError(locale === 'ru' ? 'Ошибка сохранения' : 'Save error')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-[#5A1E1E]/20 border border-[#5A1E1E]/30 rounded-xl text-[#B07070] text-sm">
          {error}
        </div>
      )}
      
      {/* Faction & Role */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Основное</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">
              Фракция <span className="text-[#9A4A4A]">*</span>
            </label>
            <select
              value={factionId}
              onChange={e => setFactionId(e.target.value)}
              className="input"
              required
            >
              <option value="">Выберите фракцию...</option>
              {factions.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">
              Роль <span className="text-[#9A4A4A]">*</span>
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UnitRole)}
              className="input"
            >
              {roles.map(r => (
                <option key={r.value} value={r.value}>{r.label[locale]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Base Stats */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Heart size={20} className="text-[#9A4A4A]" />
          Характеристики
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">
              HP <span className="text-[#9A4A4A]">*</span>
            </label>
            <input
              type="number"
              value={hpMax}
              onChange={e => setHpMax(parseInt(e.target.value) || 0)}
              className="input"
              min={1}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">
              Броня
            </label>
            <input
              type="number"
              value={armor}
              onChange={e => setArmor(parseInt(e.target.value) || 0)}
              className="input"
              min={0}
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">
              Реген HP (%)
            </label>
            <input
              type="number"
              value={hpRegenPercent}
              onChange={e => setHpRegenPercent(parseFloat(e.target.value) || 0)}
              className="input"
              min={0}
              step={0.1}
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">
              XP за убийство
            </label>
            <input
              type="number"
              value={xpOnKill}
              onChange={e => setXpOnKill(parseInt(e.target.value) || 0)}
              className="input"
              min={0}
            />
          </div>
        </div>
      </div>
      
      {/* Level & XP */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={20} className="text-[#A89C6A]" />
          Уровень
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Уровень</label>
            <input
              type="number"
              value={level}
              onChange={e => setLevel(parseInt(e.target.value) || 1)}
              className="input"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Текущий XP</label>
            <input
              type="number"
              value={xpCurrent}
              onChange={e => setXpCurrent(parseInt(e.target.value) || 0)}
              className="input"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">XP до следующего</label>
            <input
              type="number"
              value={xpToNext}
              onChange={e => setXpToNext(parseInt(e.target.value) || 80)}
              className="input"
              min={1}
            />
          </div>
        </div>
      </div>
      
      {/* Evolution */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target size={20} className="text-[#8A6A9A]" />
          Древо развития
        </h3>
        <div>
          <label className="block text-sm text-white/60 mb-2">
            Предыдущий шаг (из какого юнита эволюционировал)
          </label>
          <select
            value={prevEvolutionId}
            onChange={e => setPrevEvolutionId(e.target.value)}
            className="input"
          >
            <option value="">Базовый юнит (без предшественника)</option>
            {unitEntities.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.code})</option>
            ))}
          </select>
          <p className="text-xs text-white/40 mt-1">
            Выберите юнита, из которого эволюционировал данный юнит
          </p>
        </div>
      </div>
      
      {/* Attacks */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Swords size={20} />
            Атаки
          </h3>
          <button
            type="button"
            onClick={addAttack}
            className="btn btn-secondary text-sm"
          >
            <Plus size={16} /> Добавить атаку
          </button>
        </div>
        
        <div className="space-y-4">
          {attacks.map((attack, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={attack.name}
                  onChange={e => updateAttack(index, 'name', e.target.value)}
                  className="input flex-1 mr-4"
                  placeholder="Название атаки"
                  required
                />
                {attacks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttack(index)}
                    className="text-[#9A4A4A] hover:text-[#B07070] p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-white/40 mb-1">Шанс попадания</label>
                  <input
                    type="number"
                    value={attack.hitChance}
                    onChange={e => updateAttack(index, 'hitChance', parseFloat(e.target.value) || 0)}
                    className="input text-sm"
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Урон</label>
                  <input
                    type="number"
                    value={attack.damage || ''}
                    onChange={e => updateAttack(index, 'damage', e.target.value ? parseInt(e.target.value) : null)}
                    className="input text-sm"
                    min={0}
                    placeholder="—"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Лечение</label>
                  <input
                    type="number"
                    value={attack.heal || ''}
                    onChange={e => updateAttack(index, 'heal', e.target.value ? parseInt(e.target.value) : null)}
                    className="input text-sm"
                    min={0}
                    placeholder="—"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Инициатива</label>
                  <input
                    type="number"
                    value={attack.initiative}
                    onChange={e => updateAttack(index, 'initiative', parseInt(e.target.value) || 0)}
                    className="input text-sm"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Источник урона</label>
                  <select
                    value={attack.damageSource}
                    onChange={e => updateAttack(index, 'damageSource', e.target.value)}
                    className="input text-sm"
                  >
                    {damageSources.map(ds => (
                      <option key={ds.value} value={ds.value}>{ds.label[locale]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Дальность</label>
                  <select
                    value={attack.reach}
                    onChange={e => updateAttack(index, 'reach', e.target.value)}
                    className="input text-sm"
                  >
                    <option value="ADJACENT">Ближняя</option>
                    <option value="ANY">Любая</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1">Целей</label>
                  <input
                    type="number"
                    value={attack.targets}
                    onChange={e => updateAttack(index, 'targets', parseInt(e.target.value) || 1)}
                    className="input text-sm"
                    min={1}
                    max={6}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Description */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Описание</h3>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="input min-h-[120px] resize-y"
          placeholder="Описание юнита, его способностей и особенностей..."
        />
      </div>
      
      {/* Submit */}
      <div className="flex gap-4">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать характеристики'}
        </button>
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="btn btn-ghost"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}



