// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create the uncommon product
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

  // Create the rare product
  const rare = await prisma.product.create({
    data: {
      name: 'Sergeant Splash',
      description: 'Lock, load, and launch! Join Sergeant Splash, the elite of the ocean, on his city safeguarding missions!',
      rarity: 'legendary',
      contract_address: '0x979013fa9be5acc6d31bf0c067c9677e9ea12864',
      metadata_id: 'none',
      pricing: {
        create: [
          {
            currency: 'BGT',
            currency_type: 'crypto',
            currency_address: '0x1303F139FEac224ff877e6071C782A41C30F3255',
            amount: 10,
          },
        ],
      },
    },
  });

  // Create the legendary product
  const legendary = await prisma.product.create({
    data: {
      name: 'Cybershark',
      description: 'Metal, might, and megabytes! Gear up with Cybershark, the future of underwater warfare!',
      rarity: 'legendary',
      contract_address: '0x979013fa9be5acc6d31bf0c067c9677e9ea12864',
      metadata_id: 'none',
      pricing: {
        create: [
          {
            currency: 'BGT',
            currency_type: 'crypto',
            currency_address: '0x1303F139FEac224ff877e6071C782A41C30F3255',
            amount: 15,
          },
        ],
      },
    },
  });

  // Function to add stock items for a product
  const addStockItems = async (productId: number, tokenIdStart: number, tokenIdEnd: number) => {
    for (let tokenId = tokenIdStart; tokenId <= tokenIdEnd; tokenId++) {
      await prisma.stockItem.create({
        data: {
          product_id: productId,
          token_id: tokenId.toString(),
        },
      });
    }
  };

  // Add stock items for each product
  await addStockItems(uncommon.id, 1, 2000);
  await addStockItems(rare.id, 2001, 3000);
  await addStockItems(legendary.id, 3001, 3500);

  console.log('Seeded products and stock items.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
