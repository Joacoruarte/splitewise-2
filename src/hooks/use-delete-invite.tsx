'use client';

import { deleteGroupInvitation } from '@/actions/groups';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseDeleteInviteProps {
  groupId?: string;
}

interface UseDeleteInviteReturn {
  deleteInvitation: (invitationId: string) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export const useDeleteInvite = ({ groupId }: UseDeleteInviteProps = {}): UseDeleteInviteReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (invitationId: string) => {
      return await deleteGroupInvitation(invitationId);
    },
    onSuccess: data => {
      const userName = data.deletedInvitation.invited.name;
      toast.success(`Invitación para ${userName} eliminada correctamente`);

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['invitedUsersByGroup'] });
      queryClient.invalidateQueries({ queryKey: ['searchNotGroupMemberUsers'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Si se proporciona groupId, invalidar también las queries específicas del grupo
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      }
    },
    onError: error => {
      console.error('Error al eliminar invitación:', error);
      toast.error(error.message || 'Error al eliminar la invitación');
    },
  });

  const deleteInvitation = async (invitationId: string) => {
    try {
      await mutateAsync(invitationId);
    } catch (error) {
      // El error ya se maneja en onError del mutation
      throw error;
    }
  };

  return {
    deleteInvitation,
    isPending,
    error,
  };
};
