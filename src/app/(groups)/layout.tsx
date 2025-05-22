import { getUserByExternalId } from '@/actions/users';
import { auth } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

import type React from 'react';

import { redirect } from 'next/navigation';

import HomeLayoutClient from './components/layout';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const user: User | null = await getUserByExternalId(userId);

  if (!user) {
    redirect('/sign-in');
  }

  return <HomeLayoutClient user={user as User}>{children}</HomeLayoutClient>;
}
