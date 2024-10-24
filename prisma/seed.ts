import { PrismaClient } from "@prisma/client";
import 'dotenv/config'

const prisma = new PrismaClient();

// For this seed script, we will create a few products and currencies
// that we will use to demonstrate the API functionality

// This is a fake collection address. In a real scenario, this would be the address of the product's collection address.
const collectionAddress = '0x979013fa9be5acc6d31bf0c067c9677e9ea12864';

async function main() {
    const bgt = await prisma.currency.upsert({
        where: { name: 'ETH' },
        update: {},
        create: {
            name: 'ETH',
            type: 'crypto'
        }
    });

    const productId1 = 'vi7age4ku18qynwbk4wx90ge';

    await prisma.product.upsert({
        where: { id: productId1 },
        update: {},
        create: {
            id: productId1,
            collectionAddress: collectionAddress,
            contractType: 'ERC721',
            stockQuantity: 5000,
            productPrices: {
                create: [
                    {
                        currency_name: bgt.name,
                        amount: 1
                    }
                ]
            }
        }
    })

    const productId2 = 'jtwrclpj0v1zab865ne893hb';

    await prisma.product.upsert({
        where: { id: productId2 },
        update: {},
        create: {
            id: productId2,
            collectionAddress: collectionAddress,
            contractType: 'ERC721',
            stockQuantity: 50,
            productPrices: {
                create: [
                    {
                        currency_name: bgt.name,
                        amount: 1
                    },
                ]
            }
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })