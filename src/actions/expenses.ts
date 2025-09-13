/* eslint-disable @typescript-eslint/no-explicit-any */

'use server';

import { getLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

export const getExpenseCategories = async () => {
  try {
    const categories = await prisma.expenseCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  } catch (error) {
    getLogger('getExpenseCategories expenses actions layer').error(error);
    throw new Error('Failed to fetch expense categories');
  }
};

export const createExpense = async (data: any) => {
  const expense = await prisma.expense.create({
    data,
  });
  return expense;
};
