'use server'
import { signIn, signOut } from '@/lib/auth';
import { registerNewUser  } from '@/server/data/auth.data';

type LoginData = {
  email: FormDataEntryValue,
  password: FormDataEntryValue
}

type RegisterData = {
  name: FormDataEntryValue,
  email: FormDataEntryValue,
  password: FormDataEntryValue,
}


async function signInAction(
  { email, password }: LoginData
) {
    await signIn('credentials', {
      email: email,
      password: password,
      redirectTo: '/dashboard',
    });
}

async function registerAction(
  { name, email, password }: RegisterData
): Promise<string | void> {
  let response: boolean | void = false;
  try {
    response = await registerNewUser({
      name: name.toString(),
      email: email.toString(),
      password: password.toString(),
    });
  }
  catch (e: any) {
    return e.message;
  }
  if (response === true) {
    await signInAction({
      email: email,
      password: password,
    });
  }
}

async function signOutAction() {
  await signOut(
    {
      redirectTo: '/login',
    }
  );
}

export {
  signInAction,
  registerAction,
  signOutAction
}