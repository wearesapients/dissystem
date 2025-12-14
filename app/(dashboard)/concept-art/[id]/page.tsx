/**
 * Concept Art Detail Page
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
/* eslint-disable @next/next/no-img-element */
import { ArrowLeft, Edit, Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, ExternalLink, Calendar, User, Download, FileImage } from 'lucide-react'
import { getConceptArt, getEntityConceptArts } from '@/lib/concept-art/service'
import { getCurrentUser } from '@/lib/auth/session'
import { canEditModule } from '@/lib/auth/permissions'
import { formatRelativeTime } from '@/lib/utils'
import { ConceptArtComments } from '../components/concept-art-comments'
import { ConceptArtActions } from './concept-art-actions'

type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'

interface PageProps {
  params: Promise<{ id: string }>
}

const statusLabels: Record<string, string> = {
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
  const iconProps = { size: 16, strokeWidth: 1.5, className: 'text-[#A89C6A]' }
  
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

export default async function ConceptArtDetailPage({ params }: PageProps) {
  const { id } = await params
  const [art, currentUser] = await Promise.all([
    getConceptArt(id),
    getCurrentUser(),
  ])
  
  if (!art) notFound()
  if (!currentUser) notFound()
  
  // Get all arts for the same entity (for gallery)
  const entityArts = art.entityId 
    ? await getEntityConceptArts(art.entityId)
    : []
  
  // Filter out current art and check if there are more
  const otherArts = entityArts.filter(a => a.id !== art.id)
  const hasGallery = otherArts.length > 0
  
  return (
    <div className="animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/concept-art" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Назад к концепт-артам
        </Link>
        
        <div className="flex items-center gap-3">
          {canEditModule(currentUser.role, 'concept-art') && (
            <Link
              href={`/concept-art/${art.id}/edit`}
              className="btn btn-ghost"
            >
              <Edit size={16} strokeWidth={1.5} />
              Редактировать
            </Link>
          )}
          <ConceptArtActions id={art.id} title={art.title} userRole={currentUser.role} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Image & Gallery */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image */}
          <div className="glass-card overflow-hidden">
            <div className="relative aspect-[16/10] bg-black/20 flex items-center justify-center">
              <img
                src={art.imageUrl}
                alt={art.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          
          {/* Gallery - Other arts of the same entity */}
          {hasGallery && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-medium text-white/60 mb-3">
                Другие арты для «{art.entity?.name}» ({otherArts.length})
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {/* Current art indicator */}
                <div className="flex-shrink-0 w-24">
                  <div className="aspect-square rounded-lg overflow-hidden ring-2 ring-[#A89C6A] relative">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#A89C6A]/20" />
                  </div>
                  <p className="text-xs text-[#A89C6A] mt-1.5 text-center truncate">Текущий</p>
                </div>
                
                {/* Other arts */}
                {otherArts.map((otherArt) => (
                  <Link
                    key={otherArt.id}
                    href={`/concept-art/${otherArt.id}`}
                    className="flex-shrink-0 w-24 group"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors">
                      <img
                        src={otherArt.thumbnailUrl || otherArt.imageUrl}
                        alt={otherArt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs text-white/50 group-hover:text-white mt-1.5 text-center truncate transition-colors">
                      {otherArt.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Title & Status */}
          <div className="glass-card p-6">
            <h1 className="text-2xl font-bold text-white mb-3">{art.title}</h1>
            <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium border status-${art.status.toLowerCase().replace('_', '-')}`}>
              {statusLabels[art.status]}
            </span>
          </div>
          
          {/* Description */}
          {art.description && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-medium text-white/60 mb-2">Описание</h3>
              <p className="text-white/80 whitespace-pre-wrap">{art.description}</p>
            </div>
          )}
          
          {/* Linked Entity */}
          {art.entity && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-medium text-white/60 mb-3">Привязка к объекту</h3>
              <Link
                href={`/entities/${art.entity.id}`}
                className="flex items-center gap-3 p-3 bg-[#A89C6A]/10 border border-[#A89C6A]/30 rounded-xl hover:bg-[#A89C6A]/15 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <EntityIcon type={art.entity.type as GameEntityType} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{art.entity.name}</p>
                  <p className="text-xs text-white/50">{entityTypeLabels[art.entity.type as GameEntityType]} • {art.entity.code}</p>
                </div>
                <ExternalLink size={16} className="text-white/30" />
              </Link>
            </div>
          )}
          
          {/* Tags */}
          {art.tags.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-medium text-white/60 mb-3">Теги</h3>
              <div className="flex flex-wrap gap-2">
                {art.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/concept-art?tag=${tag}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Meta */}
          <div className="glass-card p-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User size={16} strokeWidth={1.5} className="text-white/40" />
              <span className="text-white/60">Автор:</span>
              <span className="text-white">{art.createdBy.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} strokeWidth={1.5} className="text-white/40" />
              <span className="text-white/60">Создано:</span>
              <span className="text-white">{formatRelativeTime(art.createdAt)}</span>
            </div>
          </div>
          
          {/* Original File Download */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
              <FileImage size={14} strokeWidth={1.5} />
              Исходный файл
            </h3>
            <a
              href={art.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-[#8A6A9A]/10 border border-[#8A6A9A]/30 rounded-xl hover:bg-[#8A6A9A]/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8A6A9A]/20 flex items-center justify-center">
                <Download size={20} strokeWidth={1.5} className="text-[#8A6A9A]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Открыть оригинал</p>
                <p className="text-xs text-white/50">Максимальное качество</p>
              </div>
              <ExternalLink size={16} className="text-white/30 group-hover:text-white/50 transition-colors" />
            </a>
            <a
              href={art.imageUrl}
              download
              className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/70 hover:text-white transition-colors"
            >
              <Download size={16} strokeWidth={1.5} />
              Скачать файл
            </a>
          </div>
          
          {/* Comments */}
          <ConceptArtComments
            conceptArtId={art.id}
            comments={art.comments}
            currentUserId={currentUser.id}
          />
        </div>
      </div>
    </div>
  )
}

