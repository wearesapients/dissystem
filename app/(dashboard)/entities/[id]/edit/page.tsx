/**
 * Edit Entity Page
 */

import { notFound } from 'next/navigation'
import { getEntity } from '@/lib/entities/service'
import { EntityForm } from '../../components/entity-form'
import { EditEntityHeader } from './header'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEntityPage({ params }: PageProps) {
  const { id } = await params
  const entity = await getEntity(id)
  
  if (!entity) {
    notFound()
  }
  
  return (
    <div className="animate-in max-w-3xl mx-auto">
      <EditEntityHeader entityId={id} entityName={entity.name} />
      
      <EntityForm entity={{
        id: entity.id,
        name: entity.name,
        code: entity.code,
        type: entity.type,
        description: entity.description,
        shortDescription: entity.shortDescription,
        iconUrl: entity.iconUrl,
      }} />
    </div>
  )
}



