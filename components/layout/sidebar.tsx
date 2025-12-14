/**
 * Sidebar Navigation - iOS Style with Expandable Submenus
 */

'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useLocale } from '@/lib/locale-context'
import { t } from '@/lib/i18n'
import { LogOut, Globe, ChevronDown, Bell, BellOff, Loader2 } from 'lucide-react'
import { Role } from '@prisma/client'
import { canViewModule, type Module } from '@/lib/auth/permissions'
import {
  IconMysticalEye,
  IconSkullRune,
  IconGothicCrown,
  IconCrossedBlades,
  IconDarkTower,
  IconRuneCircle,
  IconCrystalGem,
  IconMountainMoon,
  IconAncientScroll,
  IconMysticBrush,
  IconGrimoire,
  IconAllItems,
  IconDraft,
  IconPending,
  IconInProgress,
  IconApproved,
  IconRejected,
  IconTreasureChest,
  IconOnboarding,
  IconPalette,
  IconGameFiles,
  IconGuidelines,
  IconTools,
  IconReferences,
} from '@/components/icons/fantasy-icons'

// Icon type for navigation
type IconComponent = typeof IconMysticalEye

// Navigation item type
type NavItem = {
  key: string
  href: string
  icon: IconComponent
  module: Module // For permission checking
  submenu?: {
    labelKey: string
    href: string
    icon: IconComponent
  }[]
}

const navigation: NavItem[] = [
  { key: 'nav.dashboard', href: '/dashboard', icon: IconMysticalEye, module: 'dashboard' },
  { 
    key: 'nav.onboarding', 
    href: '/onboarding', 
    icon: IconOnboarding,
    module: 'onboarding',
    submenu: [
      { labelKey: 'nav.allOnboarding', href: '/onboarding', icon: IconAllItems },
      { labelKey: 'nav.onboardingDesignSystem', href: '/onboarding?category=DESIGN_SYSTEM', icon: IconPalette },
      { labelKey: 'nav.onboardingGameFiles', href: '/onboarding?category=GAME_FILES', icon: IconGameFiles },
      { labelKey: 'nav.onboardingGuidelines', href: '/onboarding?category=GUIDELINES', icon: IconGuidelines },
      { labelKey: 'nav.onboardingTools', href: '/onboarding?category=TOOLS', icon: IconTools },
      { labelKey: 'nav.onboardingReferences', href: '/onboarding?category=REFERENCES', icon: IconReferences },
    ]
  },
  { 
    key: 'nav.entities', 
    href: '/entities', 
    icon: IconSkullRune,
    module: 'entities',
    submenu: [
      { labelKey: 'nav.allEntities', href: '/entities', icon: IconAllItems },
      { labelKey: 'nav.heroes', href: '/entities?type=HERO', icon: IconGothicCrown },
      { labelKey: 'nav.units', href: '/units', icon: IconCrossedBlades },
      { labelKey: 'nav.factions', href: '/entities?type=FACTION', icon: IconDarkTower },
      { labelKey: 'nav.spells', href: '/entities?type=SPELL', icon: IconRuneCircle },
      { labelKey: 'nav.artifacts', href: '/entities?type=ARTIFACT', icon: IconCrystalGem },
      { labelKey: 'nav.locations', href: '/entities?type=LOCATION', icon: IconMountainMoon },
    ]
  },
  { 
    key: 'nav.thoughts', 
    href: '/thoughts', 
    icon: IconAncientScroll,
    module: 'thoughts',
    submenu: [
      { labelKey: 'nav.allThoughts', href: '/thoughts', icon: IconAllItems },
      { labelKey: 'nav.heroes', href: '/thoughts?entityType=HERO', icon: IconGothicCrown },
      { labelKey: 'nav.units', href: '/thoughts?entityType=UNIT', icon: IconCrossedBlades },
      { labelKey: 'nav.factions', href: '/thoughts?entityType=FACTION', icon: IconDarkTower },
      { labelKey: 'nav.spells', href: '/thoughts?entityType=SPELL', icon: IconRuneCircle },
      { labelKey: 'nav.artifacts', href: '/thoughts?entityType=ARTIFACT', icon: IconCrystalGem },
      { labelKey: 'nav.locations', href: '/thoughts?entityType=LOCATION', icon: IconMountainMoon },
      { labelKey: 'nav.thoughtsOther', href: '/thoughts?unlinked=true', icon: IconTreasureChest },
    ]
  },
  { 
    key: 'nav.conceptArt', 
    href: '/concept-art', 
    icon: IconMysticBrush,
    module: 'concept-art',
    submenu: [
      { labelKey: 'nav.allArt', href: '/concept-art', icon: IconAllItems },
      { labelKey: 'nav.artHeroes', href: '/concept-art?entityType=HERO', icon: IconGothicCrown },
      { labelKey: 'nav.artUnits', href: '/concept-art?entityType=UNIT', icon: IconCrossedBlades },
      { labelKey: 'nav.artFactions', href: '/concept-art?entityType=FACTION', icon: IconDarkTower },
      { labelKey: 'nav.artSpells', href: '/concept-art?entityType=SPELL', icon: IconRuneCircle },
      { labelKey: 'nav.artArtifacts', href: '/concept-art?entityType=ARTIFACT', icon: IconCrystalGem },
      { labelKey: 'nav.artLocations', href: '/concept-art?entityType=LOCATION', icon: IconMountainMoon },
      { labelKey: 'nav.artObjects', href: '/concept-art?entityType=OBJECT', icon: IconTreasureChest },
    ]
  },
  { 
    key: 'nav.lore', 
    href: '/lore', 
    icon: IconGrimoire,
    module: 'lore',
    submenu: [
      { labelKey: 'nav.allLore', href: '/lore', icon: IconAllItems },
      { labelKey: 'nav.heroes', href: '/lore?entityType=HERO', icon: IconGothicCrown },
      { labelKey: 'nav.units', href: '/lore?entityType=UNIT', icon: IconCrossedBlades },
      { labelKey: 'nav.factions', href: '/lore?entityType=FACTION', icon: IconDarkTower },
      { labelKey: 'nav.spells', href: '/lore?entityType=SPELL', icon: IconRuneCircle },
      { labelKey: 'nav.artifacts', href: '/lore?entityType=ARTIFACT', icon: IconCrystalGem },
      { labelKey: 'nav.locations', href: '/lore?entityType=LOCATION', icon: IconMountainMoon },
      { labelKey: 'nav.loreOther', href: '/lore?unlinked=true', icon: IconTreasureChest },
    ]
  },
]

