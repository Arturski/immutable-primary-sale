import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const { reference } = await request.json();

    // Find the order with the reference
    const order = await prisma.order.findUnique({
      where: {
        id: reference
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'reserved') {
      return NextResponse.json({ error: 'Order is not reserved' }, { status: 400 });
    }

    // Update the order status to 'expired'
    await prisma.order.update({
      where: {
        id: reference
      },
      data: {
        status: 'expired'
      }
    });

    // Fetch all line items associated with the order
    const lineItems = await prisma.orderLineItem.findMany({
      where: {
        order_id: reference
      }
    });

    // Loop through line items and update the stock for each product
    for (const lineItem of lineItems) {
      await prisma.product.update({
        where: {
          id: lineItem.product_id
        },
        // Increment the stock quantity by the ordered quantity since we are expiring the order
        data: {
          stockQuantity: {
            increment: lineItem.quantity
          }
        }
      });
    }

    // Return a success response
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error expiring order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
