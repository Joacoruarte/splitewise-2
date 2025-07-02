'use client';

import { useGetNotifications } from '@/hooks/notifications/use-get-notifications';
import { useGroupInviteActions } from '@/hooks/notifications/use-group-invite-actions';
import { Bell, Loader2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '../ui/button';
import { GroupInvitationCard } from './group-invitation-card';

export default function UserNotifications() {
  const { data: notifications, isLoading, unreadCount } = useGetNotifications();
  const { acceptInvitation, declineInvitation, isAccepting, isDeclining } = useGroupInviteActions();

  const handleAcceptInvitation = async (notificationId: string, groupId: string) => {
    await acceptInvitation(notificationId, groupId);
  };

  const handleDeclineInvitation = async (notificationId: string, groupId: string) => {
    await declineInvitation(notificationId, groupId);
  };

  const renderNotification = (notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    entityId: string | null;
    createdAt: Date;
    read: boolean;
  }) => {
    switch (notification.type) {
      case 'group_invitation':
        return (
          <GroupInvitationCard
            key={notification.id}
            notification={notification}
            onAccept={handleAcceptInvitation}
            onDecline={handleDeclineInvitation}
            isPending={isAccepting || isDeclining}
          />
        );
      default:
        return (
          <div key={notification.id} className="p-3 border rounded-lg">
            <p className="text-sm font-medium">{notification.title}</p>
            <p className="text-xs text-muted-foreground">{notification.message}</p>
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
        <Button variant="outline" size="sm" className="h-8 gap-1 relative cursor-pointer">
          <Bell className="h-3.5 w-3.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="p-2">
          <h3 className="font-medium text-sm mb-3">Notificaciones</h3>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-2">{notifications.map(renderNotification)}</div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tienes notificaciones</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
