// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const uncommon = await prisma.product.create({
    data: {
      name: 'Farmer Fin',
      description: 'Harvest the victory! Dive into the rural rumble with Farmer Fin, the toughest shark in the pasture!',
      rarity: 'uncommon',
      contract_address: '0x979013fa9be5acc6d31bf0c067c9677e9ea12864',
      metadata_id: 'none',
      pricing: {
        create: [
          {
            currency: 'BGT',
            currency_type: 'crypto',
            currency_address: '0x1303F139FEac224ff877e6071C782A41C30F3255',
            amount: 5,
          },
        ],
      },
    },
  });

  console.log('Seeded product:', uncommon);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
