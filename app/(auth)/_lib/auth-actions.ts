'use server'
import { signIn, signOut } from '@/auth';
import { registerNewUser  } from '@/app/_data/auth-register';

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
      redirectTo: '/',
    });
}

async function registerAction(
  { name, email, password }: RegisterData
): Promise<string | void> {
  try {
    const response = await registerNewUser({
      name: name.toString(),
      email: email.toString(),
      password: password.toString(),
    });
    if (response === true) {
      await signInAction({
        email: email,
        password: password,
      });
    }
  }
  catch (e: any) {
    return e.message;
  }
}

async function signOutAction() {
  await signOut()
}

export {
  signInAction,
  registerAction,
  signOutAction
}