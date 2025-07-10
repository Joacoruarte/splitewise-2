'use client';

import { removeGroupMember } from '@/actions/groups';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseRemoveGroupMemberProps {
  groupId?: string;
}

interface UseRemoveGroupMemberReturn {
  removeMember: (memberId: string) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export const useRemoveGroupMember = ({
  groupId,
}: UseRemoveGroupMemberProps = {}): UseRemoveGroupMemberReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (memberId: string) => {
      if (!groupId) {
        throw new Error('Group ID is required');
      }
      return await removeGroupMember(groupId, memberId);
    },
    onSuccess: data => {
      const userName = data.removedMember.user.name;
      toast.success(`${userName} ha sido expulsado del grupo correctamente`);

      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      queryClient.invalidateQueries({ queryKey: ['searchNotGroupMemberUsers'] });
      queryClient.invalidateQueries({ queryKey: ['invitedUsersByGroup', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
    onError: error => {
      console.error('Error al expulsar miembro:', error);
      toast.error(error.message || 'Error al expulsar al miembro del grupo');
    },
  });

  const removeMember = async (memberId: string) => {
    try {
      await mutateAsync(memberId);
    } catch (error) {
      throw error;
    }
  };

  return {
    removeMember,
    isPending,
    error,
  };
};
