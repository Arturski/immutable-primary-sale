import { NextResponse } from 'next/server';
import { PrismaClient, Product, ProductPrice } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("GET /api/products called");
    const productData = await prisma.product.findMany({
      include: { productPrices: true }
    });

    console.log("Fetched Product Data: ", productData);

    // Map over productData with explicit typing for product
    const products = productData.map((product: Product & { productPrices: ProductPrice[] }) => ({
      product_id: product.id,
      name: product.name, // Ensure name exists on Product model
      description: product.description, // Ensure description exists on Product model
      image: product.image, // Ensure image exists on Product model
      quantity: product.stockQuantity,
      collection: {
        collection_address: product.collectionAddress,
        collection_type: product.contractType,
      },
      limits: {
        enabled: false
      },
      status: product.status, // Ensure status exists on Product model
      pricing: product.productPrices.map((price: ProductPrice) => ({
        amount: price.amount,
        currency: price.currency_name,
      })),
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
