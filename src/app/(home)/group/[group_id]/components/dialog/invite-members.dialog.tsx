'use client';

import { useSearchUsers } from '@/hooks/use-search-users';
import { useSendGroupInvitations } from '@/hooks/use-send-group-invitations';
import { useSession } from '@/providers/session-provider';
import { Loader2, Search } from 'lucide-react';

import type React from 'react';
import { useState } from 'react';

import { useParams } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useGetInvitedUsersByGroup } from '../../hooks/use-get-invited-users-by-group';
import useGetGroupById from '../../hooks/useGetGroupById';

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

  // Bloquear el componente mientras carga los usuarios invitados
  if (isLoadingInvitedUsers) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Invitar Miembros</DialogTitle>
          <DialogDescription>Busca y selecciona amigos para invitar al grupo.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-3 text-sm text-muted-foreground">
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
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-4 pr-10"
            />
          </div>
        </div>

        {/* Usuarios ya invitados */}
        {invitedUsers && invitedUsers.length > 0 && (
          <div className="space-y-2">
            <Label>Usuarios ya invitados</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {invitedUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg border bg-muted/50"
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
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {user.status === 'pending'
                      ? 'Pendiente'
                      : user.status === 'accepted'
                        ? 'Aceptado'
                        : 'Rechazado'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resultados de búsqueda */}
        <div className="space-y-2">
          <Label>Usuarios Encontrados</Label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Buscando usuarios...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                <p>{error}</p>
              </div>
            ) : availableUsers.length > 0 ? (
              availableUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
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
                      <p className="text-xs text-muted-foreground">{user.email}</p>
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
              <div className="text-sm text-center py-8 text-muted-foreground">
                <p>No se encontraron usuarios que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              <div className="text-sm text-center py-8 text-muted-foreground">
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
