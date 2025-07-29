import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function insertExpenseCategories() {
  try {
    const _categories = await prisma.expenseCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (_categories.length > 0) {
      return _categories;
    }

    const result = await prisma.expenseCategory.createMany({
      data: [
        { name: 'evento', color: 'bg-green-500', icon: '🎉' },
        { name: 'transporte', color: 'bg-yellow-500', icon: '🚗' },
        { name: 'viaje', color: 'bg-blue-500', icon: '🌍' },
        { name: 'comida', color: 'bg-pink-500', icon: '🍽️' },
        { name: 'ocio', color: 'bg-purple-500', icon: '🍿' },
        { name: 'negocio', color: 'bg-orange-500', icon: '💼' },
        { name: 'otros', color: 'bg-gray-500', icon: '💰' },
      ],
    });

    console.log(`✅ Insertados ${result.count} ExpenseCategories correctamente`);

    // Verificar que se insertaron con CUIDs
    const categories = await prisma.expenseCategory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    console.log('📋 ExpenseCategories insertados:');
    categories.forEach(category => {
      console.log(`- ${category.name} (ID: ${category.id})`);
    });

    return categories;
  } catch (error) {
    console.error('❌ Error al insertar ExpenseCategories:', error);
  }
}

export async function GET() {
  const categories = await insertExpenseCategories();
  return NextResponse.json(categories);
}
