'use server';

import { NotFoundError } from '@/models/errors/common';
import { CreateGroupData, GetGroupsProps, GroupWithRelations } from '@/models/group';
import { currentUser } from '@clerk/nextjs/server';
import { GroupCategories, Prisma } from '@prisma/client';

import { getLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export const getGroups = async ({
  categoryId,
  searchQuery,
}: GetGroupsProps): Promise<GroupWithRelations[]> => {
  const _currentUser = await currentUser();
  const whereClause: Prisma.GroupWhereInput = {};

  if (categoryId) {
    whereClause.tags = {
      some: { id: categoryId },
    };
  }

  if (searchQuery) {
    whereClause.name = {
      contains: searchQuery,
      mode: 'insensitive',
    };
  }

  try {
    const groups = await prisma.group.findMany({
      include: {
        tags: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                picture: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      where: whereClause,
    });

    // Si hay un usuario autenticado, verificar si es miembro de cada grupo
    if (_currentUser) {
      const user = await prisma.user.findUnique({
        where: { external_id: _currentUser.id },
      });

      if (user) {
        const userGroupMemberships = await prisma.groupMember.findMany({
          where: { userId: user.id },
          select: { groupId: true },
        });

        const userGroupIds = new Set(userGroupMemberships.map(m => m.groupId));

        return groups.map(group => ({
          ...group,
          isCurrentUserMember: userGroupIds.has(group.id),
        }));
      }
    }

    // Si no hay usuario autenticado, marcar todos como no miembros
    return groups.map(group => ({
      ...group,
      isCurrentUserMember: false,
    }));
  } catch (error) {
    getLogger('getGroups group actions layer').error(error);
    return [];
  }
};

export const getGroupById = async (groupId: string): Promise<GroupWithRelations> => {
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                picture: true,
              },
            },
          },
        },
        tags: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundError('Group not found');
    }

    return group;
  } catch (error) {
    getLogger('getGroupById group actions layer').error(error);
    throw error;
  }
};

export const getGroupCategories = async (): Promise<GroupCategories[]> => {
  try {
    return await prisma.groupCategories.findMany({});
  } catch (error) {
    getLogger('getGroupCategories group actions layer').error(error);
    return [];
  }
};

export const createGroup = async (data: CreateGroupData): Promise<GroupWithRelations | null> => {
  const _currentUser = await currentUser();

  if (!_currentUser) {
    throw new Error('User not found');
  }

  try {
    const result = await prisma.$transaction(async tx => {
      // Get current user from database
      const currentUserFromDB = await tx.user.findUnique({
        where: { external_id: _currentUser.id },
      });

      if (!currentUserFromDB) {
        throw new Error('Current user not found in database');
      }

      // create group
      const group = await tx.group.create({
        data: {
          name: data.name,
          description: data.description,
          isPublic: data.isPublic,
          tags: {
            connect: {
              id: data.category,
            },
          },
        },
      });

      // create group members
      const groupMembers: Prisma.GroupMemberCreateManyInput[] = [
        {
          groupId: group.id,
          userId: currentUserFromDB.id,
          isAdmin: true,
        },
        ...data.selectedFriends.map(friendId => ({
          groupId: group.id,
          userId: friendId,
        })),
      ];

      await tx.groupMember.createMany({
        data: groupMembers,
      });

      // return group with members
      const groupWithRelations = await tx.group.findUnique({
        where: { id: group.id },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  picture: true,
                },
              },
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return groupWithRelations;
    });
    console.log('CREATE GROUP RESULT', result);
    return result;
  } catch (error) {
    getLogger('createGroup group actions layer').error(error);
    throw error;
  }
};
