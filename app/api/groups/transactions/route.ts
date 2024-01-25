import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/lib/prisma';
import { 
  type TransactionWithDetails
} from "@/types/model/transactions";
import { sendErrorResponse } from "@/app/api/error-response";

type GETResponseType = NextResponse<{data: TransactionWithDetails[]} | undefined | null>

/**
 * GET /api/transactions route
 * This route fetches the transactions details for a given group
 * using pagination
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @urlParam id - The id of the group
 * 
 * @response 200 - The transactions are fetched
 * @response 404 - No transactions found or group not found
 * @response 500 - Server error
 */
export async function GET(request: NextRequest):
  Promise<GETResponseType> {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id") as string;
    const cursor = parseInt(searchParams.get("cursor") as string);
    const transactions = await prisma.transactions.findMany({
      where: {
        groupId: id
      },
      include: {
        transactionDetails: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      cursor: cursor ? {
        id: cursor
      } : undefined,
      skip: cursor ? 1 : undefined
    });
    if (!transactions) throw new Error("No transactions found");
    return NextResponse.json({ data: transactions }, { status: 200 });
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}
