/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createExpense } from '@/actions/expenses';
import { CreateExpenseData, createExpenseSchema } from '@/models/expense';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

interface UseCreateExpenseProps {
  groupId?: string;
}

interface UseCreateExpenseReturn {
  createExpense: (data: CreateExpenseData) => Promise<void>;
  validateExpense: (data: CreateExpenseData) => { success: boolean; errors?: z.ZodError };
  isPending: boolean;
  error: Error | null;
}

export const useCreateExpense = ({
  groupId,
}: UseCreateExpenseProps = {}): UseCreateExpenseReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: CreateExpenseData) => {
      return await createExpense(data);
    },
    onSuccess: (data: any) => {
      toast.success(`Gasto "${data.expense.description}" creado correctamente`);

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Si se proporciona groupId, invalidar también las queries específicas del grupo
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      }
    },
    onError: error => {
      console.error('Error al crear el gasto:', error);
      toast.error(error.message || 'Error al crear el gasto');
    },
  });

  const handleCreateExpense = async (data: CreateExpenseData) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      // El error ya se maneja en onError del mutation
      throw error;
    }
  };

  const validateExpense = (data: CreateExpenseData) => {
    const result = createExpenseSchema.safeParse(data);
    return {
      success: result.success,
      errors: result.success ? undefined : result.error,
    };
  };

  return {
    createExpense: handleCreateExpense,
    validateExpense,
    isPending,
    error,
  };
};
