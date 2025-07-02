import { getGroups } from '@/actions/groups';
import { useQuery } from '@tanstack/react-query';

interface UseGetGroupsProps {
  categoryId?: string;
  searchQuery?: string;
}

export const useGetGroups = ({ categoryId, searchQuery }: UseGetGroupsProps) => {
  return useQuery({
    queryKey: ['groups', categoryId, searchQuery],
    queryFn: () => getGroups({ categoryId, searchQuery }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
