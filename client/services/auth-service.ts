import { signIn, signOut } from 'next-auth/react';
import { type BaseApiResponseType } from '@/types/base-service-response';

type LoginData = {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}
type RegisterData = {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

async function handleSignInAuth(
  { email, password }: LoginData
) : Promise<boolean> {
  let response = await signIn('credentials', {
    email: email,
    password: password,
    redirect: false,
  });
  if (response?.ok) {
    window.location.href = '/dashboard'
    return true
  }
  return false
}

async function handlerRegisterAuth(
  { name, email, password }: RegisterData
): Promise<BaseApiResponseType> {
  const response = await fetch(`/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
    }),
  });
  if (response.ok) {
    await handleSignInAuth({
      email: email,
      password: password,
    })
    return { success: true }
  }
  return { success: false, error: response.statusText }
}

function handleSignOutAuth(): Promise<void> {
  return signOut({ callbackUrl: '/' })
}

export {
  handleSignInAuth,
  handleSignOutAuth,
  handlerRegisterAuth,
}