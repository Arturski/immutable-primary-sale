// src/app/api/authorize/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import serverConfig, { environment } from '@/config'; // Import server config based on the environment
import { AuthorizeRequest, AuthorizeResponse, AuthorizeProductResponse } from '@/types'; // Import necessary types

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body with the appropriate type
    const { recipient_address, currency, products }: AuthorizeRequest = await request.json();

    // Fetch the reservation time from the config based on the current environment
    const reservationTimeMs = parseInt(serverConfig[environment].RESERVATION_TIME) || 300000;

    // Generate a reference for the order
    const response: AuthorizeResponse = {
      reference: `O${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      currency: currency,
      products: [],
    };

    // Calculate the reservation expiration time
    const now = new Date();
    const expiresAt = new Date(now.getTime() + reservationTimeMs);

    // Start the transaction for reservation
    await prisma.$transaction(async (prisma) => {
      for (const product of products) {
        const { product_id, quantity } = product;

        // Find available stock items
        const availableStockItems = await prisma.stockItem.findMany({
          where: { product_id: parseInt(product_id.toString()), available: true },
          include: { Product: true },
          take: quantity,
        });

        // If not enough stock items are found
        if (availableStockItems.length < quantity) {
          throw new Error(`Not enough stock for product ID ${product_id}`);
        }

        for (const stockItem of availableStockItems) {
          const productResponse: AuthorizeProductResponse = {
            product_id: product_id,
            collection_address: stockItem.Product.contract_address,
            contract_type: 'ERC721', // assuming ERC721 here
            detail: [{ token_id: stockItem.token_id, amount: 1 }],
          };

          // Create a reservation
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

          // Update stock item to mark it as unavailable
          await prisma.stockItem.update({
            where: { id: stockItem.id },
            data: { available: false },
          });

          // Add product response to the response array
          response.products.push(productResponse);
        }
      }
    });

    // Return the response with the order details
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error processing authorization:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client is disconnected
  }
}
