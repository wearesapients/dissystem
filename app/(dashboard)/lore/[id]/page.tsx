/**
 * Lore Entry Detail Page
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Link2, Edit, Tag, User, Calendar, History } from 'lucide-react'
import { getLoreEntry } from '@/lib/lore/service'
import { getSession } from '@/lib/auth/session'
import { canEditModule } from '@/lib/auth/permissions'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { LORE_TYPE_LABELS, LoreType } from '@/lib/lore/service'
import { LoreComments } from '../components/lore-comments'
import { LoreVersionsSidebar } from '../components/lore-versions-sidebar'
import { LoreActions } from './lore-actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function LoreDetailPage({ params }: PageProps) {
  const { id } = await params
  const [entry, session] = await Promise.all([
    getLoreEntry(id),
    getSession(),
  ])
  
  if (!entry || !session) {
    notFound()
  }
  
  const canEdit = canEditModule(session.user.role, 'lore')
  const loreTypeLabel = LORE_TYPE_LABELS[entry.loreType as LoreType]
  
  // Collect all linked entities
  type EntityInfo = { id: string; code: string; name: string; type: string }
  const allEntities: EntityInfo[] = []
  if (entry.entity) allEntities.push(entry.entity)
  entry.linkedEntities.forEach((le) => {
    if (!allEntities.find(e => e.id === le.entity.id)) {
      allEntities.push(le.entity)
    }
  })
  
  return (
    <div className="animate-in">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/lore" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Назад к лору
        </Link>
        
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-[#3E2F45]/30 text-[#8A6A9A] rounded-lg text-sm font-medium">
                {loreTypeLabel?.ru || entry.loreType}
              </span>
              <StatusBadge status={entry.status} />
              <span className="flex items-center gap-1 text-sm text-white/40">
                <History size={14} strokeWidth={1.5} />
                v{entry.version}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{entry.title}</h1>
            {entry.summary && (
              <p className="text-lg text-white/60">{entry.summary}</p>
            )}
          </div>
          
          <div className="flex gap-3">
            {canEdit && (
              <Link 
                href={`/lore/${id}/edit`}
                className="btn btn-ghost flex items-center gap-2"
              >
                <Edit size={16} strokeWidth={1.5} />
                Редактировать
              </Link>
            )}
            <LoreActions entry={entry} userRole={session.user.role} />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0 order-2 lg:order-1">
          {/* Content */}
          <div className="glass-card p-6">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-white/80 leading-relaxed">
                {entry.content}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6 order-1 lg:order-2">
          {/* Meta Info */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <User size={16} strokeWidth={1.5} className="text-white/40" />
              <div>
                <p className="text-white/40 text-xs">Автор</p>
                <p className="text-white">{entry.createdBy.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} strokeWidth={1.5} className="text-white/40" />
              <div>
                <p className="text-white/40 text-xs">Создано</p>
                <p className="text-white">{formatRelativeTime(entry.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} strokeWidth={1.5} className="text-white/40" />
              <div>
                <p className="text-white/40 text-xs">Обновлено</p>
                <p className="text-white">{formatRelativeTime(entry.updatedAt)}</p>
              </div>
            </div>
          </div>
          
          {/* Linked Entities */}
          {allEntities.length > 0 && (
            <div className="glass-card p-5">
              <h4 className="font-medium text-white flex items-center gap-2 mb-4">
                <Link2 size={16} strokeWidth={1.5} className="text-[#A89C6A]" />
                Связанные сущности
              </h4>
              <div className="space-y-2">
                {allEntities.map((entity) => entity && (
                  <Link
                    key={entity.id}
                    href={`/entities/${entity.id}`}
                    className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-medium text-white/60">
                      {entity.type.substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{entity.name}</p>
                      <p className="text-xs text-white/40">{entity.code}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="glass-card p-5">
              <h4 className="font-medium text-white flex items-center gap-2 mb-4">
                <Tag size={16} strokeWidth={1.5} className="text-white/50" />
                Теги
              </h4>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/lore?tag=${tag}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Version History */}
          <LoreVersionsSidebar 
            loreEntryId={entry.id}
            versions={entry.versions}
            currentVersion={entry.version}
          />
          
          {/* Comments */}
          <LoreComments 
            loreEntryId={entry.id} 
            comments={entry.comments}
            currentUserId={session?.user.id || ''}
          />
        </div>
      </div>
    </div>
  )
}
