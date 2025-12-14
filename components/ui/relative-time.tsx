/**
 * Relative Time Component
 * Displays time relative to now with hydration warning suppression
 */

'use client'

import { formatRelativeTime } from '@/lib/utils'

interface RelativeTimeProps {
  date: Date | string
  className?: string
}

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return (
    <span className={className} suppressHydrationWarning>
      {formatRelativeTime(dateObj)}
    </span>
  )
}



