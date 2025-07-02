'use client';

import { createGroup } from '@/actions/groups';
import { useGetUsers } from '@/hooks/use-get-users';
import { CreateGroupData, createGroupSchema } from '@/models/group';
import { toast } from 'sonner';
import { z } from 'zod';

import type React from 'react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import { capitalize } from '@/lib/utils';

import { useGetGroupCategories } from '../../hooks/useGetGroupCategories';

export function CreateGroupDialog({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const { data: groupCategories, isLoading: isLoadingGroupCategories } = useGetGroupCategories();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers({
    excludeCurrentUser: true,
  });

  const [formData, setFormData] = useState<CreateGroupData>({
    name: '',
    description: '',
    category: '',
    selectedFriends: [],
    isPublic: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateGroupData, string>>>({});

  const handleInputChange = (
    field: keyof CreateGroupData,
    value: string | boolean | string[] | number[]
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Clear error for the field when it's modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleFriend = (friendId: string) => {
    handleInputChange(
      'selectedFriends',
      formData.selectedFriends.includes(friendId)
        ? formData.selectedFriends.filter(id => id !== friendId)
        : [...formData.selectedFriends, friendId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      createGroupSchema.parse(formData);

      // If validation passes, proceed with form submission
      console.log('Form data:', formData);

      const result = await new Promise(resolve => {
        toast.promise(createGroup(formData).then(resolve), {
          loading: 'Creando grupo...',
          success: 'Grupo creado correctamente',
          error: 'Error al crear el grupo',
        });
      });

      console.log('CREATE GROUP RESULT', result);

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        selectedFriends: [],
        isPublic: false,
      });
      setErrors({});

      // Close dialog
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CreateGroupData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof CreateGroupData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Crear Nuevo Grupo</DialogTitle>
        <DialogDescription>
          Crea un nuevo grupo para gestionar gastos compartidos con amigos o compañeros.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre del Grupo*</Label>
          <Input
            id="name"
            placeholder="Ej: Viaje a Barcelona"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            required
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Describe el propósito del grupo..."
            className="resize-none"
            rows={3}
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={formData.category}
            onValueChange={value => handleInputChange('category', value)}
            disabled={isLoadingGroupCategories}
          >
            <SelectTrigger id="category">
              <SelectValue
                placeholder={isLoadingGroupCategories ? 'Cargando...' : 'Selecciona una categoría'}
              />
            </SelectTrigger>
            <SelectContent>
              {isLoadingGroupCategories ? (
                <SelectItem value="loading" disabled>
                  Cargando categorías...
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="Todos">Todos</SelectItem>
                  {groupCategories?.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {capitalize(category.name)}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
        </div>

        <div className="grid gap-2">
          <Label>Invitar Amigos</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[100px] overflow-y-auto p-1">
            {isLoadingUsers
              ? Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-full" />
                ))
              : users?.map(user => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`friend-${user.id}`}
                      checked={formData.selectedFriends.includes(user.id)}
                      onChange={() => toggleFriend(user.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor={`friend-${user.id}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.picture || '/placeholder.svg'} />
                        <AvatarFallback>{user.name}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </Label>
                  </div>
                ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="public"
            checked={formData.isPublic}
            onCheckedChange={checked => handleInputChange('isPublic', checked)}
          />
          <Label htmlFor="public">Grupo Público</Label>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
          Los grupos públicos pueden ser encontrados por cualquier usuario de la plataforma
        </p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit">Crear Grupo</Button>
      </DialogFooter>
    </form>
  );
}
