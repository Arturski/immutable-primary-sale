import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { QuoteResponse, ProductResponse, Pricing } from '@/types';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { products } = await request.json();

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'No products provided' }, { status: 400 });
    }

    const response: QuoteResponse = {
      products: [],
      totals: [],
    };

    const currencyTotals: { [currency: string]: Pricing } = {}; // Define the type for currencyTotals

    for (const product of products) {
      const { product_id, quantity } = product;

      // Ensure product_id is treated as a string
      if (typeof product_id !== 'string') {
        return NextResponse.json({ error: `Invalid product ID format: ${product_id}` }, { status: 400 });
      }

      const productData = await prisma.product.findUnique({
        where: { id: product_id }, // Prisma expects the ID to be a string
        include: { productPrices: { include: { currency: true } } }, // Corrected field to productPrices with currency include
      });

      if (!productData) {
        return NextResponse.json({ error: `Product with ID ${product_id} not found` }, { status: 404 });
      }

      const productResponse: ProductResponse = {
        product_id: product_id,
        quantity: quantity,
        pricing: [],
      };

      for (const price of productData.productPrices) {
        if (!price.currency || !price.currency.type) {
          console.error(`Currency or currency type missing for product ${product_id}`);
          continue; // Skip if currency data is missing
        }

        const totalAmount = price.amount * quantity;

        productResponse.pricing.push({
          currency: price.currency_name,
          currency_type: price.currency.type,
          amount: totalAmount
        });

        if (!currencyTotals[price.currency_name]) {
          currencyTotals[price.currency_name] = {
            currency: price.currency_name,
            currency_type: price.currency.type,
            amount: 0,
          };
        }

        currencyTotals[price.currency_name].amount += totalAmount;
      }

      response.products.push(productResponse);
    }

    response.totals = Object.values(currencyTotals);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching product quote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
