'use client';

import { Loader2, Search, Trash } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import useGetGroupById from '../../hooks/use-get-group-by-id';
import { useGetInvitedUsersByGroup } from '../../hooks/use-get-invited-users-by-group';
import { useSendGroupInvitations } from '@/app/(home)/group/[group_id]/hooks/use-send-group-invitations';
import { useDeleteInvite } from '@/hooks/use-delete-invite';
import { useSearchUsers } from '@/hooks/use-search-users';
import { useSession } from '@/providers/session-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InviteMembersDialogProps {
  onClose: () => void;
}

export function InviteMembersDialog({ onClose }: InviteMembersDialogProps) {
  const { group_id } = useParams();
  const { user } = useSession();
  const { data: group } = useGetGroupById({ groupId: group_id as string });
  const { data: invitedUsers, isLoading: isLoadingInvitedUsers } = useGetInvitedUsersByGroup({
    groupId: group_id as string,
  });
  const { users, isLoading, error, searchQuery, handleSearch } = useSearchUsers(
    group_id as string | undefined
  );
  const { sendInvitations, isPending } = useSendGroupInvitations({
    groupId: group_id as string,
    groupName: group?.name,
    invitedByName: user?.name,
  });
  const { deleteInvitation, isPending: isDeleting } = useDeleteInvite({
    groupId: group_id as string,
  });
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Filtrar usuarios que ya están invitados
  const availableUsers = users.filter(
    user => !invitedUsers?.some(invitedUser => invitedUser.id === user.id)
  );

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendInvitations(selectedFriends);
    onClose();
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    await deleteInvitation(invitationId);
  };

  // Bloquear el componente mientras carga los usuarios invitados
  if (isLoadingInvitedUsers) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Invitar Miembros</DialogTitle>
          <DialogDescription>Busca y selecciona amigos para invitar al grupo.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          <span className="text-muted-foreground ml-3 text-sm">
            Cargando información del grupo...
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Invitar Miembros</DialogTitle>
        <DialogDescription>Busca y selecciona amigos para invitar al grupo.</DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4">
        {/* Barra de búsqueda */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar amigos</Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              id="search"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={handleSearch}
              className="pr-10 pl-4"
            />
          </div>
        </div>

        {/* Usuarios ya invitados */}
        {invitedUsers && invitedUsers.length > 0 && (
          <div className="space-y-2">
            <Label>Usuarios ya invitados</Label>
            <div className="max-h-[200px] space-y-2 overflow-y-auto">
              {invitedUsers.map(user => (
                <div
                  key={user.id}
                  className="bg-muted/50 flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.picture || '/placeholder.svg'} />
                      <AvatarFallback>
                        {user.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {user.status === 'PENDING'
                        ? 'Pendiente'
                        : user.status === 'ACCEPTED'
                          ? 'Aceptado'
                          : 'Rechazado'}
                    </Badge>
                    {user.status === 'REJECTED' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => handleDeleteInvitation(user.invitationId)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resultados de búsqueda */}
        <div className="space-y-2">
          <Label>Usuarios Encontrados</Label>
          <div className="max-h-[300px] space-y-2 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                <span className="text-muted-foreground ml-2 text-sm">Buscando usuarios...</span>
              </div>
            ) : error ? (
              <div className="text-destructive py-8 text-center">
                <p>{error}</p>
              </div>
            ) : availableUsers.length > 0 ? (
              availableUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.picture || '/placeholder.svg'} />
                      <AvatarFallback>
                        {user.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant={selectedFriends.includes(user.id) ? 'default' : 'outline'}
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => toggleFriend(user.id)}
                  >
                    {selectedFriends.includes(user.id) ? 'Seleccionado' : 'Invitar'}
                  </Button>
                </div>
              ))
            ) : searchQuery.trim() ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                <p>No se encontraron usuarios que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center text-sm">
                <p>Escribe en la barra de búsqueda para encontrar usuarios.</p>
              </div>
            )}
          </div>
        </div>

        {/* Invitaciones seleccionadas */}
        {selectedFriends.length > 0 && (
          <div className="space-y-2">
            <Label>Invitaciones Pendientes</Label>
            <div className="flex flex-wrap gap-1">
              {selectedFriends.map(userId => {
                const user = availableUsers.find(u => u.id === userId);
                return (
                  <Badge key={userId} variant="secondary">
                    {user?.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button className="cursor-pointer" type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          className="cursor-pointer"
          onClick={handleSubmit}
          disabled={selectedFriends.length === 0 || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Invitaciones'
          )}
        </Button>
      </DialogFooter>
    </>
  );
}
