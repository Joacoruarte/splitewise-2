'use client';

import { getGroupInvite } from '@/actions/groups';
import { useSession } from '@/providers/session-provider';
import { GroupInvitation, InvitationStatus } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

interface UseGetGroupInviteProps {
  groupId: string;
  enabled?: boolean;
  status?: InvitationStatus;
}

interface UseGetGroupInviteReturn {
  data: GroupInvitation | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  hasInvite: boolean;
}

export const useGetGroupInvite = ({
  groupId,
  enabled = true,
  status = 'PENDING',
}: UseGetGroupInviteProps): UseGetGroupInviteReturn => {
  const { user } = useSession();

  const {
    data = null,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['groupInvite', groupId, user?.id, status],
    queryFn: async () => {
      if (!user?.id || !groupId) {
        return null;
      }
      return await getGroupInvite(groupId, status);
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
