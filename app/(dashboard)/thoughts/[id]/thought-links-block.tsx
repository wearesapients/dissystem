/**
 * Thought Links Block - Display links and references
 */

'use client'

import { useLocale } from '@/lib/locale-context'
import { Globe, ExternalLink } from 'lucide-react'

interface Props {
  links: string[]
}

export function ThoughtLinksBlock({ links }: Props) {
  const { locale } = useLocale()
  
  if (!links || links.length === 0) {
    return null
  }
  
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
        <Globe size={14} strokeWidth={1.5} className="text-[#8A6A9A]" />
        {locale === 'ru' ? 'Ссылки и референсы' : 'Links & References'}
      </h3>
      <div className="space-y-2">
        {links.map((link, index) => {
          let displayUrl = link
          try {
            const url = new URL(link)
            displayUrl = url.hostname + (url.pathname !== '/' ? url.pathname : '')
          } catch {
            // Keep original
          }
          
          return (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-[#8A6A9A]/10 border border-[#8A6A9A]/20 rounded-xl hover:bg-[#8A6A9A]/15 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#8A6A9A]/20 flex items-center justify-center flex-shrink-0">
                <ExternalLink size={14} strokeWidth={1.5} className="text-[#8A6A9A]" />
              </div>
              <span className="flex-1 text-sm text-white/70 group-hover:text-white truncate transition-colors">
                {displayUrl}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

