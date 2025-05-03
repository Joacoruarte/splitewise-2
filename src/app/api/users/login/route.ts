import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface LoginWebhookBody {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    username?: string;
    first_name?: string;
    last_name?: string;
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginWebhookBody;

    if (!body.data) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        external_id: body.data.id,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update last login timestamp or any other relevant user data
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: 'User logged in successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in login webhook:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
