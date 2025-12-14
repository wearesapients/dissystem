/**
 * Lore Versions Component - Version history with diff view
 */

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { History, RotateCcw, ChevronDown, ChevronUp, User, Plus, Minus, Edit3 } from 'lucide-react'
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

interface LoreVersionsProps {
  loreEntryId: string
  versions: Version[]
  currentVersion: number
}

// Simple diff algorithm
type DiffLine = {
  type: 'added' | 'removed' | 'unchanged'
  content: string
  lineNumber?: number
}

function computeDiff(oldText: string, newText: string): { lines: DiffLine[]; added: number; removed: number } {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  
  const lines: DiffLine[] = []
  let added = 0
  let removed = 0
  
  // Simple LCS-based diff
  const lcs = computeLCS(oldLines, newLines)
  
  let oldIdx = 0
  let newIdx = 0
  let lcsIdx = 0
  
  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (lcsIdx < lcs.length && oldIdx < oldLines.length && oldLines[oldIdx] === lcs[lcsIdx]) {
      if (newIdx < newLines.length && newLines[newIdx] === lcs[lcsIdx]) {
        // Unchanged line
        lines.push({ type: 'unchanged', content: oldLines[oldIdx] })
        oldIdx++
        newIdx++
        lcsIdx++
      } else if (newIdx < newLines.length) {
        // Added in new
        lines.push({ type: 'added', content: newLines[newIdx], lineNumber: newIdx + 1 })
        added++
        newIdx++
      } else {
        oldIdx++
      }
    } else if (oldIdx < oldLines.length && (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])) {
      // Removed from old
      lines.push({ type: 'removed', content: oldLines[oldIdx], lineNumber: oldIdx + 1 })
      removed++
      oldIdx++
    } else if (newIdx < newLines.length) {
      // Added in new
      lines.push({ type: 'added', content: newLines[newIdx], lineNumber: newIdx + 1 })
      added++
      newIdx++
    }
  }
  
  return { lines, added, removed }
}

function computeLCS(arr1: string[], arr2: string[]): string[] {
  const m = arr1.length
  const n = arr2.length
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  
  // Backtrack to find LCS
  const result: string[] = []
  let i = m, j = n
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      result.unshift(arr1[i - 1])
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }
  
  return result
}

