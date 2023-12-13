import { compare } from 'bcryptjs';

import { User } from '.prisma/client'
import { UserLoginData } from '../../../types/auth';

import prisma from "../../../client"


export const loginUser = async ({
  username,
  password,
}: UserLoginData): Promise<{
  user: User | null;
  error: Error | null;
}> => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  })

  if (!user) {
    return {
      user: null,
      error: new Error(`User with username: ${username} does not exist.`),
    };
  }

  const isValid = password && user.password && (await compare(password, user.password));

  if (!isValid) {
    return {
      user,
      error: new Error('Invalid password.'),
    };
  }

  return { user, error: null };
};