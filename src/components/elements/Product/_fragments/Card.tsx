import { useRouter } from 'next/router';
import Router from 'next/router';
import React, { useRef, useState } from 'react';

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Image,
  Input,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

import instance from '@apis/_axios/instance';

import { CartModal } from '@components/elements/Modal';
import { priceToString } from '@components/hooks';

import { ProductType } from './types';

interface CardProps {
  product: ProductType;
}

function Card({ product }: CardProps) {
  const router = useRouter();
  const gotoDetail = () => {
    router.push(`products/${product.id}`);
  };
  const [quantity, setQunatity] = useState(1);
  const decQuantity = () => {
    if (quantity > 1) {
      setQunatity((quantity: number) => quantity - 1);
    }
  };

  const incQuantity = () => {
    setQunatity((quantity: number) => quantity + 1);
  };

  const postCart = () => {
    instance
      .post('/v1/carts', {
        user: 1,
        product: product.id,
        quantity: quantity,
      })
      .then((res) => {
        console.log(res);
        onClose();
        ModalOpen();
      });
  };

  const SendQuery = () => {
    Router.push({
      pathname: '/order/payment',
      query: {
        product: product.id,
        quantity: quantity,
      },
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: ModalOpen,
    onClose: ModalClose,
  } = useDisclosure();

  return (
    <>
      <Box
        w="full"
        position="relative"
        borderRadius="20px"
        boxShadow="0px 0px 10px rgba(26, 26, 26, 0.1)"
      >
        <Box borderTopRadius="20px" w="full" h="250px">
          <Image
            w="343px"
            h="250px"
            src={product.thumbnailImg}
            onClick={gotoDetail}
            _hover={{ cursor: 'pointer' }}
          />
        </Box>

        <Flex
          flexDir="column"
          alignItems="flex-start"
          px="17px"
          pt="30px"
          pb="20px"
        >
          <Box px="13px">
            <Box {...TitleText}>
              {product.name}
              <span
                style={{
                  paddingLeft: '5px',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '28px',
                  color: '#757983',
                }}
              >
                {product.capacity}ml
              </span>
            </Box>
            <Box {...PriceText} pt="10px">
              {priceToString(product.price)}
              <span
                style={{
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: '29px',
                  color: 'black',
                }}
              >
                원
              </span>
            </Box>
            {product.avgRating.toFixed(1) !== '0.0' && (
              <Flex alignItems="center" {...TitleText}>
                <Image
                  src="/icons/svg/product/star.svg"
                  w="10px"
                  h="10px"
                  alt="star"
                  mr="8px"
                />
                {product.avgRating.toFixed(1)}
                <span
                  style={{
                    paddingLeft: '3px',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '28px',
                    color: '#757983',
                  }}
                >
                  (리뷰 {product.reviewCount}개)
                </span>
              </Flex>
            )}
            <Box {...SubText} pt="25px">
              <Flex flexWrap="wrap">
                {product.hashtags?.map((hashtag) => {
                  return (
                    <Box key={hashtag.id} mr="5px">
                      #{hashtag.name}
                    </Box>
                  );
                })}
              </Flex>
            </Box>
          </Box>

          <Flex justify="space-between" w="100%" pt="20px" pb="10px">
            <Button
              colorScheme="primary"
              w="150px"
              h="50px"
              borderRadius="25px"
              size="sd"
              py="12px"
              onClick={onOpen}
            >
              바로구매
            </Button>
            <Button
              variant="outline"
              colorScheme="primary"
              w="150px"
              h="50px"
              borderRadius="25px"
              size="sd"
              py="12px"
              onClick={onOpen}
            >
              장바구니
            </Button>
          </Flex>
        </Flex>
      </Box>
      <Drawer
        placement="bottom"
        onClose={onClose}
        isOpen={isOpen}
        autoFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent bg="transparent">
          <DrawerBody px="16px" py="20px" bg="white" borderTopRadius="20px">
            <Box>
              <VStack
                alignItems="flex-start"
                p="10px"
                w="full"
                bg="gray.200"
                borderRadius="5px"
              >
                <Box {...SubText}>{product?.name}</Box>
                <Flex justify="space-between" w="full" mt="4px">
                  <Flex h="25px" alignSelf="center">
                    <Box
                      position="relative"
                      bg="white"
                      border="1px solid #EAECF0"
                      borderRadius="5px 0px 0px 5px"
                      p={0}
                      w="25px"
                      h="25px"
                      _after={{
                        content: '""',
                        display: 'block',
                        height: '1px',
                        width: '9px',
                        backgroundColor: '#4A4D55',
                        position: 'absolute',
                        top: '11px',
                        left: '7px',
                      }}
                      _hover={{ cursor: 'pointer' }}
                      onClick={decQuantity}
                    ></Box>
                    <Flex
                      w="23px"
                      h="full"
                      borderTop="1px solid #EAECF0"
                      borderBottom="1px solid #EAECF0"
                    >
                      <Input
                        w="full"
                        h="full"
                        border="none"
                        fontSize="12px"
                        textAlign="center"
                        color="gray.800"
                        p={0}
                        bg="white"
                        value={quantity}
                        readOnly
                      ></Input>
                    </Flex>
                    <Box
                      position="relative"
                      bg="white"
                      border="1px solid #EAECF0"
                      borderRadius="0px 5px 5px 0px"
                      w="25px"
                      h="25px"
                      p={0}
                      _before={{
                        content: '""',
                        display: 'block',
                        width: '1px',
                        height: '9px',
                        backgroundColor: '#4A4D55',
                        position: 'absolute',
                        top: '7px',
                        left: '11px',
                      }}
                      _after={{
                        content: '""',
                        display: 'block',
                        height: '1px',
                        width: '9px',
                        backgroundColor: '#4A4D55',
                        position: 'absolute',
                        top: '11px',
                        left: '7px',
                      }}
                      onClick={incQuantity}
                      _hover={{ cursor: 'pointer' }}
                    ></Box>
                  </Flex>
                  <Flex {...TitleText} color="gray.600" alignItems="center">
                    {priceToString(product?.price)}원
                  </Flex>
                </Flex>
              </VStack>
              <Flex justify="space-between" w="full" pt="15px">
                <Box {...SubText}>
                  총 수량
                  <span style={{ color: '#FF710B' }}> {quantity}</span> 개
                </Box>
                <Box {...SubText}>
                  합계
                  <span style={{ fontWeight: '700' }}>
                    {' '}
                    {priceToString(quantity * product.price)}
                  </span>
                  원
                </Box>
              </Flex>
              <Flex justify="space-between" w="100%" pt="15px" pb="10px">
                <Button
                  colorScheme="primary"
                  w="calc(50% - 6.5px)"
                  h="50px"
                  borderRadius="25px"
                  size="sd"
                  py="12px"
                  onClick={SendQuery}
                >
                  바로구매
                </Button>
                <Button
                  variant="outline"
                  colorScheme="primary"
                  w="calc(50% - 6.5px)"
                  h="50px"
                  borderRadius="25px"
                  size="sd"
                  py="12px"
                  onClick={postCart}
                >
                  장바구니
                </Button>
              </Flex>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <CartModal isOpen={isModalOpen} onClose={ModalClose} />
    </>
  );
}

export default Card;

const TitleText = {
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '28px',
};

const PriceText = {
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '29px',
  color: 'primary.500',
};

const SubText = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '28px',
};
