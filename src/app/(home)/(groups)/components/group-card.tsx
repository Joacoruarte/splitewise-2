import { Calendar, Check, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetGroupInvite } from '@/hooks/use-get-group-invite';
import { useGroupInviteActions } from '@/hooks/use-group-invite-actions';
import { GroupWithRelations } from '@/models/group';
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
  const { acceptInvitation, declineInvitation, isUpdating } = useGroupInviteActions();

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
          <div className="bg-muted h-24 w-24 shrink-0 overflow-hidden rounded-md">
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
                <p className="text-muted-foreground mt-1 text-sm">{group.description}</p>
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
                      <Avatar key={index} className="border-background h-8 w-8 border-2">
                        <AvatarImage src={avatar.user.picture || '/placeholder.svg'} />
                        <AvatarFallback>{avatar.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group?._count?.members && group._count.members > 3 && (
                      <div className="border-background bg-muted flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium">
                        +{group._count.members - 3}
                      </div>
                    )}
                  </div>{' '}
                  <span className="text-muted-foreground text-sm">
                    {group._count?.members} miembros
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
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
                  <div className="absolute top-4 right-4 flex flex-col items-end justify-end gap-2">
                    <p className="text-muted-foreground text-[12px] italic">
                      Tienes una invitación a unirte a este grupo
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAccept}
                        disabled={isUpdating}
                        className="cursor-pointer"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDecline}
                        disabled={isUpdating}
                        className="cursor-pointer"
                      >
                        <X className="mr-1 h-3 w-3" />
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
