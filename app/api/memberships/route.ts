import { NextRequest, NextResponse } from "next/server";

import prisma from "@/server/lib/prisma";

import { type UserMembershipByGroup } from "@/types/model/memberships";
import { sendErrorResponse } from "@/types/base-api-response";


type MembershipsApiResponseType = NextResponse & {
  memberships?: UserMembershipByGroup[],
}

type MembershipsApiPostResponseType = NextResponse & {
  newMembership?: UserMembershipByGroup,
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
  Promise<MembershipsApiResponseType> {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id") as string;
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
        groupId: id
      }
    });
      if (!memberships) throw new Error("No users found");
      const membershipsArray = memberships.map((user) => user.user);
      return NextResponse.json({ memberships: membershipsArray , status: 200 });
  } catch (e: any) {
    console.log({ e });
    return sendErrorResponse({ statusText: e.message });
  }
}

/**
 * POST /api/memberships route
 * This route is used to create a new membership
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @bodyParam groupId - The id of the group
 * @bodyParam userEmail - The email of the user
 * 
 * @response 200 - The membership is created
 * @response 400 - Bad request
 * @response 500 - Server error
 */
export async function POST(request: NextRequest):
  Promise<MembershipsApiPostResponseType>
{
  try {
    const { groupId, userEmail } = await request.json();
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
    await prisma.memberships.create({
      data: {
        groupId: groupId,
        userId: user.id
      }
    });
    return NextResponse.json({ status: 200 , user: user });
  } catch (e: any) {
    console.log({ e });
    return sendErrorResponse({ statusText: e.message });
  }
}
