'use server';
import prisma from '@/app/_lib/db/prisma';
import {
  type TransactionWithDetails
} from "@/app/_types/model/transactions";


type ActivitiesByUserId = Pick<TransactionWithDetails, 'id' | 'name' | 'category' | 'createdAt' | 'createdById'> & {
  transactionDetails: {
    amount: number;
    user: {
      id: string;
      name: string;
    }
  }[]
};

async function getActivitiesByUserId(userId: string,  cursor: number | undefined): 
  Promise<{ activities: ActivitiesByUserId[], cursor: number | undefined }> {
  try {
    const userActivity = await prisma.transactions.findMany({
      where: {
        transactionDetails: {
          some: {
            userId: userId
          }
        }
      },
      select: {
        id: true,
        name: true,
        category: true,
        createdAt: true,
        createdById: true,
        transactionDetails: {
          select: {
            amount: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      cursor: cursor ? {
        id: cursor
      } : undefined,
      skip: cursor ? 1 : undefined
    });
    if (!userActivity || userActivity.length === 0) throw new Error("No transactions found");
    return { activities: userActivity, cursor: userActivity[userActivity.length - 1].id };
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get transactions");
  }
}


export {
  getActivitiesByUserId,
  type ActivitiesByUserId
};