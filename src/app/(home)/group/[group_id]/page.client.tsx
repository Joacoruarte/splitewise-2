'use client';

import { DebtDetailSection } from './components/sections/debt-detail.section';
import { ExpenseHistorySection } from './components/sections/expense-history.section';
import GroupInfoSection from './components/sections/group-info.section';
import NotGroupMember from './components/sections/not-group-member';
import useGetGroupById from './hooks/use-get-group-by-id';

export function GroupPageClient({ groupId }: { groupId: string }) {
  const { data: group } = useGetGroupById({ groupId });
  const isCurrentUserMember = group?.isCurrentUserMember;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <GroupInfoSection groupId={groupId} />
      {!isCurrentUserMember ? (
        <NotGroupMember />
      ) : (
        <>
          <DebtDetailSection />
          <ExpenseHistorySection />
        </>
      )}
    </div>
  );
}
