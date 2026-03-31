import { useQuery } from '@tanstack/react-query';
import { getUsers, getUsersExceptCurrent } from '@/actions/users';

export const useGetUsers = ({ excludeCurrentUser = true }: { excludeCurrentUser?: boolean }) => {
  return useQuery({
    queryKey: ['users', excludeCurrentUser],
    queryFn: () => (excludeCurrentUser ? getUsersExceptCurrent() : getUsers()),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};
