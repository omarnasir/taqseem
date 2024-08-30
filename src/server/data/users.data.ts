import prisma from "@/lib/db/prisma";
import { UserBasicData } from "@/types/users.type";

/**
 * Get user by email.
 * @param email 
 * @returns 
 */
async function getUserByEmail(email: string): Promise<UserBasicData | null> {
  try {
    const user = await prisma.users.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        email: email
      }
    });
    return user;
  }
  catch (e) {
    console.error(e);
    throw new Error("Failed to get user by email");
  }
}

export {
  getUserByEmail
}