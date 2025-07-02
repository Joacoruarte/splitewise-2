'use server';

import { NotFoundError } from '@/models/errors/common';
import { currentUser } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUsersExceptCurrent() {
  const _currentUser = await currentUser();

  try {
    const users = await prisma.user.findMany({
      where: {
        external_id: {
          not: _currentUser?.id,
        },
      },
    });

    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function searchUsers(query: string) {
  const _currentUser = await currentUser();

  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: query.trim(),
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: query.trim(),
                  mode: 'insensitive',
                },
              },
            ],
          },
          {
            external_id: {
              not: _currentUser?.id,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
      },
      take: 10, // Limitar a 10 resultados
    });

    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

export async function searchNotGroupMemberUsers(query: string, groupId: string) {
  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
  });

  if (!group) {
    throw new NotFoundError('Group not found');
  }

  const groupMembers = await prisma.groupMember.findMany({
    where: { groupId: groupId },
    select: { userId: true },
  });

  const excludedUserIds = groupMembers.map(member => member.userId);

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query.trim(), mode: 'insensitive' } },
              { email: { contains: query.trim(), mode: 'insensitive' } },
            ],
          },
          excludedUserIds.length > 0 ? { id: { notIn: excludedUserIds } } : {}, // Si no hay usuarios en el grupo, no excluimos nada
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
      },
      take: 10,
    });

    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

export async function getUserByExternalId(externalId: string | null): Promise<User | null> {
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
}

export async function createRandomUser(formData: FormData, path: string = '/') {
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
}

export async function deleteUser(userId: string, path: string = '/') {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath(path);
  }
}
