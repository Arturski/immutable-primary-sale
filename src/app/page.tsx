"use client"; // <-- Ensure this is at the very top

import { Flex, Heading, SimpleGrid, Spinner, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AppHeaderBar } from './components/AppHeaderBar/AppHeaderBar';
import { EIP1193ContextProvider } from './contexts/EIP1193Context';
import { CheckoutProvider } from './contexts/CheckoutContext';
import { checkoutInstance } from './immutable/checkout';
import { SimpleProduct } from './types/simpleProduct';
import { SaleCard } from './components/SaleCard/SaleCard';
import config, { applicationEnvironment } from './config/config';

export default function Home() {
  const { primarySaleBackendUrl, hubEnvironmentId } = config[applicationEnvironment];
  const [isSimplifiedSale, setIsSimplifiedSale] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Initialize products as an empty array
  const [products, setProducts] = useState<SimpleProduct[]>([]);

  useEffect(() => {
    const getStorefrontProducts = async () => {
      setLoading(true);
      try {
        let storefrontProducts: SimpleProduct[] = [];
        if (isSimplifiedSale) {
          storefrontProducts = await (
            await fetch(`${primarySaleBackendUrl}/${hubEnvironmentId}/products`)
          ).json();
        } else {
          const res = await fetch('/api/products');
          const data = await res.json();
  
          console.log('Fetched data from /api/products:', data); // Confirm fetched data structure
          console.log('Type of data:', typeof data);
          console.log('Type of data.productData:', typeof data.productData);
  
          // Test with direct assignment to check data flow
          storefrontProducts = Array.isArray(data) ? data : data.productData || []; 
          console.log('Setting storefrontProducts:', storefrontProducts); // Confirm final structure before setProducts
        }
  
        setProducts(storefrontProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        toast({
          status: 'error',
          title: 'Could not get products for sale',
          duration: 4000,
          position: 'bottom-right'
        });
      } finally {
        setLoading(false);
      }
    };
    getStorefrontProducts();
  }, [toast, isSimplifiedSale]);
  
  // Check products state after setting
  useEffect(() => {
    console.log('Updated products state:', products);
  }, [products]);
  
  return (
    <EIP1193ContextProvider>
      <CheckoutProvider checkout={checkoutInstance}>
        <AppHeaderBar isSimplifiedSale={isSimplifiedSale} setSimplifiedSale={setIsSimplifiedSale} />
        <Flex px={4} flexDir={'column'}>
          <Heading mb={4}>Primary Sale</Heading>
          <Flex px={4} pb={4} justifyContent={'center'} flexWrap={'wrap'} overflowY={'auto'}>
            {loading && <Spinner />}
            <SimpleGrid width={'100%'} minChildWidth={'330px'} gap={2}>
              {
                !loading && products.length > 0 && products.map((product) => {
                console.log('Rendering product:', product); // Log each product to ensure it's iterating
                return <SaleCard key={product.product_id} product={product} />;
              })}
            </SimpleGrid>

          </Flex>
        </Flex>
      </CheckoutProvider>
    </EIP1193ContextProvider>
  );
}
