'use server'
import prisma from "@/app/_lib/db/prisma";
import { UserBasicData } from "../_types/model/users";


async function getMembershipsByGroupId(groupId: string, userId: string): Promise<UserBasicData[]> {
  const memberships = await prisma.memberships.findMany({
    select: {
      user: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    where: {
      groupId: groupId
    }
  });
  // check if user belongs to the group
  if (!memberships.find((membership) => membership.user.id === userId)) {
    throw new Error("Unauthorized");
  }
  if (!memberships) throw new Error("No users found");
  const membershipsArray = memberships.map((user) => user.user);
  return membershipsArray;
}

async function createMembership(userEmail: string, groupId: string): Promise<UserBasicData> {
  const user = await prisma.users.findUnique({
    select: {
      id: true,
      name: true,
    },
    where: {
      email: userEmail
    }
  });
  if (!user) throw new Error("User not found");
  const isMemberAlready = await prisma.memberships.findFirst({
    where: {
      groupId: groupId,
      userId: user.id
    }
  });
  if (isMemberAlready) throw new Error("User is already a member");
  // create new membership
  try {
    await prisma.memberships.create({
      data: {
        groupId: groupId,
        userId: user.id
      }
    });
    return user;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to create membership");
  }
}

async function deleteMembership(groupId: string, userId: string): Promise<void> {
  const isOwner = await prisma.groups.findFirst({
    where: {
      id: groupId,
      createdById: userId
    }
  });
  if (isOwner) throw new Error("Owner cannot be deleted");
  try {
    await prisma.memberships.delete({
      where: {
        userId_groupId: {
          groupId: groupId,
          userId: userId
        }
      }
    });
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to delete membership");
  }
}

export {
  getMembershipsByGroupId,
  createMembership,
  deleteMembership
};