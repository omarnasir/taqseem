import { NextResponse } from 'next/server';
import { hashPassword } from "@/server/utils/hashing";
import prisma from '@/server/lib/prisma';
import { sendErrorResponse } from "@/app/api/error-response";
import { UserPersonalData } from '@/types/model/users';

type POSTResponseType = NextResponse<{ data: UserPersonalData } | undefined | null>

export async function POST(request: Request)
  : Promise<POSTResponseType> {
  try {
    const { name, email, password } = await request.json();
    // validate email and password
    if (!email || !password) {
      return sendErrorResponse({ statusText: "Email and password are required", status: 400 });
    }
    // Check if user already exists
    const user = await prisma.users.findUnique({
      where: {
        email: email
      }
    });
    if (user) {
      return sendErrorResponse({ statusText: "User already exists", status: 409 });
    }

    // add user to db
    const newUser = await prisma.users.create({
      select: {
        id: true,
        name: true,
        email: true,
      },
      data: {
        name: name,
        email: email,
        hashedPassword: await hashPassword(password),
      }
    });
    return NextResponse.json({ data: newUser }, { status: 200 });
  } catch (e: any) {
    return sendErrorResponse({ statusText: e.message });
  }
}