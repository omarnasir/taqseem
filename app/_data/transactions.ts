'use server';
import prisma from '@/app/_lib/db/prisma';
import {
  CreateTransaction,
  UpdateTransaction,
  type TransactionWithDetails
} from "@/app/_types/model/transactions";


export type GroupedTransactions = {
  year: number,
  data: {
    month: number,
    monthName: string,
    data: TransactionWithDetails[]
  }[]
}[]


async function getTransactionsByGroupAndUserId(groupId: string, userId: string,
  cursor: number | undefined): Promise<GroupedTransactions> {
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
  try {
    let groupedTransactions: GroupedTransactions = []
    for (const transaction of transactions) {
      const date = new Date(transaction.paidAt);
      const month = date.getMonth()
      const year = date.getFullYear()
      if (!groupedTransactions.find((group) => group.year === year)) {
        groupedTransactions.push({ year, data: [] })
      }
      const groupIndex = groupedTransactions.findIndex((group) => group.year === year)
      if (!groupedTransactions[groupIndex].data.find((data) => data.month === month)) {
        groupedTransactions[groupIndex].data.push({ month, monthName: date.toLocaleString('default', { month: 'long' }), data: [] })
      }
      const monthIndex = groupedTransactions[groupIndex].data.findIndex((data) => data.month === month)
      groupedTransactions[groupIndex].data[monthIndex].data.push(transaction)
    }
    groupedTransactions.sort((a, b) => b.year - a.year)
    for (const group of groupedTransactions) {
      group.data.sort((a, b) => b.month - a.month)
    }
    return groupedTransactions;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get transactions");
  }
}


async function createTransaction(groupId: string, data: CreateTransaction) {
  const members = await prisma.memberships.findMany({
    where: {
      groupId: groupId
    },
    select: {
      userId: true
    }
  });
  // Validate if paidById, createdById and transactionDetails.userId are part of the group
  const paidByUser = members.some(member => member.userId === data.paidById);
  const createdByUser = members.some(member => member.userId === data.createdById);
  const transactionDetailsUser = data.transactionDetails?.every(detail => {
    return members.some(member => member.userId === detail.userId);
  });
  if (!paidByUser || !createdByUser || !transactionDetailsUser) {
    throw new Error("Incorrect user ids provided");
  }
  try {
    const newTransaction = await prisma.transactions.create({
      data: {
        ...data,
        notes: data.notes || '',
        transactionDetails: {
          create: data.transactionDetails?.map(detail => {
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
    return newTransaction;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to create transaction");
  }
}


async function updateTransaction(groupId: string, data: UpdateTransaction) {
  const members = await prisma.memberships.findMany({
    where: {
      groupId: groupId as string
    },
    select: {
      userId: true
    }
  });
  // Validate if paidById, createdById and transactionDetails.userId are part of the group
  const paidByUser = members.some(member => member.userId === data.paidById);
  const createdByUser = members.some(member => member.userId === data.createdById);
  const transactionDetailsUser = data.transactionDetails?.every(detail => {
    return members.some(member => member.userId === detail.userId);
  });
  if (!paidByUser || !createdByUser || !transactionDetailsUser) {
    throw new Error("Incorrect user ids provided");
  }
  try {
  // if the transactionId is provided, update the transaction
  const updatedTransaction = await prisma.transactions.update({
    where: {
      id: data.id as number
    },
    data: {
      ...data,
      notes: data.notes || '',
      transactionDetails: {
        deleteMany: {
          transactionId: data.id as number
        },
        create: data.transactionDetails?.map(detail => {
          return {
            userId: detail.userId as string,
            amount: detail.amount as number
          }
        })
      }
    },
    include: {
      transactionDetails: true
    }})
    return updatedTransaction;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to update transaction");
  }
}


async function deleteTransaction(userId: string, groupId: string, transactionId: number) {
  try {
    const transaction = await prisma.transactions.findUnique({
      where: {
        id: transactionId
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
      throw new Error("Transaction not found");
    }
    // Check if the requesting user is involved in the transaction
    const isUserInvolved = transaction?.transactionDetails?.some(detail => { 
      return detail.userId === userId;
    })
    if (!isUserInvolved && transaction.createdById !== userId) {
      throw new Error("User not involved in transaction");
    }
    // Delete transaction details
    const deleteRelation = prisma.transactionDetails.deleteMany({
      where: {
        transactionId: transactionId
      }
    });
    // Delete transaction
    const deleteTransaction = prisma.transactions.delete({
      where: {
        id: transactionId
      }
    });
    await prisma.$transaction([deleteRelation, deleteTransaction]);
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to delete transaction");
  }
}

export { 
  getTransactionsByGroupAndUserId,
  createTransaction,
  updateTransaction,
  deleteTransaction
};