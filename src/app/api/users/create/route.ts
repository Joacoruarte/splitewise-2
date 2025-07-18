import { CreateUserWebhookBody } from '@/models/create-user-webhook';
import { NextResponse } from 'next/server';
import { getLogger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
const logger = getLogger('Create user clerk webhook');

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateUserWebhookBody;

    if (!body.data) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const client = await prisma.user.findUnique({
      where: {
        external_id: body.data.id,
      },
    });

    logger.info('CLIENT ALREADY EXISTS', client);

    if (client) {
      return NextResponse.json(body, { status: 200 });
    }

    await prisma.user.create({
      data: {
        external_id: body.data.id,
        name: body.data.username || `${body.data.first_name} ${body.data.last_name}`,
        email: body.data.email_addresses[0].email_address,
        picture: body.data.profile_image_url,
      },
    });

    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    logger.error('Error in user creation:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
