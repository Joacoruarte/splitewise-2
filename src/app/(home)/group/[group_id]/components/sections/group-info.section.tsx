'use client';

import { useLeaveGroup } from '@/app/(home)/group/[group_id]/hooks/use-leave-group';
import {
  ArrowLeft,
  Calendar,
  LogOut,
  MoreHorizontal,
  Settings,
  Share2,
  UserPlus,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Modal } from '@/components/ui/modal';
import { capitalize, copyToClipboard } from '@/lib/utils';
import useGetGroupById from '../../hooks/use-get-group-by-id';
import { InviteMembersDialog } from '../dialog/invite-members.dialog';
import { MembersDialog } from '../dialog/members.dialog';

export default function GroupInfoSection({ groupId }: { groupId: string }) {
  const [showInviteMembersDialog, setShowInviteMembersDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const { data: group } = useGetGroupById({ groupId });
  const { leaveGroup, isPending } = useLeaveGroup({ groupId });
  const isAdmin = !!group?.isCurrentUserAdmin;
  const isMember = !!group?.isCurrentUserMember;

  const handleCopyGroupLink = () => copyToClipboard(`${window.location.origin}/group/${groupId}`);

  const handleInviteMembers = () => setShowInviteMembersDialog(prev => !prev);

  const handleShowMembers = () => setShowMembersDialog(prev => !prev);

  const handleLeaveGroup = () => {
    const confirmed = confirm('¿Estás seguro de que quieres abandonar este grupo?');
    if (confirmed) {
      leaveGroup();
    }
  };

  return (
    <>
      {/* Header de navegación */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Grupos
          </Link>
        </Button>
      </div>

      {/* Información del grupo */}

      <Card className="overflow-hidden">
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="absolute -bottom-12 left-6">
            <div className="h-24 w-24 rounded-lg border-4 border-background bg-muted overflow-hidden">
              <Image
                src={'/group-placeholder.webp'}
                alt={group?.name}
                className="h-full w-full object-cover"
                width={96}
                height={96}
              />
            </div>
          </div>
        </div>
        <CardContent className="pt-16 pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{group?.name}</h1>
                <Badge variant="secondary">{capitalize(group.tags[0].name)}</Badge>
                <Badge variant="outline">{group.isPublic ? 'Público' : 'Privado'}</Badge>
              </div>
              <p className="text-muted-foreground mb-4">{group.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {group.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {capitalize(tag.name)}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Creado el {new Date(group.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
                <button
                  className="flex items-center gap-1 cursor-pointer hover:underline underline-offset-4"
                  onClick={handleShowMembers}
                >
                  <Users className="h-4 w-4" />
                  <span>
                    {group._count?.members || 0} miembro
                    {(group._count?.members || 0) > 1 ? 's' : ''}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isMember && (
                <Button className="cursor-pointer" variant="outline" onClick={handleInviteMembers}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invitar
                </Button>
              )}
              <Button className="cursor-pointer" variant="outline" onClick={handleCopyGroupLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              {isMember && !isAdmin && (
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={handleLeaveGroup}
                  disabled={isPending}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isPending ? 'Abandonando...' : 'Abandonar'}
                </Button>
              )}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="cursor-pointer" variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {}}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showInviteMembersDialog} onClose={handleInviteMembers}>
        <InviteMembersDialog onClose={handleInviteMembers} />
      </Modal>

      <Modal isOpen={showMembersDialog} onClose={handleShowMembers}>
        <MembersDialog />
      </Modal>
    </>
  );
}
