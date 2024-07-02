'use server';
import prisma from '@/lib/db/prisma';
import {
  CreateTransaction,
  UpdateTransaction,
  type GetTransactionsInput,
  type GetTransactionsResponse
} from "@/types/transactions.type";
import { AssertionError } from 'assert';

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
async function getTransactionsByGroupId({ groupId, cursor, direction, isFirstFetch }: GetTransactionsInput) :
  Promise<GetTransactionsResponse> 
{
  const TAKE_DEFAULT = 2;
  try {
    const transactions = await prisma.transactions.findMany({
      include: {
        transactionDetails: true
      },
      where: {
        groupId: groupId,
        paidAt: direction === 'next' ? {
          lte: new Date(cursor)
        } : {
          gt: new Date(cursor)
        }
      },
      orderBy: {
          paidAt: 'desc'
      },
      take: direction === 'next' ? TAKE_DEFAULT : TAKE_DEFAULT * -1,
      skip: isFirstFetch ? 0 : direction === 'next' ? 1 : 0
    });

    if (!transactions || transactions.length === 0) return { transactions: [], cursor: { next: undefined, prev: undefined, direction: direction } };
    transactions.map(transaction => {
      return transaction.amount = transaction.amount < 0 ? -1 * transaction.amount : transaction.amount;
    });

    return {
      transactions, cursor: {
        next: transactions.length < TAKE_DEFAULT ? undefined : transactions[transactions.length - 1].paidAt.toISOString(),
        prev: transactions.length < TAKE_DEFAULT ? undefined : transactions[0].paidAt.toISOString(),
        direction: direction
      }
    }
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
        amount: -1 * data.amount,
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
      amount: -1 * data.amount,
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
    const isUserCreatedBy = transaction?.createdById === userId;

    if (!isUserCreatedBy && !isUserInvolved) {
      throw new AssertionError({message: "You are not involved in transaction"});
    }
    // Delete transaction
    await prisma.transactions.delete({
      where: {
        id: transactionId
      }
    });
  }
  catch (e) {
    if (e instanceof AssertionError) {
      throw new Error(e.message);
    }
    console.error(e);
    throw new Error("Failed to delete transaction");
  }
}

type MemberBalanceByGroupQueryResult = {
  groupName: string;
  userId: string;
  userName: string;
  lent: number;
  spent: number;
  balance: number;
}[]

type GroupBalanceDetails = {
  groupName: string;
  users: {
    userId: string;
    userName: string;
    lent: number;
    spent: number;
    balance: number;
  }[]
}


async function getGroupBalanceDetails(groupId: string, userId: string) : Promise<GroupBalanceDetails> {
  try {
    const isUserInGroup = await prisma.memberships.findFirst({
      include: {
        group: {
          select: {
            name: true
          }
        }
      },
      where: {
        groupId: groupId,
        userId: userId
      }
    });
    if (!isUserInGroup) throw new Error("User not in group");
    const result : MemberBalanceByGroupQueryResult = await prisma.$queryRaw`
      WITH groupMembers AS (
        SELECT userId, u.name as userName
        FROM Memberships as m
        INNER JOIN
        (SELECT id, name
          FROM Users) AS u
        ON userId = u.id
        WHERE groupId = ${groupId}
      ),
      lent AS (
        SELECT paidById as userId, -1 * SUM(amount) AS lent, 0 AS spent
        FROM Transactions as t
        WHERE t.groupId = ${groupId}
        GROUP BY t.groupId, paidById
      ),
      spent AS (
        SELECT userId, 0 AS lent, -1 * SUM(amount) AS spent
        FROM TransactionDetails as td
        INNER JOIN 
          (SELECT id, groupId
          FROM Transactions as t
          WHERE t.groupId = ${groupId}) AS t
        ON transactionId = t.id
        GROUP BY t.groupId, userId
      ) 
      SELECT combined.userId, userName, SUM(lent) AS lent, SUM(spent) AS spent, SUM(lent) + SUM(spent) AS balance
      FROM (
        SELECT * FROM lent
        UNION ALL
        SELECT * FROM spent
      ) AS combined
      INNER JOIN
        (SELECT userId, userName
        FROM groupMembers) AS g
      ON combined.userId = g.userId
      GROUP BY combined.userId;`
    if (!result) throw new AssertionError({message: "No amount found"});
    const groupBalanceDetails : GroupBalanceDetails = {
      groupName: isUserInGroup.group.name,
      users: result.map(row => {
        return {
          userId: row.userId,
          userName: row.userName,
          lent: row.lent,
          spent: row.spent,
          balance: row.balance
        }
      })
    };

    return groupBalanceDetails;
  }
  catch (e) {
    if (e instanceof AssertionError) {
      throw new Error(e.message);
    }
    console.error(e);
    throw new Error("Failed to get amount spent");
  }
}

type UserBalanceByGroupQueryResult = {
  groupId: string;
  groupName: string;
  lent: number;
  spent: number;
  balance: number;
}[]

type BalancesByUserGroups = {
  [groupId: string]: {
    groupName: string;
    lent: number;
    spent: number;
    balance: number;
  }
}

async function getBalancesByUserGroups(userId: string) : Promise<BalancesByUserGroups> {
  try {
    const result : UserBalanceByGroupQueryResult = await prisma.$queryRaw`
      WITH groupIds AS (
        SELECT DISTINCT groupId, g.name
        FROM Memberships
        INNER JOIN
        (SELECT id, name
          FROM Groups) AS g
        ON groupId = g.id
        WHERE userId = ${userId}
      ),
      lent AS (
        SELECT t.groupId, -1 * SUM(amount) AS lent, 0 AS spent
        FROM Transactions as t
        WHERE t.groupId IN (SELECT groupId FROM groupIds)
        AND paidById = ${userId}
        GROUP BY t.groupId
      ),
      spent AS (
        SELECT t.groupId, 0 AS lent, -1 * SUM(amount) AS spent
        FROM TransactionDetails as td
        INNER JOIN 
          (SELECT id, groupId
          FROM Transactions as t
          WHERE t.groupId IN (SELECT groupId FROM groupIds)) AS t
        ON transactionId = t.id
        WHERE userId = ${userId}
        GROUP BY t.groupId
      )
      SELECT combined.groupId, g.name as groupName, SUM(lent) AS lent, SUM(spent) AS spent, SUM(lent) + SUM(spent) AS balance
      FROM (
        SELECT * FROM lent
        UNION ALL
        SELECT * FROM spent
      ) AS combined
      INNER JOIN
        (SELECT groupId, name
        FROM groupIds) AS g
      ON combined.groupId = g.groupId
      GROUP BY combined.groupId, g.name;`
    if (!result) throw new Error("No amount found");

    const userGroupsBalances : BalancesByUserGroups = {};
    result.forEach((row) => {
      userGroupsBalances[row.groupId] = row;
    });
    return userGroupsBalances;
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
  getTransactionsByGroupId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByUserIdAndDate,
  getGroupBalanceDetails,
  getBalancesByUserGroups
}