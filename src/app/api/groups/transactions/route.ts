import { NextRequest, NextResponse } from 'next/server'

import { getUserTransactionsByGroupIdService } from "@/server/service/transactions.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const groupId = searchParams.get('groupId') as string
  const cursor = searchParams.get('cursor') ? parseInt(searchParams.get('cursor') as string) : undefined

  const response = await getUserTransactionsByGroupIdService(groupId, cursor)

  if (!response.success) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }

  return NextResponse.json(response.data)
}