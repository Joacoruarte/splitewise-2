import { useRemoveGroupMember } from '@/app/(home)/group/[group_id]/hooks/use-remove-group-member';
import { useSession } from '@/providers/session-provider';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import useGetGroupById from '../../hooks/use-get-group-by-id';
import useGetGroupMembers from '../../hooks/use-get-group-members';

export function MembersDialog() {
  const { group_id } = useParams();
  const { user } = useSession();
  const { data: group } = useGetGroupById({ groupId: group_id as string });
  const { data: groupMembers, isLoading } = useGetGroupMembers({
    groupId: group_id as string,
  });
  const isGroupAdmin = !!group?.isCurrentUserAdmin;
  const { removeMember, isPending } = useRemoveGroupMember({ groupId: group_id as string });

  return (
    <div className="space-y-6 py-4">
      <DialogTitle>Miembros del grupo</DialogTitle>
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px]">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-center h-full">
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          : groupMembers?.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.user.picture || '/placeholder.svg'} />
                    <AvatarFallback>
                      {member.user.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.user.name}</p>
                    <p className="text-xs text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>
                {isGroupAdmin && member.userId !== user?.id && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => {
                        const confirmed = confirm(
                          `¿Estás seguro de que quieres expulsar a ${member.user.name} del grupo?`
                        );
                        if (confirmed) {
                          removeMember(member.id);
                        }
                      }}
                      disabled={isPending}
                    >
                      {isPending ? 'Expulsando...' : 'Expulsar'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
      </div>
    </div>
  );
}
