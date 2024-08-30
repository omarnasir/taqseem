import prisma from "@/lib/db/prisma";
import { UserBasicData } from "@/types/users.type";
import { type Membership } from "@/types/memberships.type";

/**
 * Get all memberships by group and user id.
 * The userId is required to ensure that the memberships are only returned if the user is part of the group.
 * @param groupId The group id.
 * @param userId The user id. Must be a member of the group.
 * @returns An array of user basic data.
 */
async function getMembershipsByGroupAndUserId({ groupId, userId }: Membership): Promise<UserBasicData[]> {
  try {
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
    const membershipsArray = memberships.map((user) => user.user);
    return membershipsArray;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get memberships");
  }
}

/**
 * Check if a user is a member of a group.
 * @param groupId The group id.
 * @param userId The user id.
 * @returns True if the user is a member of the group, false otherwise.
 */
async function isUserMemberOfGroup({ groupId, userId }: Membership): Promise<boolean> {
  try {
    const membership = await prisma.memberships.findFirst({
      where: {
        userId: userId,
        groupId: groupId
      }
    });
    return membership ? true : false;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to check membership");
  }
}


/**
 * Create a new membership.
 * @param groupId The group id.
 * @param userId The user id.
 */
async function createMembership({ groupId, userId }: Membership): Promise<void> {
  try {
    await prisma.memberships.create({
      data: {
        groupId: groupId,
        userId: userId
      }
    });
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to create membership");
  }
}


/**
 * Delete a membership.
 * @param groupId 
 * @param userId 
 */
async function deleteMembership({ groupId, userId }: Membership): Promise<void> {
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
  isUserMemberOfGroup,
  getMembershipsByGroupAndUserId,
  createMembership,
  deleteMembership
};