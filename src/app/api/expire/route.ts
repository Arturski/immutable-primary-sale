// src/app/api/expire/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { reference } = await request.json();

  try {
    const reservation = await prisma.reservation.findFirst({
      where: { reference: reference },
    });

    if (!reservation) {
      return NextResponse.json({ error: `Order with reference ${reference} not found` }, { status: 404 });
    }

    const stockItem = await prisma.stockItem.findFirst({
      where: { token_id: reservation.token_id },
    });

    await prisma.stockItem.update({
      where: { id: stockItem?.id, token_id: reservation.token_id },
      data: { available: true },
    });

    await prisma.reservation.delete({
      where: { id: reservation.id },
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
