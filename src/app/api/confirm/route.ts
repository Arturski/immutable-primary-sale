import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { reference, tx_hash, token_id_hash, recipient_address, order } = await request.json();

  try {
    const reservation = await prisma.reservation.findFirst({
      where: { reference: reference },
    });

    if (!reservation) {
      return NextResponse.json({ error: `Order with reference ${reference} not found` }, { status: 404 });
    }

    // Create confirmation entry
    await prisma.confirmation.create({
      data: {
        reference: reference,
        tx_hash: tx_hash,
        token_id_hash: token_id_hash,
        recipient_address: recipient_address,
        contract_address: order.contract_address,
        total_amount: order.total_amount,
        deadline: order.deadline,
        created_at: order.created_at,
        currency: order.currency,
        product_id: reservation.product_id,
        token_id: reservation.token_id,
      },
    });

    // Delete reservation
    await prisma.reservation.delete({
      where: { id: reservation.id },
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    // Type casting error to Error
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // Fallback if error isn't of type Error
      console.error('Unknown error', error);
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
