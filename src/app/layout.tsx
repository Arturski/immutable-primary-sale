// src/app/layout.tsx
import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
