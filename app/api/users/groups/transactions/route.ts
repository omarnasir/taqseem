import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/_lib/db/prisma';
import { 
  type TransactionWithDetails
} from "@/app/_types/model/transactions";
import { sendErrorResponse } from "@/app/api/error-response";

type GETResponseType = NextResponse<{data: TransactionWithDetails[]} | undefined | null>

/**
 * GET /api/users/groups/transactions route
 * This route fetches the transactions details for a given group by user id
 * using pagination
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @queryParam groupId - The id of the group
 * @queryParam userId - The id of the user
 * @queryParam cursor - The cursor for pagination
 * 
 * @response 200 - The transactions are fetched
 * @response 404 - No transactions found or group not found
 * @response 500 - Server error
 */
export async function GET(request: NextRequest):
  Promise<GETResponseType> {
  try {
    const searchParams = new URL(request.url).searchParams;
    const groupId = searchParams.get("groupId") as string;
    const userId = searchParams.get("userId") as string;
    const cursor = parseInt(searchParams.get("cursor") as string);
    const transactions = await prisma.transactions.findMany({
      where: {
        groupId: groupId,
        transactionDetails: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        transactionDetails: true
      },
      orderBy: {
        paidAt: 'desc'
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
