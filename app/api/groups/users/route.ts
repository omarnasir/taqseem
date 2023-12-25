import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/lib/prisma';
import { type GroupData } from "@/types/model/groups";
import type BaseApiResponseType from "@/types/base-api-response";

type GroupsApiResponseType = BaseApiResponseType & {
  groups?: GroupData[],
}

/**
 * GET /api/groups/users route
 * This route is used to get all groups by createdById
 * or get all groups by userId
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @urlParam createdById - The createdById to search for
 * @urlParam userId - The userId to search for
 * 
 * @response 200 - The group is found
 * @response 404 - The group is not found
 * @response 500 - Server error
 */
export async function GET(request: NextRequest):
  Promise<GroupsApiResponseType> {
  try {
    const searchParams = new URL(request.url).searchParams;
    if (searchParams.has("createdById")) {
      const createdById = searchParams.get("createdById") as string;
      const ownedGroups = await prisma.groups.findMany({
        where: {
          createdById: createdById
        }
      });
      if (!ownedGroups) throw new Error("Groups not found");
      const filteredUserGroups = ownedGroups.map(({ createdById, ...item }) => item);
      return NextResponse.json({ groups: filteredUserGroups , status: 200 });
    }
    else if (searchParams.has("userId")) {
      const userId = searchParams.get("userId") as string;
      const userGroups = await prisma.memberships.findMany({
        select: {
          group: true
        },
        where: {
          userId: userId
        }
      });
      if (!userGroups) throw new Error("User Groups not found");
      // strip out the createdById from the group
      const filteredUserGroups = userGroups.map(
        (userGroup) => userGroup.group).map(({ createdById, ...item }) => item);

      return NextResponse.json({ groups: filteredUserGroups , status: 200 });
    }
  } catch (e) {
    console.log({ e });
  }
  return NextResponse.json({ status: 500 });
}
