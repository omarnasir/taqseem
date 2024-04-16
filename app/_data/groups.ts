'use server'
import prisma from "@/app/_lib/db/prisma";
import { CreateGroup, GroupDeleteArgs, GroupWithMembers } from "@/app/_types/model/groups";


async function createGroupByUserId(data: CreateGroup): Promise<void> {
  // check if group already exists
  const group = await prisma.groups.findFirst({
    where: {
      name: data.name,
      createdById: data.createdById!
    }
  });
  if (group) throw new Error("Group already exists");
  try {
    // create new group
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

async function deleteGroupById(data: GroupDeleteArgs): Promise<void> {
  const members = await prisma.memberships.findMany({
    select: {
      userId: true
    },
    where: {
      groupId: data.id,
      NOT: {
        userId: data.createdById
      }
    }
  });
  if (members.length > 0) {
    throw new Error("Group contains other users. Please remove those users from the group first.");
  }
  try {
    const deleteRelation = prisma.memberships.deleteMany({
      where: {
        groupId: data.id
      }
    });
    const deleteGroup = prisma.groups.delete({
      where: {
        id: data.id
      }
    });
    await prisma.$transaction([deleteRelation, deleteGroup]);
  }
  catch (e) {
    console.error(e);
    throw new Error("Error deleting group");
  }
}


async function getGroupById(groupId: string, userId: string): Promise<GroupWithMembers> {
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

export {
  createGroupByUserId,
  deleteGroupById,
  getGroupById
}