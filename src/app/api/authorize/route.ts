// src/app/api/authorize/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { recipient_address, currency, products } = await request.json();
  const reservationTimeMs = parseInt(process.env.RESERVATION_TIME_MS || '300000');
  
  try {
    const response = {
      reference: `O${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      currency: currency,
      products: [],
    };

    const now = new Date();
    const expiresAt = new Date(now.getTime() + reservationTimeMs);

    await prisma.$transaction(async (prisma) => {
      for (const product of products) {
        const { product_id, quantity } = product;
        const availableStockItems = await prisma.stockItem.findMany({
          where: { product_id: parseInt(product_id.toString()), available: true },
          include: { Product: true },
          take: quantity,
        });

        if (availableStockItems.length < quantity) {
          throw new Error(`Not enough stock for product ID ${product_id}`);
        }

        for (const stockItem of availableStockItems) {
          const productResponse = {
            product_id: product_id,
            collection_address: stockItem.Product.contract_address,
            contract_type: 'ERC721',
            detail: [{ token_id: stockItem.token_id, amount: 1 }],
          };

          await prisma.reservation.create({
            data: {
              reference: response.reference,
              product_id: parseInt(product_id.toString()),
              token_id: stockItem.token_id,
              currency: currency,
              recipient_address: recipient_address,
              expires_at: expiresAt,
              quantity: 1,
            },
          });

          await prisma.stockItem.update({
            where: { id: stockItem.id },
            data: { available: false },
          });

          response.products.push(productResponse);
        }
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
