'use server';

import { getLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

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
