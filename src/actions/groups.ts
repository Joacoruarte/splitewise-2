'use server';

import { UnauthenticatedError } from '@/models/errors/auth';
import { NotFoundError } from '@/models/errors/common';
import { CreateGroupData, GetGroupsProps, GroupWithRelations } from '@/models/group';
import { currentUser } from '@clerk/nextjs/server';
import { GroupCategories, InvitationStatus, Prisma } from '@prisma/client';

import { getLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

import { getCurrentUser } from './users';

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

export const sendGroupInvitations = async ({
  userIds,
  groupId,
}: {
  userIds: string[];
  groupId: string;
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new UnauthenticatedError('User not found');
  }

  const groupInvitations = userIds.map(async userId => {
    return await prisma.groupInvitation.create({
      data: {
        groupId,
        invitedId: userId,
        inviterId: currentUser.id,
      },
    });
  });

  const results = await Promise.all(groupInvitations);
  const invitations = new Map(results.map(result => [result.invitedId, result]));
  return invitations;
};

export async function getInvitedUsersByGroup(groupId: string) {
  try {
    const invitations = await prisma.groupInvitation.findMany({
      where: {
        groupId,
      },
      include: {
        invited: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invitations.map(invitation => ({
      id: invitation.invited.id,
      name: invitation.invited.name,
      email: invitation.invited.email,
      picture: invitation.invited.picture,
      invitedAt: invitation.createdAt,
      status: invitation.status,
      invitationId: invitation.id,
    }));
  } catch (error) {
    getLogger('getInvitedUsersByGroup').error(`Failed to get invited users: ${error}`);
    throw new Error('Failed to get invited users for group');
  }
}

export async function getGroupInvite(groupId: string, status: InvitationStatus = 'PENDING') {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const invitation = await prisma.groupInvitation.findFirst({
      where: {
        groupId,
        invitedId: user.id,
        status,
      },
    });

    return invitation;
  } catch (error) {
    getLogger('getGroupInvite').error(`Failed to get group invite: ${error}`);
    throw new Error('Failed to get group invite');
  }
}

export async function updateGroupInvitation(
  groupId: string,
  invitationId: string,
  status: InvitationStatus
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const notification = await prisma.notification.findFirst({
      where: {
        entityId: groupId,
        type: 'group_invitation',
        userId: user.id,
        read: false,
      },
    });

    if (!notification) {
      throw new NotFoundError('Invitation not found');
    }

    await Promise.all([
      await prisma.notification.update({
        where: {
          id: notification.id,
          userId: user.id,
          type: 'group_invitation',
          entityId: groupId,
        },
        data: {
          read: true,
        },
      }),
      await prisma.groupInvitation.update({
        where: { id: invitationId },
        data: { status },
      }),
    ]);

    if (status === 'ACCEPTED') {
      await prisma.groupMember.create({
        data: {
          userId: user.id,
          groupId: groupId,
          isAdmin: false,
        },
      });

      getLogger('acceptGroupInvitation').info(
        `User ${user.id} accepted invitation to group ${groupId}`
      );
    }

    if (status === 'REJECTED') {
      getLogger('acceptGroupInvitation').info(
        `User ${user.id} rejected invitation to group ${groupId}`
      );
    }

    return { success: true, status };
  } catch (error) {
    getLogger('acceptGroupInvitation').error(`Failed to accept group invitation: ${error}`);
    throw new Error('Failed to accept group invitation');
  }
}

export async function deleteGroupInvitation(invitationId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new UnauthenticatedError('User not found');
    }

    // Verificar que la invitación existe y que el usuario actual es el que la creó
    const invitation = await prisma.groupInvitation.findUnique({
      where: { id: invitationId },
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        invited: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundError('Invitation not found');
    }

    // Verificar que el usuario actual es el que creó la invitación o es admin del grupo
    const isInviter = invitation.inviterId === currentUser.id;
    const isGroupAdmin = await prisma.groupMember.findFirst({
      where: {
        groupId: invitation.groupId,
        userId: currentUser.id,
        isAdmin: true,
      },
    });

    if (!isInviter && !isGroupAdmin) {
      throw new Error('You are not authorized to delete this invitation');
    }

    // Eliminar la invitación
    await prisma.groupInvitation.delete({
      where: { id: invitationId },
    });

    // Eliminar la notificación asociada si existe
    await prisma.notification.deleteMany({
      where: {
        userId: invitation.invitedId,
        type: 'group_invitation',
        entityId: invitation.groupId,
      },
    });

    getLogger('deleteGroupInvitation').info(
      `Invitation ${invitationId} deleted by user ${currentUser.id}`
    );

    return {
      success: true,
      deletedInvitation: invitation,
    };
  } catch (error) {
    getLogger('deleteGroupInvitation').error(`Failed to delete invitation: ${error}`);
    throw error;
  }
}

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
