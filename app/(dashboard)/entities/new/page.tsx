/**
 * New Entity Page
 */

import { EntityForm } from '../components/entity-form'
import { NewEntityHeader } from './header'
import { requireModuleEdit } from '@/lib/auth/require-module-access'

export default async function NewEntityPage() {
  // Check edit permission
  await requireModuleEdit('entities')
  
  return (
    <div className="animate-in max-w-3xl mx-auto">
      <NewEntityHeader />
      <EntityForm />
    </div>
  )
}

