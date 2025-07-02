'use client';

import { DebtDetailSection } from './components/sections/debt-detail.section';
import { ExpenseHistorySection } from './components/sections/expense-history.section';
import GroupInfoSection from './components/sections/group-info.section';

export function GroupPageClient({ groupId }: { groupId: string }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <GroupInfoSection groupId={groupId} />
      <DebtDetailSection />
      <ExpenseHistorySection />
    </div>
  );
}
