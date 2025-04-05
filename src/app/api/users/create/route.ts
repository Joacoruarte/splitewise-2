import { prisma } from '@/lib/prisma';
import { CreateUserWebhookBody } from '@/models/create-user-webhook';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = (await req.json()) as CreateUserWebhookBody;
  const client = await prisma.user.findUnique({
    where: {
      external_id: body.data.id,
    }
  })

  if (client) {
    return NextResponse.json(body, { status: 200 });
  }

  await prisma.user.create({
    data: {
      external_id: body.data.id,
      name: body.data.username || `${body.data.first_name} ${body.data.last_name}`,
      email: body.data.email_addresses[0].email_address,
    }
  })

  return NextResponse.json(body, { status: 201 });
}
