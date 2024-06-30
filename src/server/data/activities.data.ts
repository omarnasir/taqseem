'use server';
import prisma from '@/lib/db/prisma';

import {
  type ActivityWithDetails,
  type CreateActivity,
} from "@/types/activities.type";


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

async function getActivitiesByGroupIds(groupIds: string[], userId: string, cursor?: number): 
  Promise<{ activities: ActivityWithDetails[] | [], cursor?: number }> 
{
  const TAKE_DEFAULT = 20;
  try {
    const result = await prisma.activity.findMany({
      select: {
        id: true,
        action: true,
        createdAt: true,
        transactionId: true,
        createdById: true,
        groupId: true,
        amount: true,
        group: {
          select: {
            name: true
          }
        },
        transaction: {
          select: {
            name: true,
            isSettlement: true,
            category: true,
            paidById: true,
            transactionDetails: {
              select: {
                userId: true
              }
            }
          }
        },
        createdBy: {
          select: {
            name: true
          }
        }
      },
      where: {
        groupId: {
            in: groupIds
        },
      },
      orderBy: {
        id: 'desc'
      },
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      take: TAKE_DEFAULT,
    });

    if (!result || result.length === 0) return { activities: [], cursor: undefined };
    const activities : ActivityWithDetails[]  = result.map((activity) => {
      return {
        ...activity,
        isInvolved: activity.transaction.transactionDetails.some(td => td.userId === userId),
      }
    });

    return { activities, cursor: activities[activities.length - 1].id };
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