import { getGroupMembers } from '@/actions/groups';
import { useQuery } from '@tanstack/react-query';

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