export function LoreVersions({ loreEntryId, versions, currentVersion }: LoreVersionsProps) {
  const { locale } = useLocale()
  const router = useRouter()
  const [expandedVersions, setExpandedVersions] = useState<number[]>([])
  const [restoring, setRestoring] = useState<number | null>(null)
  const [showDiff, setShowDiff] = useState<Record<number, boolean>>({})
  
  const toggleExpand = (version: number) => {
    setExpandedVersions(prev => 
      prev.includes(version) 
        ? prev.filter(v => v !== version) 
        : [...prev, version]
    )
  }
  
  const toggleDiff = (version: number) => {
    setShowDiff(prev => ({ ...prev, [version]: !prev[version] }))
  }
  
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
  
  // Compute diffs between consecutive versions
  const diffs = useMemo(() => {
    const result: Record<number, { content: ReturnType<typeof computeDiff>; titleChanged: boolean; summaryChanged: boolean }> = {}
    
    for (let i = 0; i < versions.length - 1; i++) {
      const current = versions[i]
      const previous = versions[i + 1]
      
      result[current.version] = {
        content: computeDiff(previous.content, current.content),
        titleChanged: previous.title !== current.title,
        summaryChanged: previous.summary !== current.summary,
      }
    }
    
    return result
  }, [versions])
  
  if (versions.length === 0) {
    return null
  }
  
  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold text-white flex items-center gap-2 mb-6">
        <History size={18} strokeWidth={1.5} className="text-white/50" />
        {t('lore.versionHistory', locale)}
        <span className="text-white/40 font-normal">({versions.length})</span>
      </h3>
      
      <div className="space-y-3">
        {versions.map((version, index) => {
          const isCurrent = version.version === currentVersion
          const isExpanded = expandedVersions.includes(version.version)
          const isLatest = index === 0
          const isFirst = index === versions.length - 1
          const diff = diffs[version.version]
          const showingDiff = showDiff[version.version]
          
          return (
            <div 
              key={version.id}
              className={`rounded-xl border transition-all ${
                isCurrent 
                  ? 'bg-[#A89C6A]/10 border-[#A89C6A]/30' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isCurrent ? 'bg-[#A89C6A]/20 text-[#A89C6A]' : 'bg-white/10 text-white/50'
                }`}>
                  v{version.version}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white">{version.title}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-[#A89C6A]/20 text-[#A89C6A] rounded text-xs font-medium">
                        {t('lore.current', locale)}
                      </span>
                    )}
                    {isLatest && !isCurrent && (
                      <span className="px-2 py-0.5 bg-[#4F5A3C]/20 text-[#7A8A5C] rounded text-xs font-medium">
                        {t('lore.latest', locale)}
                      </span>
                    )}
                    {/* Change indicators */}
                    {diff && (
                      <div className="flex items-center gap-2">
                        {diff.titleChanged && (
                          <span className="px-2 py-0.5 bg-[#A89C6A]/20 text-[#A89C6A] rounded text-xs flex items-center gap-1">
                            <Edit3 size={10} />
                            {locale === 'ru' ? 'заголовок' : 'title'}
                          </span>
                        )}
                        {diff.content.added > 0 && (
                          <span className="px-2 py-0.5 bg-[#4F5A3C]/20 text-[#7A8A5C] rounded text-xs flex items-center gap-1">
                            <Plus size={10} />
                            {diff.content.added}
                          </span>
                        )}
                        {diff.content.removed > 0 && (
                          <span className="px-2 py-0.5 bg-[#5A1E1E]/20 text-[#9A4A4A] rounded text-xs flex items-center gap-1">
                            <Minus size={10} />
                            {diff.content.removed}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                    <span className="flex items-center gap-1">
                      <User size={12} strokeWidth={1.5} />
                      {version.changedBy.name}
                    </span>
                    <span>{formatRelativeTime(version.createdAt)}</span>
                    {version.changeNote && (
                      <span className="text-white/60">• {version.changeNote}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!isCurrent && (
                    <button
                      onClick={() => handleRestore(version.version)}
                      disabled={restoring !== null}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw size={12} strokeWidth={1.5} className={restoring === version.version ? 'animate-spin' : ''} />
                      {t('lore.restore', locale)}
                    </button>
                  )}
                  
                  <button
                    onClick={() => toggleExpand(version.version)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp size={16} strokeWidth={1.5} className="text-white/50" />
                    ) : (
                      <ChevronDown size={16} strokeWidth={1.5} className="text-white/50" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/10 pt-4">
                  {/* Diff toggle (if not first version) */}
                  {!isFirst && diff && (
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => toggleDiff(version.version)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          showingDiff 
                            ? 'bg-[#3E2F45]/30 text-[#8A6A9A]' 
                            : 'bg-white/10 text-white/60 hover:bg-white/15'
                        }`}
                      >
                        {showingDiff 
                          ? (locale === 'ru' ? 'Скрыть изменения' : 'Hide changes')
                          : (locale === 'ru' ? 'Показать изменения' : 'Show changes')
                        }
                      </button>
                      
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1 text-[#7A8A5C]">
                          <Plus size={12} />
                          {diff.content.added} {locale === 'ru' ? 'добавлено' : 'added'}
                        </span>
                        <span className="flex items-center gap-1 text-[#9A4A4A]">
                          <Minus size={12} />
                          {diff.content.removed} {locale === 'ru' ? 'удалено' : 'removed'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Title change */}
                  {showingDiff && diff?.titleChanged && (
                    <div className="mb-4">
                      <p className="text-xs text-white/40 mb-2">{locale === 'ru' ? 'Изменение заголовка' : 'Title change'}</p>
                      <div className="flex gap-2 text-sm">
                        <span className="px-2 py-1 bg-[#5A1E1E]/20 text-[#B07070] rounded line-through">
                          {versions[index + 1]?.title}
                        </span>
                        <span className="text-white/40">→</span>
                        <span className="px-2 py-1 bg-[#4F5A3C]/20 text-[#7A8A5C] rounded">
                          {version.title}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Summary change */}
                  {showingDiff && diff?.summaryChanged && (
                    <div className="mb-4">
                      <p className="text-xs text-white/40 mb-2">{locale === 'ru' ? 'Изменение описания' : 'Summary change'}</p>
                      <div className="space-y-1 text-sm">
                        {versions[index + 1]?.summary && (
                          <div className="px-2 py-1 bg-[#5A1E1E]/10 border-l-2 border-[#5A1E1E] text-[#B07070]/80">
                            - {versions[index + 1].summary}
                          </div>
                        )}
                        {version.summary && (
                          <div className="px-2 py-1 bg-[#4F5A3C]/20 border-l-2 border-[#4F5A3C] text-[#7A8A5C]">
                            + {version.summary}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Content diff or full content */}
                  <div>
                    <p className="text-xs text-white/40 mb-2">
                      {showingDiff && diff 
                        ? (locale === 'ru' ? 'Изменения в контенте' : 'Content changes')
                        : t('form.content', locale)
                      }
                    </p>
                    
                    {showingDiff && diff ? (
                      <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
                        {diff.content.lines.filter(l => l.type !== 'unchanged').length === 0 ? (
                          <p className="text-white/40 text-center py-4">
                            {locale === 'ru' ? 'Нет изменений в контенте' : 'No content changes'}
                          </p>
                        ) : (
                          diff.content.lines.map((line, i) => {
                            if (line.type === 'unchanged') {
                              return (
                                <div key={i} className="text-white/40 py-0.5 px-2">
                                  <span className="opacity-50 mr-3">  </span>
                                  {line.content || ' '}
                                </div>
                              )
                            }
                            if (line.type === 'added') {
                              return (
                                <div key={i} className="bg-[#4F5A3C]/20 text-[#7A8A5C] py-0.5 px-2 border-l-2 border-[#4F5A3C]">
                                  <span className="mr-3">+</span>
                                  {line.content || ' '}
                                </div>
                              )
                            }
                            if (line.type === 'removed') {
                              return (
                                <div key={i} className="bg-[#5A1E1E]/10 text-[#B07070] py-0.5 px-2 border-l-2 border-[#5A1E1E]">
                                  <span className="mr-3">-</span>
                                  {line.content || ' '}
                                </div>
                              )
                            }
                            return null
                          })
                        )}
                      </div>
                    ) : (
                      <div className="bg-black/20 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-white/70 whitespace-pre-wrap font-mono">
                          {version.content}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
