import { auth } from '@/app/api/auth/auth';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(auth);

  if (!session) {
    redirect('/auth/login')
  }
  else {
    redirect('/dashboard')
  }
}