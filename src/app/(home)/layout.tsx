import { getUserByExternalId } from '@/actions/users';
import { Header } from '@/app/(home)/components/layout/header';
import { Sidebar } from '@/app/(home)/components/layout/sidebar';
import { auth } from '@clerk/nextjs/server';

import type React from 'react';

import { redirect } from 'next/navigation';

import { SidebarProvider } from '@/components/ui/sidebar';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const userFromExternalId = await getUserByExternalId(userId);

  if (!userFromExternalId) {
    redirect('/sign-in');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
