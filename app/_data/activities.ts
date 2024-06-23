'use server';
import prisma from '@/app/_lib/db/prisma';
import {
  type ActivityGetArgs,
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

async function getActivitiesByGroupIds(groupIds: string[], cursor: number | undefined): 
Promise<{ activities: ActivityGetArgs[] | [], cursor: number | undefined }> {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        createdBy: {
          select: {
            name: true
          }
        },
        transaction: {
          select: {
            name: true,
            isSettlement: true,
            group: {
              select: {
                name: true,
              }
            }
          }
        }
      },
      where: {
        groupId: {
          in: groupIds
        }
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
    if (!activities || activities.length === 0) return { activities: [], cursor: undefined };
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