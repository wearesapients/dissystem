/**
 * Entity Art Group Component - Shows multiple arts for one entity
 */

/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, ChevronLeft, ChevronRight, Images } from 'lucide-react'

type AssetStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'
type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'

type ConceptArt = {
  id: string
  title: string
  imageUrl: string
  status: AssetStatus
  createdAt: Date
  createdBy: { name: string }
}

type EntityArtGroupProps = {
  entity: {
    id: string
    code: string
    name: string
    type: GameEntityType
  }
  arts: ConceptArt[]
}

const statusLabels: Record<AssetStatus, string> = {
  DRAFT: 'Черновик',
  IN_REVIEW: 'На проверке',
  APPROVED: 'Утверждено',
  REJECTED: 'Отклонено',
  ARCHIVED: 'В архиве',
}

const entityTypeLabels: Record<GameEntityType, string> = {
  UNIT: 'Юнит',
  HERO: 'Герой',
  FACTION: 'Фракция',
  SPELL: 'Заклинание',
  ARTIFACT: 'Артефакт',
  LOCATION: 'Локация',
  OBJECT: 'Объект',
  OTHER: 'Другое',
}

function EntityIcon({ type }: { type: GameEntityType }) {
  const iconProps = { size: 14, strokeWidth: 1.5, className: 'text-[#A89C6A]' }
  
  switch (type) {
    case 'UNIT': return <Swords {...iconProps} />
    case 'HERO': return <Crown {...iconProps} />
    case 'FACTION': return <Castle {...iconProps} />
    case 'SPELL': return <Sparkles {...iconProps} />
    case 'ARTIFACT': return <Gem {...iconProps} />
    case 'LOCATION': return <MapPin {...iconProps} />
    case 'OBJECT': return <Box {...iconProps} />
    default: return <HelpCircle {...iconProps} />
  }
}

export function EntityArtGroup({ entity, arts }: EntityArtGroupProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentArt = arts[currentIndex]
  
  const goNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % arts.length)
  }
  
  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + arts.length) % arts.length)
  }
  
  const goToIndex = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(index)
  }
  
  return (
    <div className="glass-card overflow-hidden h-full flex flex-col group">
      {/* Main Image with Navigation */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-white/5 to-white/10 overflow-hidden">
        <Link href={`/concept-art/${currentArt.id}`}>
          <img
            src={currentArt.imageUrl}
            alt={currentArt.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Navigation Arrows */}
        {arts.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </>
        )}
        
        {/* Status badge overlay */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border backdrop-blur-md bg-black/30 status-${currentArt.status.toLowerCase().replace('_', '-')}`}>
            {statusLabels[currentArt.status]}
          </span>
        </div>
        
        {/* Art count badge */}
        {arts.length > 1 && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md flex items-center gap-1.5 text-xs text-white">
            <Images size={12} />
            {arts.length}
          </div>
        )}
        
        {/* Dots Indicator */}
        {arts.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {arts.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToIndex(index, e)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Current art title */}
        <h3 className="font-semibold text-white line-clamp-1 mb-1">
          {currentArt.title}
        </h3>
        
        {/* Entity link */}
        <Link
          href={`/entities/${entity.id}`}
          className="mb-3 py-2 px-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-2 text-xs transition-colors"
        >
          <EntityIcon type={entity.type} />
          <span className="text-white/40">{entityTypeLabels[entity.type]}:</span>
          <span className="text-[#A89C6A] font-medium truncate">{entity.name}</span>
        </Link>
        
        {/* Thumbnails row for quick navigation */}
        {arts.length > 1 && (
          <div className="flex gap-1.5 mb-3 overflow-x-auto">
            {arts.slice(0, 5).map((art, index) => (
              <button
                key={art.id}
                onClick={(e) => goToIndex(index, e)}
                className={`flex-shrink-0 w-10 h-10 rounded overflow-hidden border transition-all ${
                  index === currentIndex 
                    ? 'border-[#A89C6A] ring-1 ring-[#A89C6A]' 
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {arts.length > 5 && (
              <Link
                href={`/concept-art?entityId=${entity.id}`}
                className="flex-shrink-0 w-10 h-10 rounded bg-white/10 hover:bg-white/15 flex items-center justify-center text-xs text-white/50 transition-colors"
              >
                +{arts.length - 5}
              </Link>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
          <span className="text-xs text-white/40">{currentArt.createdBy.name}</span>
          <span className="text-xs text-white/40">{formatRelativeTime(currentArt.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

