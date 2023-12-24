import { signIn, signOut } from 'next-auth/react';
import { type IBaseApiResponse } from '@/types/base-service-response';

interface LoginData {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}
interface RegisterData {
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
): Promise<IBaseApiResponse> {
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
  else {
    // Parse the response body as JSON
    const body = await response.json();
    return { success: false, error: body.error }
  }
}

function handleSignOutAuth(): Promise<void> {
  return signOut({ callbackUrl: '/' })
}

export {
  handleSignInAuth,
  handleSignOutAuth,
  handlerRegisterAuth,
}