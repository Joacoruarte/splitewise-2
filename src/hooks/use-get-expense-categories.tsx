import { getExpenseCategories } from '@/actions/expenses';
import { useQuery } from '@tanstack/react-query';

export const useGetExpenseCategories = () => {
  return useQuery({
    queryKey: ['expense-categories'],
    queryFn: getExpenseCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
};
