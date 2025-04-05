import { Navbar } from '@/components/navbar';
import { QuickActionsCard } from '@/components/quick-actions-card';
import { RecentActivityCard } from '@/components/recent-activity-card';
import { BalanceSummaryCard } from '@/components/balance-summary-card';

export const metadata = {
  title: 'SplitWise - Home',
  description: 'Manage your expenses and split bills with friends',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
    </div>
  );
} 