interface SidebarProps {
  user: {
    name: string
    email: string
    role: Role
  }
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { locale, setLocale } = useLocale()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  
  const currentSearch = searchParams.toString()
  const fullPath = currentSearch ? `${pathname}?${currentSearch}` : pathname
  
  // Filter navigation based on user role
  const visibleNavigation = navigation.filter(item => 
    canViewModule(user.role, item.module)
  )
  
  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }
  
  const handleLogoClick = () => {
    window.location.href = '/dashboard'
  }

  const handleNavClick = () => {
    // Close mobile menu when navigating
    if (onClose) onClose()
  }
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        'fixed left-0 top-0 bottom-0 w-64 bg-[#0B0B0C]/95 backdrop-blur-xl border-r border-[#6A665E]/15 flex flex-col z-50 transition-transform duration-300',
        // Mobile: slide in/out
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
      {/* Logo Section */}
      <div className="px-3 pt-4 pb-2">
        <button 
          onClick={handleLogoClick}
          className="w-full flex justify-center group cursor-pointer"
        >
          <img 
            src="/logo-icon.png" 
            alt="Desolates" 
            className="w-48 h-48 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all"
          />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto border-t border-[#6A665E]/10 pt-4">
        {visibleNavigation.map(item => {
          const isActive = pathname.startsWith(item.href.split('?')[0])
          const Icon = item.icon
          const hasSubmenu = item.submenu && item.submenu.length > 0
          const isExpanded = expandedMenus.includes(item.key)
          
          return (
            <div key={item.key}>
              {hasSubmenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className={cn(
                      'sidebar-link w-full justify-between',
                      isActive && 'active'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        size={20} 
                        strokeWidth={1.5}
                        className={cn(
                          'transition-colors',
                          isActive ? 'text-[#C7BFAE]' : 'text-[#C7BFAE]/50'
                        )}
                      />
                      <span>{t(item.key, locale)}</span>
                    </div>
                    <ChevronDown 
                      size={16} 
                      strokeWidth={1.5}
                      className={cn(
                        'text-[#C7BFAE]/30 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                  
                  {/* Submenu */}
                  <div className={cn(
                    'overflow-hidden transition-all duration-200',
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}>
                    <div className="ml-4 mt-1 space-y-0.5 border-l border-[#6A665E]/15 pl-3">
                      {item.submenu!.map(sub => {
                        const SubIcon = sub.icon
                        // Check if this submenu item is active
                        const subBasePath = sub.href.split('?')[0]
                        const isSubActive = fullPath === sub.href || 
                          (sub.href === subBasePath && pathname === subBasePath && !currentSearch)
                        
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={handleNavClick}
                            className={cn(
                              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                              isSubActive
                                ? 'bg-[#6A665E]/20 text-[#C7BFAE]'
                                : 'text-[#C7BFAE]/50 hover:text-[#C7BFAE] hover:bg-[#6A665E]/10'
                            )}
                          >
                            <SubIcon size={15} strokeWidth={1.5} />
                            <span>{t(sub.labelKey, locale)}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn('sidebar-link', isActive && 'active')}
                >
                  <Icon 
                    size={20} 
                    strokeWidth={1.5}
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-[#C7BFAE]' : 'text-[#C7BFAE]/50'
                    )}
                  />
                  <span>{t(item.key, locale)}</span>
                </Link>
              )}
            </div>
          )
        })}
      </nav>
      
      {/* User */}
      <div className="p-4 border-t border-[#6A665E]/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#6A665E]/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3E2F45] to-[#5A1E1E] flex items-center justify-center text-[#C7BFAE] font-medium">
            {user.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#C7BFAE] truncate">{user.name}</p>
            <p className="text-xs text-[#C7BFAE]/40 truncate">{user.email}</p>
          </div>
        </div>
        
        {/* Bottom actions */}
        <div className="mt-3 flex items-center justify-between gap-1">
          {/* Language Switcher */}
          <button
            onClick={() => setLocale(locale === 'en' ? 'ru' : 'en')}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-[#C7BFAE]/40 hover:text-[#C7BFAE]/70 hover:bg-[#6A665E]/10 transition-all"
          >
            <Globe size={14} strokeWidth={1.5} />
            <span className="uppercase font-medium">{locale}</span>
          </button>
          
          {/* Push Notifications */}
          <PushNotificationButton />
          
          {/* Logout */}
          <form action="/api/auth/logout" method="POST">
            <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-[#C7BFAE]/40 hover:text-[#C7BFAE]/70 hover:bg-[#6A665E]/10 transition-all">
              <LogOut size={14} strokeWidth={1.5} />
              <span>{t('nav.logout', locale)}</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
    </>
  )
}

// ============================================
// Push Notification Button (inline component)
// ============================================

function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt')

  useEffect(() => {
    checkPushSupport()
  }, [])

  const checkPushSupport = useCallback(async () => {
    if (typeof window === 'undefined') return
    
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPermission('unsupported')
      setIsLoading(false)
      return
    }

    const currentPermission = Notification.permission as 'prompt' | 'granted' | 'denied'
    setPermission(currentPermission)

    if (currentPermission === 'denied') {
      setIsLoading(false)
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error('[Push] Error checking subscription:', error)
    }
    
    setIsLoading(false)
  }, [])

  const togglePush = async () => {
    setIsLoading(true)

    try {
      if (isSubscribed) {
        // Unsubscribe
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        if (subscription) {
          await subscription.unsubscribe()
          await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: subscription.endpoint })
          })
        }
        setIsSubscribed(false)
      } else {
        // Subscribe
        await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready

        const permissionResult = await Notification.requestPermission()
        setPermission(permissionResult as 'prompt' | 'granted' | 'denied')

        if (permissionResult !== 'granted') {
          setIsLoading(false)
          return
        }

        const vapidResponse = await fetch('/api/push/vapid-key')
        if (!vapidResponse.ok) throw new Error('VAPID key not available')
        const { publicKey } = await vapidResponse.json()

        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        })

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: subscription.toJSON() })
        })

        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('[Push] Toggle error:', error)
    }

    setIsLoading(false)
  }

  if (permission === 'unsupported') return null

  return (
    <button
      onClick={togglePush}
      disabled={isLoading || permission === 'denied'}
      className={cn(
        'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all',
        isSubscribed
          ? 'text-[#A89C6A] bg-[#A89C6A]/10 hover:bg-[#A89C6A]/20'
          : permission === 'denied'
          ? 'text-[#C7BFAE]/20 cursor-not-allowed'
          : 'text-[#C7BFAE]/40 hover:text-[#C7BFAE]/70 hover:bg-[#6A665E]/10'
      )}
      title={
        permission === 'denied'
          ? 'Уведомления заблокированы'
          : isSubscribed
          ? 'Уведомления включены'
          : 'Включить уведомления'
      }
    >
      {isLoading ? (
        <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
      ) : isSubscribed ? (
        <Bell size={14} strokeWidth={1.5} />
      ) : (
        <BellOff size={14} strokeWidth={1.5} />
      )}
    </button>
  )
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray.buffer as ArrayBuffer
}
