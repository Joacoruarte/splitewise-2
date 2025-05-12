'use server';

import { User } from '@prisma/client';

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

export const getUserByExternalId = async (externalId: string | null): Promise<User | null> => {
  if (!externalId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { external_id: externalId },
    });
    return user as User;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createRandomUser = async (formData: FormData, path: string = '/') => {
  try {
    const uuid = crypto.randomUUID();
    const username = formData.get('username');
    await prisma.user.create({
      data: {
        name: username as string,
        email: `test-${uuid}@test.com`,
        external_id: uuid,
        picture: 'https://i.pravatar.cc/150?img=1',
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath(path);
  }
};

export const deleteUser = async (userId: string, path: string = '/') => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath(path);
  }
};
