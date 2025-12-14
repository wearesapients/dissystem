/**
 * Custom Dark Fantasy Icons
 * Unique SVG icons for Desolates Production OS
 */

import { cn } from '@/lib/utils'

interface IconProps {
  size?: number
  strokeWidth?: number
  className?: string
}

const defaultProps = {
  size: 24,
  strokeWidth: 1.5,
}

// Dashboard - Mystical Eye
export function IconMysticalEye({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path 
        d="M12 5C7 5 3 9 2 12C3 15 7 19 12 19C17 19 21 15 22 12C21 9 17 5 12 5Z" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <path d="M12 2V4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 20V22" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4.5 4.5L6 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M18 18L19.5 19.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// Entities - Skull with Runes
export function IconSkullRune({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path 
        d="M12 2C8 2 5 5 5 9C5 11 5.5 12.5 6.5 14L6 18C6 19.5 7 21 9 21H10V19H14V21H15C17 21 18 19.5 18 18L17.5 14C18.5 12.5 19 11 19 9C19 5 16 2 12 2Z" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="15" cy="9" r="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M10 14H14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M11 14V16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M13 14V16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// Heroes - Gothic Crown
export function IconGothicCrown({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path 
        d="M3 18L4 8L8 12L12 4L16 12L20 8L21 18H3Z" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path d="M3 18H21V20H3V18Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
      <circle cx="8" cy="15" r="0.75" fill="currentColor" />
      <circle cx="16" cy="15" r="0.75" fill="currentColor" />
    </svg>
  )
}

// Units - Crossed Blades
export function IconCrossedBlades({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M4 4L14 14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4 4L6 6L4 8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 14L16 16L18 14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 14L20 20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      
      <path d="M20 4L10 14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M20 4L18 6L20 8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L8 16L6 14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L4 20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// Factions - Dark Tower
export function IconDarkTower({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M12 2L8 6V8L6 10V21H18V10L16 8V6L12 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 21V16H14V21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12H14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
      <path d="M6 21H18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// Spells - Rune Circle
export function IconRuneCircle({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M12 3V7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 17V21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M3 12H7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M17 12H21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 10L14 12L12 14L10 12L12 10Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  )
}

// Artifacts - Crystal Gem
export function IconCrystalGem({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M12 2L6 8L12 22L18 8L12 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8H18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 2V8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 8L8 8L12 22" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  )
}

// Locations - Mountain Moon
export function IconMountainMoon({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M3 20L9 10L13 16L17 12L21 20H3Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M18 4V3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M20 6H21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M18 8V9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// Thoughts - Ancient Scroll
export function IconAncientScroll({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M6 3C4.5 3 3 4 3 5.5C3 7 4.5 8 6 8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M6 3H18C19 3 20 4 20 5V17C20 18 19 19 18 19H8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8V19C6 20 7 21 8 21C9 21 10 20 10 19V8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 3V8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M13 8H17" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M13 12H17" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M13 16H15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// Concept Art - Mystical Brush / Eye
export function IconMysticBrush({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M18 2L8 12C7 13 7 15 8 16C9 17 11 17 12 16L22 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 10L18 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 16L4 20C3 21 2 21 2 20C2 19 3 18 4 18L6 16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="19" r="1" fill="currentColor" />
    </svg>
  )
}

// Lore - Grimoire
export function IconGrimoire({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M4 4C4 3 5 2 6 2H18C19 2 20 3 20 4V20C20 21 19 22 18 22H6C5 22 4 21 4 20V4Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <path d="M4 6H6C7 6 8 5 8 4V2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 8L10 12H14L12 16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={strokeWidth} opacity="0.3" />
    </svg>
  )
}

// Status icons
export function IconDraft({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M14 2H6C5 2 4 3 4 4V20C4 21 5 22 6 22H18C19 22 20 21 20 20V8L14 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13H16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 17H12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

export function IconPending({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconInProgress({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M12 6V12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M16 12H18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M6 12H8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

export function IconApproved({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconRejected({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M8 8L16 16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M16 8L8 16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// All icon - Grid
export function IconAllItems({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

// Object - Chest/Box
export function IconTreasureChest({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M4 10V18C4 19 5 20 6 20H18C19 20 20 19 20 18V10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10H22" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4 10V6C4 5 5 4 6 4H18C19 4 20 5 20 6V10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="2" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M12 16V18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// Activity Icons
export function IconSparkle({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="5" r="1" fill="currentColor" />
      <circle cx="5" cy="19" r="1" fill="currentColor" />
    </svg>
  )
}

export function IconQuill({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M20 2C14 2 10 6 8 10L6 14L4 16L6 18L8 20L10 18L14 16C18 14 22 10 22 4C22 3 21 2 20 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 22L6 18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 14L14 10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

export function IconStatusChange({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M8 12H16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M13 9L16 12L13 15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconComment({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M4 4H20C21 4 22 5 22 6V16C22 17 21 18 20 18H8L4 22V6C4 5 5 4 6 4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10H16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 14H12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

export function IconTrash({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M4 6H20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 6V4C10 3 11 2 12 2C13 2 14 3 14 4V6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6V20C6 21 7 22 8 22H16C17 22 18 21 18 20V6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10V18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M14 10V18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

export function IconGitBranch({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="18" cy="10" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M6 9V15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M6 9C6 9 6 10 8 10H15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Onboarding - Open Book with Compass
export function IconOnboarding({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M12 4C12 4 8 2 4 3V19C8 18 12 20 12 20C12 20 16 18 20 19V3C16 2 12 4 12 4Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4V20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M12 8V9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 13V14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M9 11H10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M14 11H15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// Design System - Palette
export function IconPalette({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C13 22 14 21 14 20C14 19.5 13.8 19.1 13.5 18.8C13.2 18.5 13 18.1 13 17.5C13 16.5 14 15.5 15 15.5H17C19.8 15.5 22 13.3 22 10.5C22 5.8 17.5 2 12 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
      <circle cx="16.5" cy="11.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

// Game Files - Folder with Game Controller
export function IconGameFiles({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M4 4H10L12 6H20C21 6 22 7 22 8V18C22 19 21 20 20 20H4C3 20 2 19 2 18V6C2 5 3 4 4 4Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13H11" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 12V14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="14" cy="14" r="0.5" fill="currentColor" />
      <circle cx="16" cy="12" r="0.5" fill="currentColor" />
    </svg>
  )
}

// Guidelines - Scroll with Checkmark
export function IconGuidelines({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M14 2H6C5 2 4 3 4 4V20C4 21 5 22 6 22H18C19 22 20 21 20 20V8L14 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13L11 15L15 11" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Tools - Wrench and Gear
export function IconTools({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M12 2V4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M12 20V22" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M2 12H4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M20 12H22" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M4.93 19.07L6.34 17.66" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// References - Lightbulb
export function IconReferences({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 18 9 19 10 19H14C15 19 16 18 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21H15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 17V19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M14 17V19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// ============================================
// UNITS MODULE ICONS
// ============================================

// Units Section - Sword & Shield
export function IconSwords({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M14.5 17.5L3 6V3H6L17.5 14.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 19L19 13" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 3L21 6L19.5 7.5L16.5 4.5L18 3Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Melee Unit - Sword
export function IconMeleeUnit({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M14.5 17.5L3 6V3H6L17.5 14.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 19L19 13" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

// Ranged Unit - Bow
export function IconRangedUnit({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M6 3C6 3 3 6 3 12C3 18 6 21 6 21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 3L6 21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M6 12L21 12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M18 9L21 12L18 15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10L6 12L10 14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Mage Unit - Staff
export function IconMageUnit({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M12 22V8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="12" cy="5" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M12 2V3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M9 5H10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M14 5H15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M8 12H16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 16H14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

// Support Unit - Heart with Shield
export function IconSupportUnit({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn('', className)}>
      <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.09C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 14 21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <path d="M12 6L9 9L12 22L15 9L12 6Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9H15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

