// src/app/api/quote/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { QuoteResponse, ProductResponse, Pricing } from '@/types'; // Assuming these are defined in src/types

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { products } = await request.json();

    // Define the response and currency totals with explicit types
    const response: QuoteResponse = {
      products: [],
      totals: [],
    };

    const currencyTotals: { [currency: string]: Pricing } = {}; // Define the type for currencyTotals

    for (const product of products) {
      const { product_id, quantity } = product;

      const productData = await prisma.product.findUnique({
        where: { id: parseInt(product_id.toString()) },
        include: { pricing: true },
      });

      if (!productData) {
        return NextResponse.json({ error: `Product with ID ${product_id} not found` }, { status: 404 });
      }

      const productResponse: ProductResponse = {
        product_id: product_id,
        quantity: quantity,
        pricing: [],
      };

      for (const price of productData.pricing) {
        const totalAmount = price.amount * quantity;

        productResponse.pricing.push({
          currency: price.currency,
          currency_type: price.currency_type,
          currency_address: price.currency_address,
          amount: totalAmount,
        });

        if (!currencyTotals[price.currency]) {
          currencyTotals[price.currency] = {
            currency: price.currency,
            currency_type: price.currency_type,
            currency_address: price.currency_address,
            amount: 0,
          };
        }

        currencyTotals[price.currency].amount += totalAmount;
      }

      response.products.push(productResponse); // This now works because of the proper typing
    }

    response.totals = Object.values(currencyTotals);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching product quote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
