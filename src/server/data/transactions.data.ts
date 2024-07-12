'use server';
import prisma from '@/lib/db/prisma';
import { ActivityHistoryItem } from '@/types/activities.type';
import { GroupBalanceDetails } from '@/types/groups.type';
import {
  CreateTransaction,
  TransactionWithDetails,
  UpdateTransaction,
  type GetTransactionsInput,
  type GetTransactionsResponse
} from "@/types/transactions.type";
import { AssertionError } from 'assert';


async function getTransactionById(transactionId: number) : Promise<TransactionWithDetails>{
  try {
    const transaction = await prisma.transactions.findUnique({
      where: {
        id: transactionId
      },
      include: {
        transactionDetails: true
      }
    });
    if (!transaction) throw new Error("Transaction not found");
    return transaction;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get transaction");
  }
}


/**
 * Get transactions by group id.
 * 
 * The amount field is converted to positive if it is negative for UX purposes and to facilitate
 * the calculations of whether the user owes or is owed money.
 * 
 * We are using cursor pagination to fetch transactions. Since the frontend uses bi-directional pagination,
 * we need to fetch one extra transaction to determine if there are more transactions in the next page. 
 * For the previous direction, we simply use greaterthan operator to fetch the previous page.
 * If the returned cursor is undefined, the corresponding infinite query will set the hasNextPage to false, 
 * which we can use to disable the next/previous button.
 * 
 * @param groupId The group id
 * @param cursor Specified as the paidAt date of the last/first transaction in the current page.
 * @param direction The direction of the cursor. Either 'next' or 'prev'
 * @param isFirstFetch The first fetch happens in the server component and the skip value is set to 0.
 * @returns The transactions and the cursor object.
 * @throws Error if failed to get transactions
 */
async function getTransactionsByGroupId({ groupId, cursor, direction, isFirstFetch }: GetTransactionsInput) :
  Promise<GetTransactionsResponse> 
{
  const TAKE_DEFAULT = 25;
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

    if (!transactions || transactions.length === 0) 
      return { transactions: [], cursor: { next: undefined, prev: undefined, direction: direction } };
    transactions.map(transaction => {
      return transaction.amount = transaction.amount < 0 ? -1 * transaction.amount : transaction.amount;
    });

    return {
      transactions, cursor: {
        next: transactions.length < TAKE_DEFAULT ? undefined : transactions[transactions.length - 1].paidAt.toISOString(),
        prev: transactions.length < TAKE_DEFAULT ? undefined : transactions[0].paidAt.toISOString(),
      }
    }
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get transactions");
  }
}


async function createTransaction(userId: string, data: CreateTransaction) {
  try {
    const newTransaction = await prisma.transactions.create({
      data: {
        ...data,
        amount: -1 * data.amount,
        createdById: userId,
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
      },
    });
    return newTransaction;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to create transaction");
  }
}

/**
 * Update an existing transaction.
 * The transaction is updated only if the provided transactionId is found in the group and the user
 * requesting the update is part of the group.
 * @param userId
 * @param groupId
 * @param data
 * @throws Error if failed to update transaction
 * @returns The updated transaction
 * - If the requesting user is not part of the group, return failure with error message.
*/
async function updateTransaction(userId: string, groupId: string, data: UpdateTransaction) {
  try {
  const updatedTransaction = await prisma.transactions.update({
    where: {
      id: data.id as number,
      groupId: groupId,
      AND: {
        group: {
          users: {
            some: {
              userId: userId
            }
          }
        }
      }
    },
    data: {
      ...data,
      createdById: userId,
      amount: -1 * data.amount,
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

/**
 * Delete a transaction.
 * The transaction is deleted only if the provided transactionId is found in the group and the user
 * requesting the deletion is part of the group.
 * @param userId 
 * @param groupId 
 * @param transactionId 
 * @throws Error if failed to delete transaction
 */
async function deleteTransaction(userId: string, groupId: string, transactionId: number) {
  try {
    await prisma.transactions.delete({
      where: {
        id: transactionId,
        groupId: groupId,
        AND: {
          group: {
            users: {
              some: {
                userId: userId
              }
            }
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

/**
 * Get each member's balance for the provided group. The lent amount is non-zero for the user who 
 * paid for the transaction. The spent amount is non-zero for the user who was part of the transaction
 * but did not pay for it. The total balance is the sum of lent and spent.
 * 
 * The response will contain the amount lent, spent and total balance for each user.
 * 
 * Warning: This query only requires groupId as input. It does not implement validation whether
 * the requesting resource has access to the group. This should be implemented in the service layer.
 * @param groupId 
 * @returns 
 */
async function getGroupBalanceDetails(groupId: string) : Promise<GroupBalanceDetails> {
  try {
    const result : GroupBalanceDetails['users'] = await prisma.$queryRaw`
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


/**
 * Get the balances for the user in each group they are part of. The response is keyed by the groupId
 * and contains the amount lent, spent, current balance for the user in the group.
 * @param userId 
 * @returns 
 * @throws Error if failed to get amount spent
 */
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


/**
 * Get transactions by user id and date.
 * @param userId 
 * @param date 
 * @returns 
 * @throws Error if failed to get transactions
 */
async function getTransactionsByUserIdAndDate(userId: string, date: number) {
  try {
    console.log(userId, date)
    const transactions : ActivityHistoryItem[] = await prisma.$queryRaw`
    SELECT q.paidAt, SUM(q.getBack) as getBack, SUM(q.owe) as owe
    FROM 
      (SELECT DATE(ROUND(t.paidAt / 1000), 'auto') as paidAt,
              CAST(CASE WHEN t.paidById = ${userId} 
                THEN t.amount - td.userAmount
                ELSE 0
              END AS REAL )AS getBack,
              CAST(CASE WHEN t.paidById != ${userId}
                THEN td.userAmount
                ELSE 0
              END AS REAL) AS owe
      FROM Transactions as t
      INNER JOIN
        (SELECT transactionId, userId, amount as userAmount
        FROM TransactionDetails
        WHERE userId = ${userId}) AS td
      ON t.id = td.transactionId
      WHERE t.paidAt > ${date}) AS q
    GROUP BY q.paidAt
    ORDER BY q.paidAt ASC;`

    if (!transactions || transactions.length === 0 ) return null;
    return transactions;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get transactions");
  }
}


/**
 * Check if the user has transactions in the group.
 * @param groupId 
 * @param userId 
 * @returns 
 */
async function hasSomeTransactions(groupId: string, userId: string) {
  try {
    const transactions = await prisma.transactions.findFirst({
      where: {
        groupId: groupId,
        transactionDetails: {
          some: {
            userId: userId
          }
        }
      }
    });
    return transactions ? true : false;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to check transactions");
  }
}


export { 
  getTransactionById,
  getTransactionsByGroupId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByUserIdAndDate,
  getGroupBalanceDetails,
  getBalancesByUserGroups,
  hasSomeTransactions
}