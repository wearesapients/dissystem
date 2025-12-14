/**
 * Locale Context for Language Switching
 */

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale } from './i18n'

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  
  useEffect(() => {
    const saved = localStorage.getItem('sapients_locale') as Locale
    if (saved === 'ru' || saved === 'en') {
      setLocaleState(saved)
    }
  }, [])
  
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('sapients_locale', newLocale)
  }
  
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}


