import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    // Find the reservation based on the reference
    const reservation = await prisma.reservation.findFirst({
      where: { reference },
    });

    if (!reservation) {
      return NextResponse.json({ error: `Reservation with reference ${reference} not found` }, { status: 404 });
    }

    // Update stock item to be available again
    await prisma.stockItem.updateMany({
      where: { token_id: reservation.token_id },
      data: { available: true },
    });

    // Delete the reservation
    await prisma.reservation.delete({
      where: { id: reservation.id },
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
