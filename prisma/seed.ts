import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const ethCurrency = await prisma.currency.upsert({
        where: { name: 'ETH' },
        update: {},
        create: {
            name: 'ETH',
            type: 'crypto'
        }
    });

    await prisma.product.upsert({
        where: { id: 'vi7age4ku18qynwbk4wx90ge' },
        update: {},
        create: {
            id: 'vi7age4ku18qynwbk4wx90ge',
            name: 'Shark',
            description: 'Evo Shark NFTs',
            image: 'https://zacharycouchman.github.io/bb-example-metadata/tokens/Wil_BBH_HeroIcon_1.webp',
            stockQuantity: 5000,
            status: 'active',
            collectionAddress: '0x979013fa9be5acc6d31bf0c067c9677e9ea12864',
            contractType: 'ERC721',
            productPrices: {
                create: [
                    {
                        currency_name: ethCurrency.name,
                        amount: 1,
                    },
                ],
            },
        },
    });

    await prisma.product.upsert({
        where: { id: 'jtwrclpj0v1zab865ne893hb' },
        update: {},
        create: {
            id: 'jtwrclpj0v1zab865ne893hb',
            name: 'Another Product',
            description: 'Another NFT skin',
            image: 'https://example.com/another-image.webp',
            stockQuantity: 50,
            status: 'active',
            collectionAddress: '0x979013fa9be5acc6d31bf0c067c9677e9ea12864',
            contractType: 'ERC721',
            productPrices: {
                create: [
                    {
                        currency_name: ethCurrency.name,
                        amount: 1,
                    },
                ],
            },
        },
    });
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
