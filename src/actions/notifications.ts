'use server';

import { UnauthenticatedError } from '@/models/errors/auth';
import { GroupInvitation } from '@prisma/client';

import { getLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

import { getCurrentUser } from './users';

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
  groupInvitations,
}: {
  userIds: string[];
  groupId: string;
  groupName: string;
  invitedByName: string;
  groupInvitations: Map<string, GroupInvitation>;
}) {
  if (groupInvitations.size !== userIds.length) {
    throw new Error('Group invitations and user IDs do not match');
  }

  const logger = getLogger('sendGroupInvitationNotifications');
  const existingNotifications = await prisma.notification.findMany({
    where: {
      userId: { in: userIds },
      type: 'group_invitation',
      entityId: groupId,
      read: false,
    },
  });

  if (existingNotifications.length > 0) {
    logger.info(`Notifications already sent for group ${groupId}`);
    return existingNotifications;
  }

  try {
    const notifications = await prisma.notification.createMany({
      data: userIds.map(userId => {
        const groupInvitation = groupInvitations.get(userId);

        return {
          userId,
          title: 'Invitación a grupo',
          message: `${invitedByName} te ha invitado a unirte al grupo "${groupName}"`,
          type: 'group_invitation',
          entityId: groupId,
          read: false,
          metadata: {
            groupInvitationId: groupInvitation?.id,
            groupId: groupInvitation?.groupId,
            inviterId: groupInvitation?.inviterId,
            invitedId: groupInvitation?.invitedId,
            invitedByName: invitedByName,
            groupName: groupName,
          },
        };
      }),
    });

    logger.info(`Sent ${notifications.count} notifications for group ${groupId}`);
    return notifications;
  } catch (error) {
    logger.error(`Failed to send notifications: ${error}`);
    throw new Error('Failed to send group invitation notifications');
  }
}

export async function getNotifications({
  limit = 50,
}: {
  limit?: number;
} = {}) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new UnauthenticatedError('User not authenticated');
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
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
