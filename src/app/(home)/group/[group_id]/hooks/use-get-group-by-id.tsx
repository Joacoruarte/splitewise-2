import { useSuspenseQuery } from '@tanstack/react-query';
import { getGroupById } from '@/actions/groups';

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
