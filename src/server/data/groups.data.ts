'use server'
import prisma from "@/lib/db/prisma";
import { 
  type GroupData, 
  type CreateGroup, 
  type GroupWithMembers, 
  type GroupAndCreatedByID } from "@/types/groups.type";
import { type Membership } from "@/types/memberships.type";

/**
 * Get group by name and member id.
 * @param groupName 
 * @param memberId 
 * @returns
 */
async function getGroupByNameAndMemberId({ groupName, memberId }: { groupName: string, memberId: string }): Promise<GroupData | null>
{
  try {
    const group = await prisma.groups.findFirst({
      where: {
        name: groupName,
        users: {
          some: {
            userId: memberId
          }
        }
      }
    });
    return group;
  }
  catch (e) {
    console.error(e);
    throw new Error("Error fetching group");
  }
}

/**
 * Create group.
 * @param data 
 */
async function createGroupByUserId(data: CreateGroup): Promise<void> {
  try {
    await prisma.groups.create({
      data: {
        name: data.name,
        createdById: data.createdById!,
        users: {
          create: [
            {
              user: {
                connect: {
                  id: data.createdById!
                }
              }
            }
          ]
        }
      }
    });
  } catch (e) {
    console.error(e);
    throw new Error("Error creating group");
  }
}


/**
 * Delete group.
 *
 * The group is only deleted if the requesting user is the creator of the group. The relations defined by
 * the prisma schema are deleted along with the group as a cascade delete.
 * @param groupId 
 * @param createdById 
 * @returns
 */
async function deleteGroupById({ groupId, createdById }: GroupAndCreatedByID): Promise<void> {
  try {
    const deleteRelation = prisma.memberships.deleteMany({
      where: {
        groupId: groupId,
        group: {
          createdById: createdById
        }
      }
    });
    const deleteGroup = prisma.groups.delete({
      where: {
        id: groupId
      }
    });
    await prisma.$transaction([deleteRelation, deleteGroup]);
  }
  catch (e) {
    console.error(e);
    throw new Error("Error deleting group");
  }
}

/**
 * Get the number of members in a group other than the creator.
 * @param groupId 
 * @param createdById
 * @returns 
 */
async function getMemberCountExcludingCreatedById({ groupId, createdById }: GroupAndCreatedByID): Promise<number> {
  try {
    const count = await prisma.memberships.count({
      where: {
        groupId: groupId,
        NOT: {
          userId: createdById
        }
      }
    });
    return count;
  }
  catch (e) {
    console.error(e);
    throw new Error("Error fetching group members");
  }
}


/**
 * Get group by id.
 * 
 * The include object is filtered to only return the user id and name. This is to avoid returning the
 * user's email address.
 * 
 * The group is only returned if the requesting user is a member of the group.
 * @param groupId 
 * @param userId Must be a member of the group.
 * @returns Group with members.
 * @throws Error if the group is not found or the user is not a member of the group.
 */
async function getGroupById({ groupId, userId }: Membership ): Promise<GroupWithMembers> {
  const group = await prisma.groups.findUnique({
    include: {
      users: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    },
    where: {
      id: groupId,
      users: {
        some: {
          userId: userId
        }
      }
    }
  });
  if (!group) throw new Error("Group not found");
  const formattedGroup = {
    id: group.id,
    name: group.name,
    createdById: group.createdById,
    users: group.users.map(user => user.user)
  };
  return formattedGroup;
}


/**
 * Get groups by user id.
 * @param userId
 * @throws Error if no groups are found.
 */
async function getGroupsByUserId(userId: string) : Promise<GroupData[]>{
  const groups = await prisma.groups.findMany({
    where: {
      users: {
        some: {
          userId: userId
        }
      }
    }
  });
  if (!groups) throw new Error("No groups found");
  return groups;
}


/**
 * Check if the user is the owner of the group.
 * @param groupId 
 * @param userId
 * @returns 
 */
async function isGroupOwner({ groupId, createdById }: GroupAndCreatedByID): Promise<boolean> {
  try {
    const group = await prisma.groups.findFirst({
      where: {
        id: groupId,
        createdById: createdById
      }
    });
    return group ? true : false;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to check group ownership");
  }
}


export {
  getGroupByNameAndMemberId,
  createGroupByUserId,
  deleteGroupById,
  getMemberCountExcludingCreatedById,
  getGroupById,
  getGroupsByUserId,
  isGroupOwner
}