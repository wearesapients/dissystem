/**
 * Concept Art Empty State Component
 */

import Link from 'next/link'
import { Palette, Plus } from 'lucide-react'

export function ConceptArtEmptyState() {
  return (
    <div className="glass-card p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-[#8A6A9A]/10 flex items-center justify-center mx-auto mb-6">
        <Palette size={40} strokeWidth={1} className="text-[#8A6A9A]" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Нет концепт-артов</h3>
      <p className="text-white/50 mb-6 max-w-md mx-auto">
        Загрузите первый концепт-арт для визуализации идей проекта
      </p>
      <Link href="/concept-art/new" className="btn btn-primary inline-flex">
        <Plus size={18} strokeWidth={2} />
        Загрузить концепт
      </Link>
    </div>
  )
}


