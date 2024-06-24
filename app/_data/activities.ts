'use server';
import prisma from '@/app/_lib/db/prisma';
import {Prisma} from '@prisma/client';
import {
  type Activity,
  type ActivityWithDetails,
  type CreateActivity,
} from "@/app/_types/model/activities";


async function createActivity(activity: CreateActivity): Promise<void> {
  try {
    await prisma.activity.create({
      data: {
        ...activity,
      }
    });
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to create activity");
  }
}

type ActivitiesByGroupIdsResult = Activity & {
  createdByName: string,
  transactionName: string,
  isSettlement: boolean,
  category: number,
  groupName: string,
  paidById: string,
};


async function getActivitiesByGroupIds(groupIds: string[], userId: string, cursor: number | undefined): 
  Promise<{ activities: ActivityWithDetails[] | [], cursor: number | undefined }> 
{
  try {
    const result : ActivitiesByGroupIdsResult[] = await prisma.$queryRaw`
      SELECT a.id,
            a.action,
            a.createdAt,
            a.transactionId,
            a.createdById,
            a.groupId,
            a.amount as "amount",
            u.name as "createdByName",
            t.name as "transactionName",
            t.isSettlement as "isSettlement",
            t.category as "category",
            t.paidById as "paidById",
            g.name as "groupName"
      FROM Activity a
      JOIN 
        (SELECT id, name, isSettlement, category, paidById
        FROM transactions
        WHERE groupId IN (${Prisma.join(groupIds)})
        AND (createdById = ${userId} OR 
            id IN (SELECT transactionId 
              FROM TransactionDetails 
              WHERE userId = ${userId}))) AS t
      ON a.transactionId = t.id
      JOIN groups g ON a.groupId = g.id
      JOIN users u ON a.createdById = u.id
      ORDER BY createdAt DESC
      LIMIT 20
      OFFSET ${cursor || 0}`;
    if (!result || result.length === 0) return { activities: [], cursor: undefined };

    const activities : ActivityWithDetails[]  = result.map((activity) => {
      return {
        id: activity.id,
        action: activity.action,
        createdAt: activity.createdAt,
        transactionId: activity.transactionId,
        groupId: activity.groupId,
        createdById: activity.createdById,
        amount: activity.amount,
        transaction: {
          name: activity.transactionName,
          isSettlement: activity.isSettlement,
          category: activity.category,
          paidById: activity.paidById,
          group: {
            name: activity.groupName,
          }
        },
        createdBy: {
          name: activity.createdByName,
        }
      };
    }
    );
    return { activities, cursor: cursor ? cursor + 20 : 20 };
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get activities");
  }
}


export {
  createActivity,
  getActivitiesByGroupIds
};