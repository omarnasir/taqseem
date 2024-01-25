import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/lib/prisma';
import { 
  type CreateTransactionWithDetails,
  type TransactionDeleteArgs,
  type TransactionWithDetails
} from "@/types/model/transactions";
import { sendErrorResponse } from "@/app/api/error-response";

type GETResponseType = NextResponse<{data: TransactionWithDetails} | undefined | null>
type POSTResponseType = NextResponse<{ data: TransactionWithDetails } | undefined | null>

/**
 * GET /api/transactions route
 * This route fetches the details of a transaction
 * using pagination
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @urlParam id - The id of the transaction
 * 
 * @response 200 - The transaction is fetched
 * @response 404 - No transaction found
 * @response 500 - Server error
 */
export async function GET(request: NextRequest):
  Promise<GETResponseType> {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = parseInt(searchParams.get("id") as string);
    const transaction = await prisma.transactions.findUnique({
      where: {
        id: id
      },
      include: {
        transactionDetails: true
      }
    });
    if (!transaction) throw new Error("Transaction not found");
    return NextResponse.json({ data: transaction }, { status: 200 });
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}

/**
 * POST /api/transaction route
 * This route is used to create a new transaction
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @bodyParam body - The transaction details
 * 
 * @response 200 - The group is created
 * @response 409 - The group already exists
 * @response 500 - Server error
 */
export async function POST(request: NextRequest):
  Promise<POSTResponseType> {
  try {
    const body: CreateTransactionWithDetails = await request.json();
    // Fetch group members
    const members = await prisma.memberships.findMany({
      where: {
        groupId: body.groupId
      },
      select: {
        userId: true
      }
    });
    // Validate if paidById, createdById and transactionDetails.userId are part of the group
    const paidByUser = members.some(member => member.userId === body.paidById);
    const createdByUser = members.some(member => member.userId === body.createdById);
    const transactionDetailsUser = body.transactionDetails?.every(detail => {
      return members.some(member => member.userId === detail.userId);
    });
    if (!paidByUser || !createdByUser || !transactionDetailsUser) {
      return sendErrorResponse({ 
        statusText: "Incorrect user ids provided",
      });
    }
    // if the transactionId is not provided, create a new transaction
    if (body.id === undefined) {
      const newTransaction = await prisma.transactions.create({
        data: {
          name: body.name,
          category: body.category,
          subCategory: body.subCategory,
          notes: body.notes?.toString(),
          amount: body.amount,
          groupId: body.groupId,
          paidById: body.paidById,
          createdById: body.createdById,
          transactionDetails: {
            create: body.transactionDetails?.map(detail => {
              return {
                userId: detail.userId,
                amount: detail.amount
              }
            })
          }
        },
        include: {
          transactionDetails: true
        }
      });
      return NextResponse.json({ data: newTransaction }, { status: 200 });
    }
    else {
      // if the transactionId is provided, update the transaction
      const updatedTransaction = await prisma.transactions.update({
        where: {
          id: body.id
        },
        data: {
          name: body.name,
          category: body.category,
          subCategory: body.subCategory,
          notes: body.notes?.toString(),
          amount: body.amount,
          groupId: body.groupId,
          paidById: body.paidById,
          createdById: body.createdById,
          transactionDetails: {
            update: body.transactionDetails?.map(detail => {
              return {
                where: {
                  id: detail.id
                },
                data: {
                  userId: detail.userId,
                  amount: detail.amount
                }
              }
            })
          }
        },
        include: {
          transactionDetails: true
        }
      });
      return NextResponse.json({ data: updatedTransaction }, { status: 200 });
    }
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}

/**
 * DELETE /api/transactions route
 * This route is used to delete a transaction
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @bodyParam id - The id of the transaction
 * @bodyParam createdByID - The id of the user who belongs to the group
 * 
 * @response 200 - The transaction is deleted
 * @response 404 - The transaction not found
 * @response 500 - Server error
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body: TransactionDeleteArgs = await request.json();
    const transaction = await prisma.transactions.findUnique({
      where: {
        id: body.id
      },
      select: {
        createdById: true,
        transactionDetails: {
          select: {
            id: true,
            userId: true
          }
        }
      }
    });
    if (!transaction) {
      return sendErrorResponse({ 
        statusText: "Transaction not found",
      });
    }
    // Check if the requesting user is involved in the transaction
    const isUserInvolved = transaction?.transactionDetails?.some(detail => { 
      return detail.userId === body.userId;
    })
    if (!isUserInvolved && transaction.createdById !== body.userId) {
      return sendErrorResponse({ 
        statusText: "User not involved in transaction",
      });
    }
    // Delete transaction details
    const deleteDetails = prisma.transactionDetails.deleteMany({
      where: {
        transactionId: {
          in: transaction.transactionDetails.map(detail => detail.id)
        }
      }
    });
    // Delete transaction
    const deleteTransaction = prisma.transactions.delete({
      where: {
        id: body.id
      }
    });
    await prisma.$transaction([deleteDetails, deleteTransaction]);
    return NextResponse.json({ status: 200 });
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}