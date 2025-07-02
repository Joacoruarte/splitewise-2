'use client';

import type React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  {
    id: 3,
    name: 'María Rodríguez',
    avatar: '/placeholder.svg?height=40&width=40',
    initials: 'MR',
  },
  { id: 4, name: 'Pedro Sánchez', avatar: '/placeholder.svg?height=40&width=40', initials: 'PS' },
  {
    id: 5,
    name: 'Laura Martínez',
    avatar: '/placeholder.svg?height=40&width=40',
    initials: 'LM',
  },
];

export function AddPaymentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para registrar el pago
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
            <DialogDescription>
              Registra un pago realizado o recibido entre amigos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RadioGroup defaultValue="received" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="received" id="received" className="peer sr-only" />
                <Label
                  htmlFor="received"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Recibí un pago</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="sent" id="sent" className="peer sr-only" />
                <Label
                  htmlFor="sent"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Realicé un pago</span>
                </Label>
              </div>
            </RadioGroup>

            <div className="grid gap-2">
              <Label htmlFor="friend">Amigo</Label>
              <Select>
                <SelectTrigger id="friend">
                  <SelectValue placeholder="Selecciona un amigo" />
                </SelectTrigger>
                <SelectContent>
                  {friends.map(friend => (
                    <SelectItem key={friend.id} value={friend.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={friend.avatar || '/placeholder.svg'} />
                          <AvatarFallback>{friend.initials}</AvatarFallback>
                        </Avatar>
                        <span>{friend.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input id="notes" placeholder="Ej: Pago de la cena del viernes" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Pago</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
