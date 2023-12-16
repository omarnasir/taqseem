'use client';

import Logout from '@/components/auth/Logout';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data } = useSession();

  return (
    <div>Welcome to the dashboard, 
      {data?.user?.email}!
     {data?.user?.name}
      <Logout />
    </div>
  );
}