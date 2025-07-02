'use client';

import { getGroupCategories } from '@/actions/groups';
import { useQuery } from '@tanstack/react-query';

export const useGetGroupCategories = () => {
  return useQuery({
    queryKey: ['group-categories'],
    queryFn: () => getGroupCategories(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
