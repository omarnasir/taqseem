'use server';
import prisma from '@/app/_lib/db/prisma';
import {
  CreateTransaction,
  UpdateTransaction,
  type TransactionWithDetails
} from "@/app/_types/model/transactions";

/**
 * Get transactions by group and user id.
 * This function is intended to be used in the service layer to display transactions
 * in the frontend for a specific user in a group.
 * The amount field is converted to positive if it is negative for UX purposes and to facilitate
 * the calculations of whether the user owes or is owed money.
 * @param groupId - The group id
 * @param userId 
 * @param cursor 
 * @returns 
 */
async function getTransactionsByGroupAndUserId(groupId: string, userId: string,
  cursor: number | undefined): Promise<{ transactions: TransactionWithDetails[] | [], cursor: number | undefined }> {
  try {
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
    if (!transactions || transactions.length === 0) return { transactions: [], cursor: undefined };
    transactions.map(transaction => {
      return transaction.amount = transaction.amount < 0 ? -1 * transaction.amount : transaction.amount;
    });
    return { transactions, cursor: transactions[transactions.length - 1].id }
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
        amount: data.amount > 0 ? -1 * data.amount : data.amount,
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
        transactionDetails: {
          select: {
            id: true,
            userId: true,
            amount: true
          }
        }
      }
    });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    // Check if the requesting user is involved in the transaction
    const isUserInvolved = transaction?.transactionDetails?.some(detail => { 
      return detail.userId === userId
    })
    const userAmount = transaction?.transactionDetails?.find(detail => detail.userId === userId)?.amount;
    if (!isUserInvolved || userAmount === (undefined || null || 0) ) {
      throw new Error("User not involved in transaction");
    }
    // Delete transaction
    await prisma.transactions.delete({
      where: {
        id: transactionId,
        transactionDetails: {
          some: {
            userId: userId
          }
        }
      }
    });
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to delete transaction");
  }
}

type MemberBalanceByGroupQueryResult = {
  groupId: string;
  groupName: string;
  userId: string;
  userName: string;
  lent: number;
  spent: number;
  balance: number;
}

type MemberBalanceByGroups = {
  [groupId: string]: {
    groupName: string;
    users: {
      userId: string;
      userName: string;
      lent: number;
      spent: number;
      balance: number;
    }[]
  }
}


async function getMembersBalancesByUserGroups(userId: string) : Promise<MemberBalanceByGroups> {
  try {
    const result : MemberBalanceByGroupQueryResult[] = await prisma.$queryRaw`
      WITH groupIds AS (
        SELECT DISTINCT groupId
        FROM Memberships
        WHERE userId = ${userId}
      ),
      groupMembers AS (
        SELECT groupId, g.name, userId, u.name as userName
        FROM Memberships as m
        INNER JOIN
        (SELECT id, name
          FROM Users) AS u
          ON userId = u.id
        INNER JOIN
        (SELECT id, name
          FROM Groups) AS g
          ON groupId = g.id
        WHERE m.groupId IN groupIds
      ),
      lent AS (
        SELECT t.groupId, paidById as userId, -1 * SUM(amount) AS lent, 0 AS spent
        FROM Transactions as t
        WHERE t.groupId IN groupIds
        GROUP BY t.groupId, paidById
      ),
      spent AS (
        SELECT t.groupId, userId, 0 AS lent, -1 * SUM(amount) AS spent
        FROM TransactionDetails as td
        INNER JOIN 
          (SELECT id, groupId
          FROM Transactions as t
          WHERE t.groupId IN groupIds) AS t
        ON transactionId = t.id
        GROUP BY t.groupId, userId
      ) 
      SELECT combined.groupId, combined.userId, name as groupName, userName, SUM(lent) AS lent, SUM(spent) AS spent, SUM(lent) + SUM(spent) AS balance
      FROM (
        SELECT * FROM lent
        UNION ALL
        SELECT * FROM spent
      ) AS combined
      INNER JOIN
        (SELECT groupId, name, userId, userName
        FROM groupMembers) AS g
      ON combined.groupId = g.groupId AND combined.userId = g.userId
      GROUP BY combined.groupId, combined.userId;`
    if (!result) throw new Error("No amount found");
    const memberBalancesByGroup : MemberBalanceByGroups = {};
    result.forEach((row) => {
      if (!memberBalancesByGroup[row.groupId]) {
        memberBalancesByGroup[row.groupId] = { groupName: row.groupName, users: [] };
      }
      const { groupId, groupName, ...rest } = row;
      memberBalancesByGroup[row.groupId].users.push(rest);
    });

    return memberBalancesByGroup;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get amount spent");
  }
}

async function getTransactionsByUserIdAndDate(userId: string, date: string) {
  const transactions = await prisma.transactions.findMany({
    where: {
      transactionDetails: {
        some: {
          userId: userId
        }
      },
      paidAt: {
        gte: new Date(date)
      }
    },
    include: {
      transactionDetails: true
    },
    orderBy: {
      paidAt: 'desc'
    }
  });
  if (!transactions || transactions.length === 0 ) throw new Error("No transactions found");
  try {
    return transactions;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get transactions");
  }
}

export { 
  getTransactionsByGroupAndUserId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByUserIdAndDate,
  getMembersBalancesByUserGroups,
  type MemberBalanceByGroups
}