import { useGetGroupInvite } from '@/hooks/notifications/use-get-group-invite';
import { useGroupInviteActions } from '@/hooks/notifications/use-group-invite-actions';
import { GroupWithRelations } from '@/models/group';
import { Calendar, Check, X } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { capitalize } from '@/lib/utils';

export function GroupCard({ group }: { group: GroupWithRelations }) {
  const {
    data: invite,
    hasInvite,
    isLoading,
  } = useGetGroupInvite({
    groupId: group.id,
    enabled: !group.isCurrentUserMember, // Solo verificar si no es miembro
  });
  const { acceptInvitation, declineInvitation, isAccepting, isDeclining } = useGroupInviteActions();

  const handleAccept = async () => {
    if (invite) {
      await acceptInvitation(invite.id, group.id);
    }
  };

  const handleDecline = async () => {
    if (invite) {
      await declineInvitation(invite.id, group.id);
    }
  };

  return (
    <Card key={group.id} className="relative">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={group.picture || '/group-placeholder.webp'}
              alt={group.name}
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
              </div>
              {/* Not implemented yet */}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {group?.tags?.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {capitalize(tag.name)}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    {group.members?.map((avatar, index) => (
                      <Avatar key={index} className="border-2 border-background h-8 w-8">
                        <AvatarImage src={avatar.user.picture || '/placeholder.svg'} />
                        <AvatarFallback>{avatar.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group?._count?.members && group._count.members > 3 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{group._count.members - 3}
                      </div>
                    )}
                  </div>{' '}
                  <span className="text-sm text-muted-foreground">
                    {group._count?.members} miembros
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {group.updatedAt.toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Mostrar botones de invitación si existe una invitación */}
                {!group.isCurrentUserMember && isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : hasInvite ? (
                  <div className="absolute right-4 top-4 flex flex-col justify-end items-end gap-2">
                    <p className="text-[12px] italic text-muted-foreground">
                      Tienes una invitación a unirte a este grupo
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAccept}
                        disabled={isAccepting || isDeclining}
                        className="cursor-pointer"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDecline}
                        disabled={isAccepting || isDeclining}
                        className="cursor-pointer"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Link href={`/group/${group.id}`}>
                    <Button className="cursor-pointer">
                      {group.isCurrentUserMember ? 'Ver grupo' : 'Unirse'}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
