import { NextRequest, NextResponse } from "next/server";

import prisma from "@/server/lib/prisma";

import { type UserMembershipsByGroup } from "@/types/model/memberships";
import type IBaseApiResponse from "@/types/base-api-response";

interface IMembershipsApiResponse extends IBaseApiResponse {
  users?: UserMembershipsByGroup,
}

/**
 * GET /api/memberships route
 * This route is used to get all the users belonging to a group
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @urlParam id - The id of the group
 * 
 * @response 200 - The groups are found
 * @response 404 - No groups found
 * @response 500 - Server error
 */
export async function GET(request: NextRequest):
  Promise<IMembershipsApiResponse>
{
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id") as string;
    const users = await prisma.memberships.findMany({
      select: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      where: {
        groupId: id
      }
    });
      if (!users) throw new Error("No users found");
      const usersArray = users.map((user) => user.user);
      return NextResponse.json({ users: usersArray , status: 200 });
  } catch (e) {
    console.log({ e });
  }
  return NextResponse.json({ status: 500 });
}