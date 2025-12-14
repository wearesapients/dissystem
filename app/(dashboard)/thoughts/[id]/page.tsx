/**
 * Thought Detail Page - Redesigned like ConceptArt
 */

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, User, Calendar, UserCheck, Swords, Crown, Castle, Sparkles, Gem, MapPin, Box, HelpCircle, ExternalLink } from 'lucide-react'
import { getThought } from '@/lib/thoughts/service'
import { getCurrentUser } from '@/lib/auth/session'
import { canEditModule } from '@/lib/auth/permissions'
import { formatRelativeTime } from '@/lib/utils'
import { ThoughtComments } from '../components/thought-comments'
import { ThoughtDetailActions } from './thought-detail-actions'
import { ThoughtAttachments } from './thought-attachments'
import { ThoughtLinksBlock } from './thought-links-block'

type ThoughtStatus = 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'
type ThoughtPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
type GameEntityType = 'UNIT' | 'HERO' | 'FACTION' | 'SPELL' | 'ARTIFACT' | 'LOCATION' | 'OBJECT' | 'OTHER'

interface PageProps {
  params: Promise<{ id: string }>
}

const statusLabels: Record<ThoughtStatus, string> = {
  DRAFT: 'Черновик',
  PENDING: 'На утверждении',
  IN_PROGRESS: 'В работе',
  APPROVED: 'Утверждено',
  REJECTED: 'Отклонено',
}

const priorityLabels: Record<ThoughtPriority, string> = {
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
  CRITICAL: 'Критический',
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

export default async function ThoughtDetailPage({ params }: PageProps) {
  const { id } = await params
  
  if (id === 'new') {
    redirect('/thoughts/new')
  }
  
  const [thought, currentUser] = await Promise.all([
    getThought(id),
    getCurrentUser(),
  ])
  
  if (!thought || !currentUser) {
    notFound()
  }
  
  const canEdit = canEditModule(currentUser.role, 'thoughts')
  
  return (
    <div className="animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/thoughts" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Назад к мыслям
        </Link>
        
        <div className="flex items-center gap-3">
          {canEdit && (
            <Link
              href={`/thoughts/${thought.id}/edit`}
              className="btn btn-ghost"
            >
              <Edit size={16} strokeWidth={1.5} />
              Редактировать
            </Link>
          )}
          <ThoughtDetailActions thought={thought} userRole={currentUser.role} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Status Card */}
          <div className="glass-card p-6">
            {/* Status & Priority */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span 
                className={`px-3 py-1.5 rounded-xl text-sm font-medium border status-${(thought.status as string).toLowerCase().replace('_', '-')}`}
              >
                {statusLabels[thought.status as ThoughtStatus]}
              </span>
              <span className={`text-sm font-medium priority-${(thought.priority as string).toLowerCase()}`}>
                {priorityLabels[thought.priority as ThoughtPriority]}
              </span>
              {thought.isPinned && (
                <span className="px-2.5 py-1 bg-[#A89C6A]/20 text-[#A89C6A] rounded-lg text-xs font-medium">
                  📌 Закреплено
                </span>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-white leading-tight">
              {thought.title}
            </h1>
          </div>
          
          {/* Content */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-medium text-white/60 mb-3">Содержание</h3>
            <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
              {thought.content}
            </p>
          </div>
          
          {/* Rejection Reason */}
          {thought.status === 'REJECTED' && thought.rejectionReason && (
            <div className="glass-card p-6 border-[#9A4A4A]/30 bg-[#9A4A4A]/5">
              <h3 className="text-sm font-medium text-[#9A4A4A] mb-2">Причина отклонения</h3>
              <p className="text-white/80">{thought.rejectionReason}</p>
            </div>
          )}
          
          {/* Comments */}
          <ThoughtComments thoughtId={thought.id} comments={thought.comments} />
        </div>
        
        {/* Sidebar - Right */}
        <div className="space-y-4">
          {/* Linked Entity */}
          {thought.entity && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-medium text-white/60 mb-3">Связанная сущность</h3>
              <Link
                href={`/entities/${thought.entity.id}`}
                className="flex items-center gap-3 p-3 bg-[#A89C6A]/10 border border-[#A89C6A]/30 rounded-xl hover:bg-[#A89C6A]/15 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <EntityIcon type={thought.entity.type as GameEntityType} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{thought.entity.name}</p>
                  <p className="text-xs text-white/50">{entityTypeLabels[thought.entity.type as GameEntityType]} • {thought.entity.code}</p>
                </div>
                <ExternalLink size={16} className="text-white/30 flex-shrink-0" />
              </Link>
            </div>
          )}
          
          {/* Tags */}
          {thought.tags.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-medium text-white/60 mb-3">Теги</h3>
              <div className="flex flex-wrap gap-2">
                {thought.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/thoughts?tag=${tag}`}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Links & References */}
          <ThoughtLinksBlock links={(thought as { links?: string[] }).links || []} />
          
          {/* Attachments */}
          <ThoughtAttachments thoughtId={thought.id} />
          
          {/* Meta */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User size={16} strokeWidth={1.5} className="text-white/40" />
              <span className="text-white/60">Автор:</span>
              <span className="text-white">{thought.createdBy.name}</span>
            </div>
            {thought.assignee && (
              <div className="flex items-center gap-3 text-sm">
                <UserCheck size={16} strokeWidth={1.5} className="text-white/40" />
                <span className="text-white/60">Исполнитель:</span>
                <span className="text-white">{thought.assignee.name}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} strokeWidth={1.5} className="text-white/40" />
              <span className="text-white/60">Создано:</span>
              <span className="text-white">{formatRelativeTime(thought.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
