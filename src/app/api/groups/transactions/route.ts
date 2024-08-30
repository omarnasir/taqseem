import { NextRequest, NextResponse } from 'next/server'

import { getUserTransactionsByGroupIdService } from "@/server/service/transactions.service";
import { type GetTransactionsInput } from "@/types/transactions.type";


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const groupId = searchParams.get('groupId') as string
  const cursor = searchParams.get('cursor')
  const direction = searchParams.get('direction')

  if (!cursor || !groupId || !direction) {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }

  const response = await getUserTransactionsByGroupIdService({groupId, cursor, direction} as GetTransactionsInput)

  if (!response.success) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }

  return NextResponse.json(response.data)
}