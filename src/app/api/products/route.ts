import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("GET /api/products called");
    const productData = await prisma.product.findMany();
    console.log("Fetched Product Data: ", productData);
    return NextResponse.json({ productData }, { status: 200 });
  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
