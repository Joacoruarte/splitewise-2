'use client';

import { Notification } from '@prisma/generated/prisma/client';
import { Check, Users, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'hace un momento';
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)}d`;
  return `hace ${Math.floor(diffInSeconds / 2592000)}m`;
};

interface GroupInvitationCardProps {
  notification: Notification;
  onAccept?: (notificationId: string, groupId: string) => void;
  onDecline?: (notificationId: string, groupId: string) => void;
  isPending?: boolean;
}

export const GroupInvitationCard = ({
  notification,
  onAccept,
  onDecline,
  isPending = false,
}: GroupInvitationCardProps) => {
  const handleAccept = () => {
    const metadata = notification.metadata as Record<string, string>;
    if ('groupInvitationId' in metadata && onAccept && metadata.groupInvitationId) {
      onAccept(metadata.groupInvitationId, metadata.groupId);
    }
  };

  const handleDecline = () => {
    const metadata = notification.metadata as Record<string, string>;
    if ('groupInvitationId' in metadata && onDecline && metadata.groupInvitationId) {
      onDecline(metadata.groupInvitationId, metadata.groupId);
    }
  };

  return (
    <Card
      className={`transition-all duration-200 ${!notification.read ? 'border-primary/20 bg-primary/5' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/group-placeholder.webp" />
              <AvatarFallback>
                <Users className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="text-sm leading-tight font-medium">{notification.title}</h4>
                <p className="text-muted-foreground mt-1 text-xs">{notification.message}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">
                    {formatTimeAgo(new Date(notification.createdAt))}
                  </span>
                  {!notification.read && (
                    <Badge variant="secondary" className="text-xs">
                      Nuevo
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {!notification.read && notification.entityId && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAccept}
                  disabled={isPending}
                  className="h-8 flex-1 cursor-pointer text-xs"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Aceptar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDecline}
                  disabled={isPending}
                  className="h-8 flex-1 cursor-pointer text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  Rechazar
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
