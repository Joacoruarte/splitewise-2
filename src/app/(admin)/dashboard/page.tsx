import { getUsers } from '@/actions/users';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { StepBack } from 'lucide-react';

import { Suspense } from 'react';

import Link from 'next/link';

import { CreateUserForm } from '@/components/dashboard/create-user-form';
import { UserList } from '@/components/dashboard/user-list';
import { UserListSkeleton } from '@/components/dashboard/user-list-skeleton';

export const metadata = {
  title: 'SplitWise - Dashboard',
  description: 'Manage users and expenses',
};

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: Infinity,
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 mb-8">
              <Link href="/">
                <StepBack />
              </Link>
              Dashboard
            </h1>

            <div className="grid grid-cols-1 gap-8">
              {/* Create User Section */}
              <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New User</h2>
                <CreateUserForm />
              </section>

              {/* User List Section */}
              <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
                <Suspense fallback={<UserListSkeleton />}>
                  <UserList />
                </Suspense>
              </section>
            </div>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
