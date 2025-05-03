'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function createRandomUser(formData: FormData) {
  try {
    const uuid = crypto.randomUUID();
    const username = formData.get('username');
    await prisma.user.create({
      data: {
        name: username as string,
        email: `test-${uuid}@test.com`,
        external_id: uuid,
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath('/');
  }
}
