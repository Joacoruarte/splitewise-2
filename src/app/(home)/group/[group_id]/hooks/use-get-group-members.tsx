import { useQuery } from '@tanstack/react-query';
import { getGroupMembers } from '@/actions/groups';

export default function useGetGroupMembers({ groupId }: { groupId: string }) {
  return useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => getGroupMembers(groupId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
}
