'use client';

import { Bell, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { GroupInvitationCard } from './group-invitation-card';
import { useGetNotifications } from '@/hooks/notifications/use-get-notifications';
import { useGroupInviteActions } from '@/hooks/use-group-invite-actions';
import { Notification } from '@prisma/generated/prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserNotifications() {
  const { data: notifications, isLoading, unreadCount } = useGetNotifications();
  const { acceptInvitation, declineInvitation, isUpdating } = useGroupInviteActions();

  const handleAcceptInvitation = async (groupInvitationId: string, groupId: string) => {
    await acceptInvitation(groupInvitationId, groupId);
  };

  const handleDeclineInvitation = async (groupInvitationId: string, groupId: string) => {
    await declineInvitation(groupInvitationId, groupId);
  };

  const renderNotification = (notification: Notification) => {
    switch (notification.type) {
      case 'group_invitation':
        return (
          <GroupInvitationCard
            key={notification.id}
            notification={notification}
            onAccept={handleAcceptInvitation}
            onDecline={handleDeclineInvitation}
            isPending={isUpdating}
          />
        );
      default:
        return (
          <div key={notification.id} className="rounded-lg border p-3">
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="text-muted-foreground text-xs">{notification.message}</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return <Loader2 className="h-3.5 w-3.5 animate-spin" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative h-8 cursor-pointer gap-1">
          <Bell className="h-3.5 w-3.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-96 w-80 overflow-y-auto">
        <div className="p-2">
          <h3 className="mb-3 text-sm font-medium">Notificaciones</h3>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-2">{notifications.map(renderNotification)}</div>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">No tienes notificaciones</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
