import { NextRequest, NextResponse } from 'next/server'

import { getActivityService } from "@/server/service/activities.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const groupIds = searchParams.get('groupIds') ? (searchParams.get('groupIds') as string).split(',') as string[] : []
  const cursor = searchParams.get('cursor') ? parseInt(searchParams.get('cursor') as string) : undefined

  const response = await getActivityService({groupIds, cursor})

  if (!response.success) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }

  return NextResponse.json(response.data)
}