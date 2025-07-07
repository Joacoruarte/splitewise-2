'use client';

import { getInvitedUsersByGroup } from '@/actions/groups';
import { InvitationStatus } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

interface InvitedUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  invitedAt: Date;
  status: InvitationStatus;
  invitationId: string;
}

interface UseGetInvitedUsersByGroupProps {
  groupId: string;
  enabled?: boolean;
}

interface UseGetInvitedUsersByGroupReturn {
  data: InvitedUser[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useGetInvitedUsersByGroup = ({
  groupId,
  enabled = true,
}: UseGetInvitedUsersByGroupProps): UseGetInvitedUsersByGroupReturn => {
  const {
    data = [] as InvitedUser[],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['invitedUsersByGroup', groupId],
    queryFn: async () => {
      if (!groupId) {
        throw new Error('Group ID is required');
      }
      return await getInvitedUsersByGroup(groupId);
    },
    enabled: enabled && !!groupId,
    staleTime: 1 * 60 * 1000, // 1 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
