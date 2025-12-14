/**
 * Unit Export API
 * GET - export unit in game-ready JSON format
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getUnitForExport } from '@/lib/units/service'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    const { id } = await params
    const exportData = await getUnitForExport(id)
    
    if (!exportData) {
      return NextResponse.json({ error: 'Юнит не найден' }, { status: 404 })
    }
    
    return NextResponse.json(exportData)
  } catch (error) {
    console.error('Export unit error:', error)
    return NextResponse.json({ error: 'Ошибка экспорта юнита' }, { status: 500 })
  }
}

