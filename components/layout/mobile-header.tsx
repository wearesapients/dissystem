/**
 * Mobile Header with Hamburger Menu
 */

'use client'

import { Menu, X } from 'lucide-react'

interface MobileHeaderProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0B0B0C]/95 backdrop-blur-xl border-b border-[#6A665E]/15 z-50 flex items-center justify-between px-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img 
          src="/logo-icon.png" 
          alt="Desolates" 
          className="w-10 h-10 object-contain"
        />
        <span className="text-[#C7BFAE] font-semibold">Desolates</span>
      </div>
      
      {/* Hamburger Button */}
      <button
        onClick={onToggle}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#6A665E]/10 text-[#C7BFAE] hover:bg-[#6A665E]/20 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X size={22} strokeWidth={1.5} />
        ) : (
          <Menu size={22} strokeWidth={1.5} />
        )}
      </button>
    </header>
  )
}

