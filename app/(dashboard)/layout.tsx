/**
 * Dashboard Layout with Responsive Sidebar
 */

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { LocaleProvider } from '@/lib/locale-context'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return (
    <LocaleProvider>
      <DashboardShell user={session.user}>
        {children}
      </DashboardShell>
    </LocaleProvider>
  )
}
