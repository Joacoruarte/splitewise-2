import { getGroupById } from '@/actions/groups';
import { GroupPageClient } from '@/app/(home)/group/[group_id]/page.client';
import { NotFoundError } from '@/models/errors/common';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

import { notFound, redirect } from 'next/navigation';

import { getLogger } from '@/lib/logger';

export const metadata = {
  title: 'SplitWise - Home',
  description: 'Manage your expenses and split bills with friends',
};

const queryClient = new QueryClient();

export default async function GroupPage({ params }: { params: Promise<{ group_id: string }> }) {
  const { group_id: groupId } = await params;

  try {
    const group = await getGroupById(groupId);

    queryClient.setQueryData(['group', groupId], group);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    getLogger('GroupPage layer unexpected error fetching group').error(error);
    redirect('/');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupPageClient groupId={groupId} />
    </HydrationBoundary>
  );
}
