'use client';

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
  notification: {
    id: string;
    title: string;
    message: string;
    entityId: string | null;
    createdAt: Date;
    read: boolean;
  };
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
    if (notification.entityId && onAccept) {
      onAccept(notification.id, notification.entityId);
    }
  };

  const handleDecline = () => {
    if (notification.entityId && onDecline) {
      onDecline(notification.id, notification.entityId);
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

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm leading-tight">{notification.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
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
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleAccept}
                  disabled={isPending}
                  className="flex-1 h-8 text-xs cursor-pointer"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Aceptar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDecline}
                  disabled={isPending}
                  className="flex-1 h-8 text-xs cursor-pointer"
                >
                  <X className="h-3 w-3 mr-1" />
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
