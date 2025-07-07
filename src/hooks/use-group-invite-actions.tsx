'use client';

import { updateGroupInvitation } from '@/actions/groups';
import { InvitationStatus } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

interface UseGroupInviteActionsReturn {
  acceptInvitation: (invitationId: string, groupId: string) => Promise<void>;
  declineInvitation: (invitationId: string, groupId: string) => Promise<void>;
  isUpdating: boolean;
}

export const useGroupInviteActions = (): UseGroupInviteActionsReturn => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: updateInvitationMutation, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      groupId,
      invitationId,
      status,
    }: {
      groupId: string;
      invitationId: string;
      status: InvitationStatus;
    }) => {
      return await updateGroupInvitation(groupId, invitationId, status);
    },
    onSuccess: ({ status }) => {
      const acceptMessage = 'Invitación aceptada, redirigiendo al grupo...';
      const declineMessage = 'Invitación rechazada';
      toast.success(status === 'ACCEPTED' ? acceptMessage : declineMessage);

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['groupInvite'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: error => {
      console.error('Error al aceptar invitación:', error);
      toast.error('Error al aceptar la invitación');
    },
  });

  const acceptInvitation = async (invitationId: string, groupId: string) => {
    await updateInvitationMutation({ groupId, invitationId, status: 'ACCEPTED' });
    router.push(`/group/${groupId}`);
  };

  const declineInvitation = async (invitationId: string, groupId: string) => {
    await updateInvitationMutation({ groupId, invitationId, status: 'REJECTED' });
    router.refresh();
  };

  return {
    acceptInvitation,
    declineInvitation,
    isUpdating,
  };
};
