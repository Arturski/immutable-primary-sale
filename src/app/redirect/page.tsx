"use client";

import React, { useEffect } from 'react';
import { passportInstance } from '../immutable/passport';
import { Flex, Spinner } from '@chakra-ui/react';

function Redirect() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      passportInstance.loginCallback();
    }
  }, []);

  return (
    <Flex flexDir={'column'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
      <Spinner size={'lg'} />
    </Flex>
  );
}

export default Redirect;
