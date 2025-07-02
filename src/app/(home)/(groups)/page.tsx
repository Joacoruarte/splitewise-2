import { getGroups } from '@/actions/groups';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

import { GroupsContent } from './components/groups-content';

export const metadata = {
  title: 'SplitWise - Home Groups',
  description: 'Manage your expenses and split bills with friends',
};

const queryClient = new QueryClient();

export default async function HomePage() {
  await Promise.all([
    await queryClient.prefetchQuery({
      queryKey: ['groups', null, ''],
      queryFn: () => getGroups({ categoryId: null }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupsContent />
    </HydrationBoundary>
  );
}
