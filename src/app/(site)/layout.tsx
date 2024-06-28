import { auth } from '@/lib/auth';
import AuthenticatedLayout from './authenticated-layout';


export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (session && 
  <AuthenticatedLayout session={session}>
    {children}
  </AuthenticatedLayout>
  );
}