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

async function getActivitiesByUserId(userId: string): Promise<ActivitiesByUserId[]> {
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
      take: 20
    });
    if (!userActivity) throw new Error("No transactions found");
    return userActivity;
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