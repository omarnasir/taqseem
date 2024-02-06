import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/_lib/db/prisma';
import { type GroupData } from "@/app/_types/model/groups";
import { sendErrorResponse } from '@/app/api/error-response';

type GETResponseType = NextResponse<{ data: GroupData[] } | undefined | null>

/**
 * GET /api/users/groups route
 * This route is used to get all groups by userId
 * @param request - The request object
 * @returns {Promise<NextResponse>} The response object
 * 
 * @urlParam userId - The userId to search for
 * 
 * @response 200 - The group is found
 * @response 404 - The group is not found
 * @response 500 - Server error
 */
export async function GET(request: NextRequest):
  Promise<GETResponseType> {
  try {
    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get("id") as string;
    const userGroups = await prisma.memberships.findMany({
      select: {
        group: true
      },
      where: {
        userId: userId
      }
    });
    if (!userGroups) throw new Error("User Groups not found");
    const filteredUserGroups = userGroups.map((userGroup) => userGroup.group);
    return NextResponse.json({ data: filteredUserGroups }, { status: 200 });
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}