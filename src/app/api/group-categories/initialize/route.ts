import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

async function insertGroupCategories() {
  try {
    const _categories = await prisma.groupCategories.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    if (_categories.length > 0) {
      return _categories;
    }

    const result = await prisma.groupCategories.createMany({
      data: [
        { name: 'eventos' },
        { name: 'amigos' },
        { name: 'hogar' },
        { name: 'viajes' },
        { name: 'cena' },
        { name: 'ocio' },
        { name: 'negocios' },
        { name: 'otros' },
      ],
    });

    console.log(`✅ Insertados ${result.count} GroupTags correctamente`);

    // Verificar que se insertaron con CUIDs
    const categories = await prisma.groupCategories.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    console.log('📋 Categories insertados:');
    categories.forEach(category => {
      console.log(`- ${category.name} (ID: ${category.id})`);
    });

    return categories;
  } catch (error) {
    console.error('❌ Error al insertar GroupCategories:', error);
  }
}

export async function GET() {
  const categories = await insertGroupCategories();
  return NextResponse.json(categories);
}
