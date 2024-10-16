// src/app/api/confirm/route.ts
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

    await prisma.reservation.delete({
      where: { id: reservation.id },
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
