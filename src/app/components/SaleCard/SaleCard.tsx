import { Button, Card, CardBody, CardFooter, Image as ChakraImage, Flex, HStack, Heading, IconButton, Text, VStack, theme, useColorModeValue } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { EIP1193Context } from "../../contexts/EIP1193Context";
import { CheckoutContext } from "../../contexts/CheckoutContext";
import { SaleWidgetParams, WidgetType } from "@imtbl/sdk/checkout";
import config, { applicationEnvironment } from "../../config/config";
import { SimpleProduct } from "@/types";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { TokenETH } from "@web3icons/react";

interface SaleCard {
  product: SimpleProduct;
}
export function SaleCard({product}: SaleCard) {
  const cardBackground = useColorModeValue("gray.100", 'gray.700');
  const cardColorScheme = 'blue';
  const {walletAddress, provider} = useContext(EIP1193Context);
  const {openWidget} = useContext(CheckoutContext);
  const [quantity, setQuantity] = useState(1);

  function increment() {
    setQuantity((prev) => prev === 20 ? 20 : prev + 1);
  }

  function decrement() {
    setQuantity((prev) => prev === 1 ? 1 : prev - 1);
  }

  async function handleBuyNow(product: SimpleProduct, quantity?: number) {
    openWidget(WidgetType.SALE, {
      language: 'en',
      environmentId: config[applicationEnvironment].hubEnvironmentId,
      collectionName: 'Test',
      excludePaymentTypes: ['credit', 'debit'],
      excludeFiatCurrencies: [],
      items: [{
        name: product.name,
        description: product.description,
        productId: product.product_id.toString(),
        qty: quantity ?? 1,
        image: product.image
      }]
    } as SaleWidgetParams)
  }

  return (
    <Card minW="xs" w={["100%", "350px"]} height={'350px'} bgColor={cardBackground}>
      <CardBody>
        <VStack gap={4} alignItems={"center"}>
          {product.image && <ChakraImage 
            src={product.image} 
            alt="Example Image"
            width={"200px"}
            height={"200px"}
            borderRadius={theme.radii.md}
            objectFit={'cover'}
            />}
          <Flex width={'100%'} justifyContent={'space-between'}>
            <Heading size="sm">{product.name}</Heading>
            <HStack minW={15}>
              <ChakraImage src={"https://checkout-cdn.sandbox.immutable.com/v1/blob/img/tokens/0x3b2d8a1931736fc321c24864bceee981b11c3c57.svg"} height={6} />
              <TokenETH size={50} color="#627EEA" />
              <Text fontWeight={'bold'}>{`${product.pricing[0].amount}`}</Text> {/**${product.pricing[0].currency} */}
            </HStack>
          </Flex>
        </VStack>
      </CardBody>
      <CardFooter display={"flex"} flexDirection={"column"}>
        <HStack justifyContent={'space-between'}>
          <HStack gap={2}>
            <IconButton colorScheme={cardColorScheme} size={'sm'} isRound aria-label={"decrement"} onClick={decrement} icon={<MinusIcon />} />
            <Text fontWeight={"bold"} width={'30px'} textAlign={'center'}>{quantity}</Text>
            <IconButton colorScheme={cardColorScheme} size={'sm'} isRound aria-label={"increment"} onClick={increment} icon={<AddIcon />} />
          </HStack>
          <Button 
          variant="solid" 
          minW={36}
          colorScheme={cardColorScheme}
          isDisabled={(!walletAddress || !provider)} 
          onClick={() => handleBuyNow(product, quantity)}
          >
            Buy
          </Button>
        </HStack>
      </CardFooter>
    </Card>
  );
}