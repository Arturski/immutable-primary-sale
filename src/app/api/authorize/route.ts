import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { AuthorizeRequest, AuthorizeResponse } from '@/types'; // Import necessary types
import { ApiError } from '@/errors';

const prisma = new PrismaClient();

const createOrder = async (recipientAddress: string, orderProducts: any[]) => {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => { // Add type for 'tx'
    const updatedProducts = [];

    for (const orderProduct of orderProducts) {
      const updatedProduct = await tx.product.update({
        where: { id: orderProduct.product_id },
        data: {
          stockQuantity: { decrement: orderProduct.quantity }
        },
        include: {
          productPrices: true
        }
      });

      // If stock is insufficient, throw an error
      if (updatedProduct.stockQuantity < 0) {
        throw new ApiError(400, `Product with id ${orderProduct.product_id} has insufficient stock for this order`);
      }

      updatedProducts.push(updatedProduct);
    }

    // Create an order with 'reserved' status and associated line items
    const order = await tx.order.create({
      data: {
        status: 'reserved', // Use the string 'reserved' directly or import the OrderStatus enum
        recipientAddress: recipientAddress,
        lineItems: {
          create: updatedProducts.map((product) => ({
            product_id: product.id,
            quantity: orderProducts.find((orderProduct) => orderProduct.product_id === product.id)?.quantity ?? 0
          }))
        }
      },
      include: {
        lineItems: {
          include: {
            product: {
              include: {
                productPrices: true
              }
            }
          }
        }
      }
    });

    return order;
  });
};


export async function POST(request: NextRequest) {
  try {
    // Parse the request body with the appropriate type
    const { recipient_address, currency, products }: AuthorizeRequest = await request.json();

    // Create order and reserve stock
    const order = await createOrder(recipient_address, products);

    // Helper function to populate token details
    const populateDetails = (amount: number, lineItem: any) => {
      const details = [];
      for (let i = 0; i < lineItem.quantity; i++) {
        details.push({
          token_id: String(Math.floor(Math.random() * 10000000000)), // Random token_id, adjust based on your logic
          amount
        });
      }
      return details;
    };

    // Prepare the response
    const response: AuthorizeResponse = {
      reference: order.id,
      currency,
      products: order.lineItems.map((lineItem: any) => {
        const pricing = lineItem.product.productPrices.find((productPrice: any) => productPrice.currency_name === currency);
        if (!pricing) {
          throw new ApiError(404, `Product with id ${lineItem.product_id} does not have pricing for currency ${currency}`);
        }

        return {
          product_id: lineItem.product_id,
          collection_address: lineItem.product.collectionAddress,
          contract_type: lineItem.product.contractType,
          detail: populateDetails(pricing.amount, lineItem)
        };
      })
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error processing authorization:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
