// src/app/api/quote/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { products } = await req.json();

  try {
    const response = {
      products: [],
      totals: [],
    };

    const currencyTotals: { [key: string]: any } = {};

    for (const product of products) {
      const { product_id, quantity } = product;

      // Fetch product pricing from the database
      const productData = await prisma.product.findUnique({
        where: { id: parseInt(product_id.toString()) },
        include: {
          pricing: true,
        },
      });

      if (!productData) {
        return NextResponse.json({ error: `Product with ID ${product_id} not found` }, { status: 404 });
      }

      const productResponse: any = {
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

      response.products.push(productResponse);
    }

    response.totals = Object.values(currencyTotals);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching product quote:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
