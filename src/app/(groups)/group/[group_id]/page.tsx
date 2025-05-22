import { getUserByExternalId } from '@/actions/users';
import { HomeClient } from '@/app/(groups)/group/[group_id]/page.client';
import { auth } from '@clerk/nextjs/server';

export const metadata = {
  title: 'SplitWise - Home',
  description: 'Manage your expenses and split bills with friends',
};

export default async function HomeLoggedInPage() {
  const { userId } = await auth();
  const userFromExternalId = await getUserByExternalId(userId);
  console.log('userId', userId);
  console.log('userFromExternalId', userFromExternalId);

  return <HomeClient />;
}

{
  /* <div className="min-h-screen bg-gray-50">
<Navbar />
<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div className="px-4 py-6 sm:px-0">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <QuickActionsCard />
      <RecentActivityCard />
      <BalanceSummaryCard />
    </div>
  </div>
</main>
</div> */
}
