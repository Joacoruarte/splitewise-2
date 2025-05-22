'use client';

import type React from 'react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Datos de ejemplo
const friends = [
  { id: 1, name: 'Ana García', avatar: '/placeholder.svg?height=40&width=40', initials: 'AG' },
  { id: 2, name: 'Carlos López', avatar: '/placeholder.svg?height=40&width=40', initials: 'CL' },
  { id: 3, name: 'María Rodríguez', avatar: '/placeholder.svg?height=40&width=40', initials: 'MR' },
  { id: 4, name: 'Pedro Sánchez', avatar: '/placeholder.svg?height=40&width=40', initials: 'PS' },
  { id: 5, name: 'Laura Martínez', avatar: '/placeholder.svg?height=40&width=40', initials: 'LM' },
];

const categories = [
  { id: 1, name: 'Comida' },
  { id: 2, name: 'Transporte' },
  { id: 3, name: 'Viaje' },
  { id: 4, name: 'Compras' },
  { id: 5, name: 'Ocio' },
  { id: 6, name: 'Otros' },
];

export function AddExpenseDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [splitMethod, setSplitMethod] = useState('equal');

  const toggleFriend = (friendId: number) => {
    setSelectedFriends(prev =>
      prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el gasto
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Gasto</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del gasto para dividirlo entre tus amigos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" placeholder="Ej: Cena en restaurante" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Monto (€)</Label>
              <Input id="amount" type="number" step="0.01" min="0.01" placeholder="0.00" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>¿Quién participó?</Label>
              <div className="grid grid-cols-2 gap-2">
                {friends.map(friend => (
                  <div key={friend.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`friend-${friend.id}`}
                      checked={selectedFriends.includes(friend.id)}
                      onCheckedChange={() => toggleFriend(friend.id)}
                    />
                    <Label
                      htmlFor={`friend-${friend.id}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={friend.avatar || '/placeholder.svg'} />
                        <AvatarFallback>{friend.initials}</AvatarFallback>
                      </Avatar>
                      <span>{friend.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="split-method">Método de división</Label>
              <Select value={splitMethod} onValueChange={setSplitMethod}>
                <SelectTrigger id="split-method">
                  <SelectValue placeholder="Selecciona cómo dividir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">Partes iguales</SelectItem>
                  <SelectItem value="percentage">Porcentajes</SelectItem>
                  <SelectItem value="exact">Montos exactos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {splitMethod !== 'equal' && (
              <div className="rounded-md border p-3 bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">
                  {splitMethod === 'percentage'
                    ? 'Asigna un porcentaje a cada persona'
                    : 'Asigna un monto exacto a cada persona'}
                </p>
                {selectedFriends.length > 0 ? (
                  <div className="space-y-2">
                    {selectedFriends.map(friendId => {
                      const friend = friends.find(f => f.id === friendId);
                      return (
                        <div key={friendId} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={friend?.avatar || '/placeholder.svg'} />
                            <AvatarFallback>{friend?.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{friend?.name}</span>
                          <Input
                            type="number"
                            className="h-8 w-20 ml-auto"
                            placeholder={splitMethod === 'percentage' ? '%' : '€'}
                            min="0"
                            step={splitMethod === 'percentage' ? '1' : '0.01'}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Selecciona participantes primero</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Gasto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
