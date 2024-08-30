'use server'
import { hashPassword } from "@/lib/utils/hashing";
import prisma from '@/lib/db/prisma';


export async function registerNewUser({ name, email, password }:
  { name: string, email: string, password: string })
  : Promise<boolean | void> {
  // validate email and password
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  // Check if user already exists
  const user = await prisma.users.findUnique({
    where: {
      email: email
    }
  });
  if (user) {
    throw new Error("User already exists");
  }
    
  try {
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
    return true;
  }
  catch (e: any) {
    console.log(e.message);
    throw new Error("Error creating user");
  }

}