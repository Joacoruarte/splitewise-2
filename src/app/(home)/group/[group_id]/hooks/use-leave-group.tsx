'use client';

import { leaveGroup } from '@/actions/groups';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UseLeaveGroupProps {
  groupId?: string;
}

interface UseLeaveGroupReturn {
  leaveGroup: () => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export const useLeaveGroup = ({ groupId }: UseLeaveGroupProps = {}): UseLeaveGroupReturn => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async () => {
      if (!groupId) {
        throw new Error('Group ID is required');
      }
      return await leaveGroup(groupId);
    },
    onSuccess: data => {
      toast.success(`Has abandonado el grupo "${data.groupName}" correctamente`);

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group-members'] });

      // Redirigir a la página de grupos
      router.push('/');
    },
    onError: error => {
      console.error('Error al abandonar el grupo:', error);
      toast.error(error.message || 'Error al abandonar el grupo');
    },
  });

  const handleLeaveGroup = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      throw error;
    }
  };

  return {
    leaveGroup: handleLeaveGroup,
    isPending,
    error,
  };
};
