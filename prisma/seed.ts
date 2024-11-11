import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ProductPrice {
  currency_name: string;
  amount: number;
}

async function main() {
    // Load data from JSON file
    const seedDataPath = path.join(__dirname, 'seedData.json');
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

    // Upsert currencies
    for (const currency of seedData.currencies) {
        await prisma.currency.upsert({
            where: { name: currency.name },
            update: {},
            create: currency
        });
    }

    // Upsert products
    for (const product of seedData.products) {
        await prisma.product.upsert({
            where: { id: product.id },
            update: {},
            create: {
                ...product,
                productPrices: {
                    create: product.productPrices.map((price: ProductPrice) => ({
                        currency_name: price.currency_name,
                        amount: price.amount
                    }))
                }
            }
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
