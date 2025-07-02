'use client';

import { sendGroupInvitationNotifications } from '@/actions/notifications';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseSendGroupInvitationsProps {
  groupId: string;
  groupName?: string;
  invitedByName?: string;
}

interface UseSendGroupInvitationsReturn {
  sendInvitations: (userIds: string[]) => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export const useSendGroupInvitations = ({
  groupId,
  groupName,
  invitedByName,
}: UseSendGroupInvitationsProps): UseSendGroupInvitationsReturn => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (userIds: string[]) => {
      if (!groupName || !invitedByName) {
        const errorMessage =
          'No se puede enviar invitaciones sin nombre de grupo o nombre de usuario';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      return await sendGroupInvitationNotifications({
        userIds,
        groupId,
        groupName,
        invitedByName,
      });
    },
    onSuccess: () => {
      toast.success('Invitaciones enviadas correctamente');
    },
    onError: error => {
      console.error('Error al enviar invitaciones:', error.message);
      toast.error(error.message);
    },
  });

  const sendInvitations = async (userIds: string[]) => {
    try {
      await mutateAsync(userIds);
    } catch (error) {
      // El error ya se maneja en onError del mutation
      throw error;
    }
  };

  return {
    sendInvitations,
    isPending,
    error,
  };
};
