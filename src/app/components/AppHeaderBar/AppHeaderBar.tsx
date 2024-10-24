import { Box, Button, Flex, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, theme, useColorMode } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useCallback, useContext } from 'react'
import { passportInstance } from '../../immutable/passport';
import { shortenAddress } from '../..//utils/walletAddress';
import ImxBalance from '../ImxBalance/ImxBalance';
import { CalendarIcon, ChevronDownIcon, MoonIcon, StarIcon, SunIcon } from '@chakra-ui/icons';
import { CheckoutContext } from '../../contexts/CheckoutContext';
import { WidgetType } from '@imtbl/sdk/checkout';
import { EIP1193Context } from '../../contexts/EIP1193Context';
interface AppHeaderBar {
  isSimplifiedSale: boolean;
  setSimplifiedSale: Dispatch<SetStateAction<boolean>>;
}
export function AppHeaderBar({isSimplifiedSale, setSimplifiedSale}: AppHeaderBar) {
  const {colorMode,toggleColorMode} = useColorMode();
  const {walletAddress, provider, setProvider, isPassportProvider} = useContext(EIP1193Context);
  const {openWidget} = useContext(CheckoutContext);

  const logout = useCallback(() => {
    if(isPassportProvider) passportInstance.logout();
    else setProvider(null);
  }, [isPassportProvider, setProvider]);

  return (
    <Flex as={'nav'} 
      width={'100vw'} 
      height={'auto'} 
      p={4} 
      flexDirection={"row"} 
      alignItems={"center"} 
      justifyContent={"space-between"}
      bg={theme.colors.transparent}
      zIndex={5}
      >
      <Box></Box>
      <Flex gap={4}>
        <Button aria-label={'sale-type'} onClick={() => setSimplifiedSale(prev => !prev)} leftIcon={isSimplifiedSale ? <CalendarIcon /> : <StarIcon />}>{isSimplifiedSale ? "Hosted": 'Hub'}</Button>
        <IconButton aria-label={'color-mode'} onClick={toggleColorMode} icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon /> } />
        {(!walletAddress || !provider) 
          ? (<Button variant="solid" colorScheme='blue' onClick={() => openWidget(WidgetType.CONNECT)}>Connect Wallet</Button>) //(<PassportButton title="Sign in with Immutable" onClick={login} />) 
          : (
          <Menu>
            <MenuButton as={Button} colorScheme='blue' rightIcon={<ChevronDownIcon />}>
              <Flex flexDirection="column">
                <Text>{shortenAddress(walletAddress)}</Text>
              </Flex>
            </MenuButton>
            <MenuList minW={40} w={60}>
              <ImxBalance />
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </Flex>
  )
}