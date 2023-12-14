'use client';

import Logout from '@/app/user/Logout';


export default function DashboardPage() {

  return (
    <div>private dashboard page - you need to be logged in to view this
      <Logout />
    </div>

  );
}