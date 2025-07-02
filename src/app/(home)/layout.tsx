import { getUserByExternalId } from '@/actions/users';
import { auth } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

import type React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import HomeLayoutClient from '@/components/ui/layout';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const user: User | null = await getUserByExternalId(userId);

  if (!user) {
    redirect('/sign-in');
  }

  const cookieStore = await cookies();
  const sidebarState = cookieStore.get('sidebar_state')?.value;
  const defaultOpen = sidebarState === 'true';

  return (
    <HomeLayoutClient user={user as User} defaultOpen={defaultOpen}>
      {children}
    </HomeLayoutClient>
  );
}
