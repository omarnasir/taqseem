import { NextResponse } from 'next/server';
import { hashPassword } from "@/app/utils/hashing";
import prisma from '@/app/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    // validate email and password
    if (!email || !password) {
      return NextResponse.json({ message: 'error' }, { status: 400 });
    }
    // Check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    if (user) {
      return NextResponse.json({ message: 'User already exists' }, 
      { status: 400 });
    }

    // add user to db
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: await hashPassword(password),
      }
    });
    // remove hashedPassword from response
    const { hashedPassword, ...rest } = newUser;
    return NextResponse.json({ message: 'success', user: rest },
    { status: 200 });
  } catch (e) {
    console.log({ e });
    return NextResponse.json({ message: 'error' }, 
    { status: 500 });
  }
}