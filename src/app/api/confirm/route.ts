import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { reference, tx_hash } = await request.json();

  try {
    // Find the order using the reference (id)
    const order = await prisma.order.findUnique({
      where: { id: reference },
    });

    if (!order) {
      return NextResponse.json({ message: `Order with reference ${reference} not found` }, { status: 404 });
    }

    // Check if the order status is 'reserved' before completing
    if (order.status !== 'reserved') {
      return NextResponse.json({ message: `Order with reference ${reference} is not in a reserved state` }, { status: 400 });
    }

    // Update the order status to 'completed' and store the transaction hash
    await prisma.order.update({
      where: { id: reference },
      data: {
        status: 'completed', // Set order status to completed as a string
        transactionHash: tx_hash, // Store the transaction hash
      },
    });

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error('Error confirming order:', error);

    // Handle and return the error
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
    }
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client is disconnected
  }
}
