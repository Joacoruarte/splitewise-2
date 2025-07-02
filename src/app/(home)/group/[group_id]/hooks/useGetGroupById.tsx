import { getGroupById } from '@/actions/groups';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useGetGroupById({ groupId }: { groupId: string }) {
  return useSuspenseQuery({
    queryKey: ['group', groupId],
    queryFn: () => getGroupById(groupId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
}
