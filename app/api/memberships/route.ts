import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/_lib/db/prisma";

import { type CreateMembershipArgs, type MembershipDefaultArgs } from "@/app/_types/model/memberships";
import { type UserBasicData } from "@/app/_types/model/users";
import { sendErrorResponse } from "@/app/api/error-response";

type GETResponseType = NextResponse<{ data: UserBasicData[] } | undefined | null>
type POSTResponseType = NextResponse<{ data: UserBasicData } | undefined | null>

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
async function GET(request: NextRequest):
  Promise<GETResponseType> {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("groupId") as string;
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
    return NextResponse.json({ data: membershipsArray }, { status: 200 });
  } catch (e: any) {
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
async function POST(request: NextRequest):
  Promise<POSTResponseType>
{
  try {
    const body : CreateMembershipArgs = await request.json();
    const user = await prisma.users.findUnique({
      select: {
        id: true,
        name: true,
      },
      where: {
        email: body.userEmail
      }
    });
    if (!user) throw new Error("User not found");
    const isMemberAlready = await prisma.memberships.findFirst({
      where: {
        groupId: body.groupId,
        userId: user.id
      }
    });
    if (isMemberAlready) throw new Error("User is already a member");
    // create new membership
    await prisma.memberships.create({
      data: {
        groupId: body.groupId,
        userId: user.id
      }
    });
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}

/**
 * DELETE /api/memberships route
 * This route is used to delete a membership
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @bodyParam groupId - The id of the group
 * @bodyParam userId - The id of the user
 * 
 * @response 200 - The membership is deleted
 * @response 400 - Bad request
 * @response 500 - Server error
 */
async function DELETE(request: NextRequest):
  Promise<NextResponse>
{
  try {
    const body: MembershipDefaultArgs = await request.json();
    // Check if user is the owner
    const isOwner = await prisma.groups.findFirst({
      where: {
        id: body.groupId,
        createdById: body.userId
      }
    });
    if (isOwner) throw new Error("Owner cannot be deleted");
    await prisma.memberships.delete({
      where: {
        userId_groupId: {
          groupId: body.groupId,
          userId: body.userId
        }
      }
    });
    return NextResponse.json({ status: 200 });
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}

export {
  GET,
  POST,
  DELETE
}