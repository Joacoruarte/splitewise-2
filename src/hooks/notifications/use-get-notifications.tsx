'use client';

import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/actions/notifications';
import { useSession } from '@/providers/session-provider';
import { Notification } from '@prisma/generated/prisma/client';

interface UseGetNotificationsProps {
  enabled?: boolean;
  limit?: number;
}

interface UseGetNotificationsReturn {
  data: Notification[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  unreadCount: number;
}

export const useGetNotifications = ({
  enabled = true,
  limit = 50,
}: UseGetNotificationsProps = {}): UseGetNotificationsReturn => {
  const { user } = useSession();

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications', user?.id, limit],
    queryFn: async () => {
      return await getNotifications({ limit });
    },
    enabled: enabled && !!user?.id,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
    retry: 2,
  });

  // Calcular notificaciones no leídas
  const unreadCount = data.filter(notification => !notification.read).length;

  return {
    data,
    isLoading,
    error,
    refetch,
    unreadCount,
  };
};
