import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/lib/prisma';
import { type GroupData } from "@/types/model/groups";
import { sendErrorResponse } from "@/types/base-api-response";


type GroupsApiResponseType = NextResponse & {
  group?: GroupData,
}

/**
 * GET /api/groups route
 * This route fetches the group details for a given group id
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @urlParam id - The groupId to search for
 * 
 * @response 200 - The group is found
 * @response 404 - The group is not found
 * @response 500 - Server error
 */
export async function GET(request: NextRequest):
  Promise<GroupsApiResponseType> {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id") as string;
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
        id: id
      }
    });
    if (!group) throw new Error("Group not found");
    const formattedGroup = {
      id: group.id,
      name: group.name,
      createdById: group.createdById,
      users: group.users.map(user => user.user)
    };
    return NextResponse.json(formattedGroup, { status: 200 });
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}

/**
 * POST /api/groups route
 * This route is used to create a new group
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @bodyParam id - The id of the group
 * @bodyParam name - The name of the group
 * 
 * @response 200 - The group is created
 * @response 409 - The group already exists
 * @response 500 - Server error
 */
export async function POST(request: NextRequest):
  Promise<GroupsApiResponseType> {
  try {
    const { id, name } = await request.json();
    // check if group name for this user already exists
    const group = await prisma.groups.findFirst({
      where: {
        name: name,
        createdById: id
      }
    });
    if (group) {
      return sendErrorResponse({ statusText: "Group already exists" });
    }
    // create new group
    const newGroup = await prisma.groups.create({
      data: {
        name: name,
        createdById: id,
        users: {
          create: [
            {
              user: {
                connect: {
                  id: id
                }
              }
            }
          ]
        }
      }
    });
    return NextResponse.json({ group: newGroup }, { status: 200 });
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}

/**
 * DELETE /api/groups route
 * This route is used to delete a group
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @bodyParam id - The id of the group
 * 
 * @response 200 - The group is deleted
 * @response 404 - The group is not found
 * @response 500 - Server error
 */
export async function DELETE(request: NextRequest):
  Promise<GroupsApiResponseType> {
  try {
    const { groupId, userId } = await request.json();
    const members = await prisma.memberships.findMany({
      select: {
        userId: true
      },
      where: {
        groupId: groupId,
        NOT: {
          userId: userId
        }
      }
    });
    if (members.length > 0) {
      return sendErrorResponse({ 
        statusText: "Group contains other users. Please remove those users from the group first." 
      });
    }
    const deleteRelation = prisma.memberships.deleteMany({
      where: {
        groupId: groupId
      }
    });
    const deleteGroup = prisma.groups.delete({
      where: {
        id: groupId
      }
    });
    await prisma.$transaction([deleteRelation, deleteGroup]);
    return NextResponse.json({ status: 200 });
  } catch (e: any) {
    console.log(e);
    return sendErrorResponse({ statusText: e.message });
  }
}