'use server'
import { hashPassword } from "@/app/_lib/utils/hashing";
import prisma from '@/app/_lib/db/prisma';


export async function registerNewUser({ name, email, password }:
  { name: string, email: string, password: string })
  : Promise<{ status: boolean, message?: string }> {
  try {
    // validate email and password
    if (!email || !password) {
      return {status: false, message: "Email and password are required"};
    }
    // Check if user already exists
    const user = await prisma.users.findUnique({
      where: {
        email: email
      }
    });
    if (user) {
      return {status: false, message: "User already exists"};
    }

    // add user to db
    await prisma.users.create({
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
    return {status: true};
  }
  catch (e: any) {
    console.log(e.message);
    return {status: false };
  }

}