import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/lib/prisma';
import { type GroupData } from "@/types/model/groups";
import type IBaseApiResponse from "@/types/base-api-response";


interface IGroupsApiResponse extends IBaseApiResponse {
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
  Promise<IGroupsApiResponse> {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get("id") as string;
    const group = await prisma.groups.findUnique({
      where: {
        id: id
      }
    });
    if (!group) throw new Error("Group not found");
    return NextResponse.json({ group }, { status: 200 });
  } catch (e) {
    console.log({ e });
    return NextResponse.json({ status: 500 });
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
export async function POST(request: Request):
  Promise<IGroupsApiResponse> {
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
      return NextResponse.json({ status: 409 });
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
  } catch (e) {
    console.log({ e });
    return NextResponse.json({ status: 500 });
  }
}