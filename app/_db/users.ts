'use server'
import prisma from "@/app/_lib/db/prisma";
import { GroupData } from "@/app/_types/model/groups";

export async function getGroupsByUserId(userId: string) : Promise<GroupData[]>{
  const userGroups = await prisma.memberships.findMany({
    select: {
      group: true
    },
    where: {
      userId: userId
    }
  });
  if (!userGroups) return [];
  const filteredUserGroups = userGroups.map((userGroup) => userGroup.group);
  return filteredUserGroups;
}