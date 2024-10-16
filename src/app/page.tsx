// src/app/page.tsx
"use client"; // <-- Add this at the very top of the file

import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    const res = await fetch('/api/products'); // Assuming the products API is set up
    const data = await res.json();
    setMessage(JSON.stringify(data, null, 2));
  };

  return (
    <Box textAlign="center" mt={10}>
      <Heading as="h1">Welcome to Next.js with Chakra UI</Heading>
      <Text mt={5}>Click the button to fetch products from the backend API:</Text>
      <Button colorScheme="teal" mt={5} onClick={fetchProducts}>
        Fetch Products
      </Button>
      {message && (
        <Box mt={5} p={3} border="1px solid teal" borderRadius="md">
          <pre>{message}</pre>
        </Box>
      )}
    </Box>
  );
}
