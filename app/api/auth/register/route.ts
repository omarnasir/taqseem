import { NextResponse } from 'next/server';
import { hashPassword } from "@/server/utils/hashing";
import prisma from '@/server/lib/prisma';
import type BaseApiResponseType from "@/types/base-api-response";

type RegisterApiResponseType = BaseApiResponseType & {
  user?: {
    id: string,
    name: string,
    email: string,
  }
}

export async function POST(request: Request)
  : Promise<RegisterApiResponseType> {
  try {
    const { name, email, password } = await request.json();
    // validate email and password
    if (!email || !password) {
      return NextResponse.json({ status: 400 });
    }
    // Check if user already exists
    const user = await prisma.users.findUnique({
      where: {
        email: email
      }
    });
    if (user) {
      return NextResponse.json({ error: 'User already exists' },
        { status: 400 });
    }

    // add user to db
    const newUser = await prisma.users.create({
      data: {
        name: name,
        email: email,
        hashedPassword: await hashPassword(password),
      }
    });
    // remove hashedPassword from response
    const { hashedPassword, ...rest } = newUser;
    return NextResponse.json({ user: rest }, { status: 200 });
  } catch (e) {
    console.log({ e });
    return NextResponse.json({ status: 500 });
  }
}