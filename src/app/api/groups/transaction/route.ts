import { NextRequest, NextResponse } from 'next/server'

import { getTransactionByIdService } from "@/server/service/transactions.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const transactionId = parseInt(searchParams.get('transactionId') as string)

  const response = await getTransactionByIdService(transactionId)
  if (!response.success) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }

  return NextResponse.json(response.data)
}