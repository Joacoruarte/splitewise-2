'use client';

import { getGroupInvite } from '@/actions/notifications';
import { useSession } from '@/providers/session-provider';
import { useQuery } from '@tanstack/react-query';

interface GroupInvite {
  id: string;
  title: string;
  message: string;
  entityId: string | null;
  read: boolean;
  createdAt: Date;
  userId: string;
}

interface UseGetGroupInviteProps {
  groupId: string;
  enabled?: boolean;
}

interface UseGetGroupInviteReturn {
  data: GroupInvite | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  hasInvite: boolean;
}

export const useGetGroupInvite = ({
  groupId,
  enabled = true,
}: UseGetGroupInviteProps): UseGetGroupInviteReturn => {
  const { user } = useSession();

  const {
    data = null,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['groupInvite', groupId, user?.id],
    queryFn: async () => {
      if (!user?.id || !groupId) {
        return null;
      }
      return await getGroupInvite(groupId);
    },
    enabled: enabled && !!user?.id && !!groupId,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    hasInvite: !!data,
  };
};
