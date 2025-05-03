import { createRandomUser, getUsers } from '@/actions/user';

import { BalanceSummaryCard } from '@/components/balance-summary-card';
import { Navbar } from '@/components/navbar';
import { QuickActionsCard } from '@/components/quick-actions-card';
import { RecentActivityCard } from '@/components/recent-activity-card';

export const metadata = {
  title: 'SplitWise - Home',
  description: 'Manage your expenses and split bills with friends',
};

export default async function HomePage() {
  const users = await getUsers();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <form action={createRandomUser}>
        <input type="text" placeholder="write a username" name="username" />
        <button type="submit">Submit</button>
      </form>

      <pre>{JSON.stringify(users, null, 2)}</pre>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionsCard />
            <RecentActivityCard />
            <BalanceSummaryCard />
          </div>
        </div>
      </main>
    </div>
  );
}
