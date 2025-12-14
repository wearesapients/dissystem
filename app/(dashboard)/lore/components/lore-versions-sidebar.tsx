/**
 * Lore Versions Sidebar Component - Compact view with inline changes
 */

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { History, RotateCcw, ChevronDown, ChevronUp, Plus, Minus, Edit3, FileText } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'

type Version = {
  id: string
  version: number
  title: string
  content: string
  summary: string | null
  changeNote: string | null
  createdAt: Date
  changedBy: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

interface LoreVersionsSidebarProps {
  loreEntryId: string
  versions: Version[]
  currentVersion: number
}

// Compute what changed between versions
function getChangeSummary(prev: Version, curr: Version): {
  titleChanged: boolean
  summaryChanged: boolean
  contentStats: { added: number; removed: number; changed: number }
  highlights: { type: 'added' | 'removed' | 'changed'; text: string }[]
} {
  const titleChanged = prev.title !== curr.title
  const summaryChanged = prev.summary !== curr.summary
  
  const prevLines = prev.content.split('\n')
  const currLines = curr.content.split('\n')
  
  // Find added and removed lines
  const prevSet = new Set(prevLines.filter(l => l.trim()))
  const currSet = new Set(currLines.filter(l => l.trim()))
  
  const added: string[] = []
  const removed: string[] = []
  
  currLines.forEach(line => {
    if (line.trim() && !prevSet.has(line)) {
      added.push(line.trim())
    }
  })
  
  prevLines.forEach(line => {
    if (line.trim() && !currSet.has(line)) {
      removed.push(line.trim())
    }
  })
  
  // Create highlights (most significant changes)
  const highlights: { type: 'added' | 'removed' | 'changed'; text: string }[] = []
  
  if (titleChanged) {
    highlights.push({ type: 'changed', text: `Заголовок: "${curr.title}"` })
  }
  
  // Add top added lines as highlights
  added.slice(0, 2).forEach(line => {
    const preview = line.length > 50 ? line.substring(0, 50) + '...' : line
    highlights.push({ type: 'added', text: preview })
  })
  
  // Add top removed lines
  removed.slice(0, 1).forEach(line => {
    const preview = line.length > 50 ? line.substring(0, 50) + '...' : line
    highlights.push({ type: 'removed', text: preview })
  })
  
  return {
    titleChanged,
    summaryChanged,
    contentStats: {
      added: added.length,
      removed: removed.length,
      changed: Math.min(added.length, removed.length), // rough estimate of changed lines
    },
    highlights,
  }
}

export function LoreVersionsSidebar({ loreEntryId, versions, currentVersion }: LoreVersionsSidebarProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const [expanded, setExpanded] = useState(true)
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null)
  const [restoring, setRestoring] = useState<number | null>(null)
  
  // Compute changes between consecutive versions
  const changes = useMemo(() => {
    const result: Record<number, ReturnType<typeof getChangeSummary>> = {}
    
    for (let i = 0; i < versions.length - 1; i++) {
      const curr = versions[i]
      const prev = versions[i + 1]
      result[curr.version] = getChangeSummary(prev, curr)
    }
    
    return result
  }, [versions])
  
  const handleRestore = async (version: number) => {
    if (!confirm(t('lore.confirmRestore', locale).replace('{version}', version.toString()))) {
      return
    }
    
    setRestoring(version)
    try {
      const res = await fetch(`/api/lore/${loreEntryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'restoreVersion',
          version,
        }),
      })
      
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to restore version:', error)
    } finally {
      setRestoring(null)
    }
  }
  
  if (versions.length === 0) {
    return null
  }
  
  return (
    <div className="glass-card p-5">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <h4 className="font-medium text-white flex items-center gap-2">
          <History size={16} strokeWidth={1.5} className="text-white/50" />
          История версий
          <span className="text-white/40 font-normal text-sm">({versions.length})</span>
        </h4>
        {expanded ? (
          <ChevronUp size={16} className="text-white/40" />
        ) : (
          <ChevronDown size={16} className="text-white/40" />
        )}
      </button>
      
      {expanded && (
        <div className="space-y-3">
          {versions.map((version, index) => {
            const isCurrent = version.version === currentVersion
            const isFirst = index === versions.length - 1
            const change = changes[version.version]
            const isExpanded = expandedVersion === version.version
            
            return (
              <div 
                key={version.id}
                className={`rounded-xl transition-all ${
                  isCurrent 
                    ? 'bg-[#A89C6A]/10 border border-[#A89C6A]/30' 
                    : 'bg-white/5 border border-transparent hover:border-white/10'
                }`}
              >
                {/* Version header */}
                <div 
                  className="p-3 cursor-pointer"
                  onClick={() => setExpandedVersion(isExpanded ? null : version.version)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${isCurrent ? 'text-[#A89C6A]' : 'text-white/60'}`}>
                      v{version.version}
                    </span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 bg-[#A89C6A]/20 text-[#A89C6A] rounded text-[10px] font-medium">
                        текущая
                      </span>
                    )}
                    {!isFirst && change && (
                      <div className="flex items-center gap-1 ml-auto">
                        {change.contentStats.added > 0 && (
                          <span className="text-[10px] text-[#7A8A5C] flex items-center gap-0.5">
                            <Plus size={10} />
                            {change.contentStats.added}
                          </span>
                        )}
                        {change.contentStats.removed > 0 && (
                          <span className="text-[10px] text-[#9A4A4A] flex items-center gap-0.5">
                            <Minus size={10} />
                            {change.contentStats.removed}
                          </span>
                        )}
                        {change.titleChanged && (
                          <Edit3 size={10} className="text-[#A89C6A]" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-[11px] text-white/40">
                    <span>{version.changedBy.name}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(version.createdAt)}</span>
                  </div>
                  
                  {/* Change note */}
                  {version.changeNote && (
                    <p className="text-xs text-white/60 mt-1 italic">
                      "{version.changeNote}"
                    </p>
                  )}
                </div>
                
                {/* Expanded: show changes */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-white/10 pt-3">
                    {isFirst ? (
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <FileText size={12} />
                        Первоначальная версия
                      </div>
                    ) : change ? (
                      <div className="space-y-2">
                        {/* Change highlights */}
                        {change.highlights.length > 0 ? (
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-white/40 uppercase tracking-wide">Изменения:</p>
                            {change.highlights.map((h, i) => (
                              <div 
                                key={i}
                                className={`text-xs px-2 py-1.5 rounded ${
                                  h.type === 'added' 
                                    ? 'bg-[#4F5A3C]/20 text-[#7A8A5C] border-l-2 border-[#4F5A3C]' 
                                    : h.type === 'removed'
                                    ? 'bg-[#5A1E1E]/20 text-[#B07070] border-l-2 border-[#5A1E1E]'
                                    : 'bg-[#A89C6A]/20 text-[#A89C6A] border-l-2 border-[#A89C6A]'
                                }`}
                              >
                                <span className="opacity-60 mr-1">
                                  {h.type === 'added' ? '+' : h.type === 'removed' ? '-' : '~'}
                                </span>
                                {h.text}
                              </div>
                            ))}
                            
                            {/* Summary stats */}
                            <div className="flex items-center gap-3 text-[10px] text-white/40 pt-1">
                              {change.contentStats.added > 0 && (
                                <span className="text-[#7A8A5C]">
                                  +{change.contentStats.added} строк
                                </span>
                              )}
                              {change.contentStats.removed > 0 && (
                                <span className="text-[#9A4A4A]">
                                  -{change.contentStats.removed} строк
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-white/40">Незначительные изменения</p>
                        )}
                        
                        {/* Restore button */}
                        {!isCurrent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRestore(version.version)
                            }}
                            disabled={restoring !== null}
                            className="w-full mt-2 px-3 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-xs text-white/60 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw size={12} className={restoring === version.version ? 'animate-spin' : ''} />
                            Восстановить эту версию
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

