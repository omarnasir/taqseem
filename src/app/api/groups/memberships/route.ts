import { NextRequest, NextResponse } from 'next/server'

import { getMembershipsByGroupIdService } from "@/server/service/memberships.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const groupId = searchParams.get('groupId') as string

  const response = await getMembershipsByGroupIdService(groupId)
  if (!response.success) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }

  return NextResponse.json(response.data)
}