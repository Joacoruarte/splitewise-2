'use server';

import { UnauthenticatedError } from '@/models/errors/auth';
import { currentUser } from '@clerk/nextjs/server';

import { getLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

import { getUserByExternalId } from './users';

interface SendGroupInvitationNotificationProps {
  userId: string;
  groupId: string;
  groupName: string;
  invitedByName: string;
}

export async function sendGroupInvitationNotification({
  userId,
  groupId,
  groupName,
  invitedByName,
}: SendGroupInvitationNotificationProps) {
  try {
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type: 'group_invitation',
        entityId: groupId,
      },
    });

    if (existingNotification) {
      throw new Error('Notification already sent');
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title: 'Invitación a grupo',
        message: `${invitedByName} te ha invitado a unirte al grupo "${groupName}"`,
        type: 'group_invitation',
        entityId: groupId,
        read: false,
      },
    });

    getLogger('sendGroupInvitationNotification').info(
      `Notification sent to user ${userId} for group ${groupId}`
    );
    return notification;
  } catch (error) {
    getLogger('sendGroupInvitationNotification').error(`Failed to send notification: ${error}`);
    throw new Error('Failed to send group invitation notification');
  }
}

export async function sendGroupInvitationNotifications({
  userIds,
  groupId,
  groupName,
  invitedByName,
}: {
  userIds: string[];
  groupId: string;
  groupName: string;
  invitedByName: string;
}) {
  const logger = getLogger('sendGroupInvitationNotifications');
  const existingNotifications = await prisma.notification.findMany({
    where: {
      userId: { in: userIds },
      type: 'group_invitation',
      entityId: groupId,
    },
  });

  if (existingNotifications.length > 0) {
    logger.info(`Notifications already sent for group ${groupId}`);
    throw new Error('Notifications already sent');
  }

  try {
    const notifications = await prisma.notification.createMany({
      data: userIds.map(userId => ({
        userId,
        title: 'Invitación a grupo',
        message: `${invitedByName} te ha invitado a unirte al grupo "${groupName}"`,
        type: 'group_invitation',
        entityId: groupId,
        read: false,
      })),
    });

    logger.info(`Sent ${notifications.count} notifications for group ${groupId}`);
    return notifications;
  } catch (error) {
    logger.error(`Failed to send notifications: ${error}`);
    throw new Error('Failed to send group invitation notifications');
  }
}

export async function getInvitedUsersByGroup(groupId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        type: 'group_invitation',
        entityId: groupId,
      },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications.map(notification => ({
      id: notification.user.id,
      name: notification.user.name,
      email: notification.user.email,
      picture: notification.user.picture,
      invitedAt: notification.createdAt,
      status: (notification.read ? 'accepted' : 'pending') as 'pending' | 'accepted' | 'declined',
    }));
  } catch (error) {
    getLogger('getInvitedUsersByGroup').error(`Failed to get invited users: ${error}`);
    throw new Error('Failed to get invited users for group');
  }
}

export async function getNotifications({
  limit = 50,
}: {
  limit?: number;
} = {}) {
  try {
    const _currentUser = await currentUser();

    if (!_currentUser) {
      throw new UnauthenticatedError('User not authenticated');
    }

    const user = await getUserByExternalId(_currentUser.id);

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return notifications;
  } catch (error) {
    getLogger('getNotifications').error(`Failed to get notifications: ${error}`);
    throw new Error('Failed to get notifications');
  }
}

export async function getGroupInvite(groupId: string) {
  try {
    const _currentUser = await currentUser();

    if (!_currentUser) {
      throw new UnauthenticatedError('User not authenticated');
    }

    const user = await getUserByExternalId(_currentUser.id);

    if (!user) {
      throw new Error('User not found');
    }

    const notification = await prisma.notification.findFirst({
      where: {
        userId: user.id,
        type: 'group_invitation',
        entityId: groupId,
        read: false,
      },
    });

    return notification;
  } catch (error) {
    getLogger('getGroupInvite').error(`Failed to get group invite: ${error}`);
    throw new Error('Failed to get group invite');
  }
}

export async function acceptGroupInvitation(notificationId: string, groupId: string) {
  try {
    const _currentUser = await currentUser();

    if (!_currentUser) {
      throw new UnauthenticatedError('User not authenticated');
    }

    const user = await getUserByExternalId(_currentUser.id);

    if (!user) {
      throw new Error('User not found');
    }

    // Marcar notificación como leída
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: user.id,
        type: 'group_invitation',
        entityId: groupId,
      },
      data: {
        read: true,
      },
    });

    // Agregar usuario al grupo
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
    return { success: true };
  } catch (error) {
    getLogger('acceptGroupInvitation').error(`Failed to accept group invitation: ${error}`);
    throw new Error('Failed to accept group invitation');
  }
}

export async function declineGroupInvitation(notificationId: string, groupId: string) {
  try {
    const _currentUser = await currentUser();

    if (!_currentUser) {
      throw new UnauthenticatedError('User not authenticated');
    }

    const user = await getUserByExternalId(_currentUser.id);

    if (!user) {
      throw new Error('User not found');
    }

    // Marcar notificación como leída
    await prisma.notification.update({
      where: {
        id: notificationId,
        userId: user.id,
        type: 'group_invitation',
        entityId: groupId,
      },
      data: {
        read: true,
      },
    });

    getLogger('declineGroupInvitation').info(
      `User ${user.id} declined invitation to group ${groupId}`
    );
    return { success: true };
  } catch (error) {
    getLogger('declineGroupInvitation').error(`Failed to decline group invitation: ${error}`);
    throw new Error('Failed to decline group invitation');
  }
}
