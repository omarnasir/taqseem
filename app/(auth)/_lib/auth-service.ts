'use server'
import { signIn, signOut } from '@/auth';
import { registerNewUser  } from '@/app/_db/auth-register';

type LoginData = {
  email: FormDataEntryValue,
  password: FormDataEntryValue
}

type RegisterData = {
  name: FormDataEntryValue,
  email: FormDataEntryValue,
  password: FormDataEntryValue,
}


async function handleSignInAuth(
  { email, password }: LoginData
) {
    await signIn('credentials', {
      email: email,
      password: password,
      redirectTo: '/',
    });
}

async function handlerRegisterAuth(
  { name, email, password }: RegisterData
): Promise<string | void> {
  const response = await registerNewUser({
    name: name.toString(),
    email: email.toString(),
    password: password.toString(),
  });
  if (response.status) {
    await handleSignInAuth({
      email: email,
      password: password,
    })
  }
  else {
    return response.message;
  }

}

async function handleSignOutAuth() {
  await signOut()
}

export {
  handleSignInAuth,
  handleSignOutAuth,
  handlerRegisterAuth,
}