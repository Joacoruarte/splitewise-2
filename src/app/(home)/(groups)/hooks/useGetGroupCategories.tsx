'use client';

import { useQuery } from '@tanstack/react-query';
import { getGroupCategories } from '@/actions/groups';

export const useGetGroupCategories = () => {
  return useQuery({
    queryKey: ['group-categories'],
    queryFn: () => getGroupCategories(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
