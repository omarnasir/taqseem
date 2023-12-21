import { signIn, signOut } from 'next-auth/react';

interface LoginData {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

interface RegisterData {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

interface AuthResponse {
  success: boolean;
  message?: string | null;
}

async function handleSignInAuth(
  { email, password }: LoginData
): Promise<AuthResponse> {
  // try {
  let response = await signIn('credentials', {
    email: email,
    password: password,
    callbackUrl: '/',
    redirect: false,
  });
  if (response?.ok) {
    return { success: true }
  }
  else {
    return {
      success: false,
      message: null
    }
  }
}
// catch (error) {
//   console.log(error)
//   throw new Error('Unexpected error in signin');
// }

async function handlerRegisterAuth(
  { name, email, password }: RegisterData
): Promise<AuthResponse> {
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
    return { success: false, message: body.message }
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