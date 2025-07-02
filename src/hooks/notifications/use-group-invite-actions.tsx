'use client';

import { acceptGroupInvitation, declineGroupInvitation } from '@/actions/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

interface UseGroupInviteActionsReturn {
  acceptInvitation: (notificationId: string, groupId: string) => Promise<void>;
  declineInvitation: (notificationId: string, groupId: string) => Promise<void>;
  isAccepting: boolean;
  isDeclining: boolean;
}

export const useGroupInviteActions = (): UseGroupInviteActionsReturn => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: acceptMutation, isPending: isAccepting } = useMutation({
    mutationFn: async ({
      notificationId,
      groupId,
    }: {
      notificationId: string;
      groupId: string;
    }) => {
      return await acceptGroupInvitation(notificationId, groupId);
    },
    onSuccess: () => {
      toast.success('Invitación aceptada correctamente');
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

  const { mutateAsync: declineMutation, isPending: isDeclining } = useMutation({
    mutationFn: async ({
      notificationId,
      groupId,
    }: {
      notificationId: string;
      groupId: string;
    }) => {
      return await declineGroupInvitation(notificationId, groupId);
    },
    onSuccess: () => {
      toast.success('Invitación rechazada');
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['groupInvite'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: error => {
      console.error('Error al rechazar invitación:', error);
      toast.error('Error al rechazar la invitación');
    },
  });

  const acceptInvitation = async (notificationId: string, groupId: string) => {
    await acceptMutation({ notificationId, groupId });
    router.push(`/group/${groupId}`);
  };

  const declineInvitation = async (notificationId: string, groupId: string) => {
    await declineMutation({ notificationId, groupId });
    router.refresh();
  };

  return {
    acceptInvitation,
    declineInvitation,
    isAccepting,
    isDeclining,
  };
};
