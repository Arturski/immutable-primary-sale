// src/app/page.tsx
"use client"; // <-- Add this at the very top of the file

import { Flex, Heading, SimpleGrid, Spinner, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AppHeaderBar } from './components/AppHeaderBar/AppHeaderBar';
import { EIP1193ContextProvider } from './contexts/EIP1193Context';
import { CheckoutProvider } from './contexts/CheckoutContext';
import { checkoutInstance } from './immutable/checkout';
import { SimpleProduct } from './types/simpleProduct';
import { SaleCard } from './components/SaleCard/SaleCard';
import config, { applicationEnvironment } from './config/config';

const advancedProductsMock = [
  {
    collection: {
        collection_address: "0xcee38e2ff47d672e426269d6b8508fbebd7561ca",
        collection_type: "ERC721"
    },
    description: "Wil NFT skin",
    image: "https://zacharycouchman.github.io/bb-example-metadata/tokens/Wil_BBH_HeroIcon_1.webp",
    limits: {
        enabled: false
    },
    name: "BB Example Wil",
    pricing: [
        {
            amount: 1,
            currency: "USDC"
        }
    ],
    product_id: "BB1",
    quantity: 99,
    status: "active"
  }
];


export default function Home() {
  const {primarySaleBackendUrl, hubEnvironmentId} = config[applicationEnvironment];
  const [isSimplifiedSale, setIsSimplifiedSale] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const [products, setProducts] = useState<SimpleProduct[]>([]);

  useEffect(() => {
    const getStorefrontProducts = async () => {
      setLoading(true);
      try{
        let storefrontProducts = []
        if(isSimplifiedSale) {
          storefrontProducts = await (
            await fetch(`${primarySaleBackendUrl}/${hubEnvironmentId}/products`)
          ).json();
          console.log(storefrontProducts)
        } else {
          const res = await fetch('/api/products');
          const data = await res.json();
          console.log(data)
          storefrontProducts = advancedProductsMock; // replace when backend is updated
        }
        setProducts(storefrontProducts);
      } catch(err) {
        console.log(err);
        toast({
          status: 'error',
          title: 'Could not get products for sale',
          duration: 4000,
          position: 'bottom-right'
        })
      } finally {
        setLoading(false)
      }
    }
    getStorefrontProducts();
  }, [toast, isSimplifiedSale])

  return (
    <EIP1193ContextProvider>
      <CheckoutProvider checkout={checkoutInstance}>
        <AppHeaderBar isSimplifiedSale={isSimplifiedSale} setSimplifiedSale={setIsSimplifiedSale}/>
        <Flex px={4} flexDir={'column'}>
          <Heading mb={4}>Primary Sale</Heading>
          <Flex px={4} pb={4} justifyContent={'center'} flexWrap={'wrap'} overflowY={'auto'}>
            {loading && <Spinner />}
            <SimpleGrid width={'100%'} minChildWidth={'330px'} gap={2}>
            {!loading && products.length > 0 && products.map((product) => <SaleCard key={product.product_id} product={product} />)}
            </SimpleGrid>
            {/* {!loading && products.length > 0 && products.map((product) => <SaleCard key={product.product_id} product={product} />)} */}
          </Flex>
        </Flex>
      </CheckoutProvider>
    </EIP1193ContextProvider>
  );
}
