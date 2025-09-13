'use client';

import { useCreateExpense } from '@/hooks/expenses/create/use-create-expense';
import { useGetExpenseCategories } from '@/hooks/use-get-expense-categories';
import { toast } from 'sonner';
import type React from 'react';
import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { capitalize, cn } from '@/lib/utils';
import useGetGroupMembers from '../../hooks/use-get-group-members';

export function AddExpenseDialog({ groupId, onClose }: { groupId: string; onClose: () => void }) {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [splitMethod, setSplitMethod] = useState('equal');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [splitDetails, setSplitDetails] = useState<{ [userId: string]: number }>({});

  const { data: categories, isLoading: isLoadingCategories } = useGetExpenseCategories();
  const { data: groupMembers, isLoading: isLoadingGroupMembers } = useGetGroupMembers({ groupId });
  const { createExpense, validateExpense, isPending } = useCreateExpense({ groupId });

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
    );
  };

  const handleAmountChange = (value: string | undefined) => {
    if (value === amount) return;
    setAmount(value || '');
  };

  const handleDotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (value[value.length - 1] === '.') {
      value = value.replace(/\./g, '');
      value = `${value},`;
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const expenseData = {
      description: description.trim(),
      amount: parseFloat(amount.replace(',', '.')),
      date,
      categoryId,
      groupId,
      participants: selectedFriends,
      splitMethod: splitMethod as 'equal' | 'percentage' | 'exact',
      splitDetails: splitMethod !== 'equal' ? splitDetails : undefined,
    };

    // Validar con Zod
    const validation = validateExpense(expenseData);
    if (!validation.success) {
      // Mostrar el primer error encontrado
      const firstError = validation.errors?.errors[0];
      if (firstError) {
        toast.error(firstError.message);
      } else {
        toast.error('Datos del formulario inválidos');
      }
      return;
    }

    try {
      await createExpense(expenseData);
      onClose();
    } catch (error) {
      // El error ya se maneja en el hook
      console.error('Error al crear el gasto:', error);
    }
  };

  return (
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
          <Input
            id="description"
            placeholder="Ej: Cena en restaurante"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="amount">Monto ($)</Label>
          <CurrencyInput
            id="amount"
            placeholder="0,00"
            decimalsLimit={2}
            groupSeparator="."
            decimalSeparator=","
            className={cn(
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
            )}
            value={amount}
            onChange={handleDotChange}
            onValueChange={handleAmountChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Fecha</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Categoría</Label>
          {isLoadingCategories ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {capitalize(category.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="grid gap-2">
          <Label>¿Quién participó?</Label>
          <div className="grid grid-cols-2 gap-2">
            {isLoadingGroupMembers ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              groupMembers?.map(member => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`friend-${member.id}`}
                    checked={selectedFriends.includes(member.id)}
                    onCheckedChange={() => toggleFriend(member.id)}
                  />
                  <Label
                    htmlFor={`friend-${member.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.user.picture || ''} />
                      <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.user.name}</span>
                  </Label>
                </div>
              ))
            )}
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
                {selectedFriends.map(memberId => {
                  const member = groupMembers?.find(m => m.id === memberId);
                  return (
                    <div key={memberId} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member?.user.picture || ''} />
                        <AvatarFallback>{member?.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member?.user.name}</span>
                      <Input
                        type="number"
                        className="h-8 w-20 ml-auto"
                        placeholder={splitMethod === 'percentage' ? '%' : '€'}
                        min="0"
                        step={splitMethod === 'percentage' ? '1' : '0.01'}
                        value={splitDetails[memberId] || ''}
                        onChange={e => {
                          const value = parseFloat(e.target.value) || 0;
                          setSplitDetails(prev => ({
                            ...prev,
                            [memberId]: value,
                          }));
                        }}
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
        <Button type="button" variant="outline" onClick={() => onClose()} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Gasto'}
        </Button>
      </DialogFooter>
    </form>
  );
}
