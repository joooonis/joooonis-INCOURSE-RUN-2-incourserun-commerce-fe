import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import axios from 'axios';

import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

import { SERVER_URL } from '@components/elements/urls';
import { findProduct, priceToString } from '@components/hooks';

import SinglePay from './SinglePay';
import { FormValues, OrdererType, ProductType, payProductType } from './types';

function Pay() {
  const { register, handleSubmit, setValue, getValues, reset, formState } =
    useForm<FormValues>();

  const router = useRouter();
  const { product, quantity } = router.query;

  const [products, setProducts] = useState<ProductType[]>([]);

  const order = findProduct(products, Number(product));
  const total = order?.price * Number(quantity);

  const [orderer, setOrderer] = useState<OrdererType>();

  useEffect(() => {
    axios
      .get(SERVER_URL.LOCAL + '/v1/products')
      .then((res) => setProducts(res.data));

    axios.get(SERVER_URL.LOCAL + '/v1/users/5').then((res) => {
      setOrderer({
        ...orderer,
        name: res.data.name,
        phone: res.data.phone,
        address: res.data.address,
        addressDetail: res.data.addressDetail,
      });
    });
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setOrderer({
      ...orderer,
      [name]: value,
    });
  };

  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (orderer?.name) setValue('name', orderer?.name);
      if (orderer?.phone) setValue('phone', orderer?.phone);
      if (orderer?.address) setValue('address', orderer?.address);
      if (orderer?.addressDetail)
        setValue('addressDetail', orderer?.addressDetail);
    } else reset();
  };

  const [isPayButtonActive, setIsPayButtonActive] = useState(false);

  const agreementHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPayButtonActive(e.target.checked);
    setValue('totalPrice', total);
    if (getValues('payMethod')) setValue('payMethod', '신용카드');

    const SingleOrderProduct: payProductType = {
      product: Number(product),
      quantity: Number(quantity),
      price: order.price,
    };
    setValue('orderProducts', [SingleOrderProduct]);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack
        spacing={0}
        alignItems="flex-start"
        pt="130px"
        pb="80px"
        px="16px"
      >
        <Box {...TitleText} w="full">
          주문결제
        </Box>
        <Box w="full">
          <Box {...SubTitleText} w="full" pt="80px" pb="11px">
            주문상품
          </Box>
          {order && quantity && (
            <SinglePay product={order} quantity={Number(quantity)}></SinglePay>
          )}
        </Box>
        <Box w="full">
          <Box {...SubTitleText} pt="45px" pb="40px" w="full">
            주문자 정보
          </Box>
          <VStack spacing="50px" w="full" pb="50px" alignItems="flex-start">
            <Box w="full">
              <Text {...NameStyle}>이름</Text>
              <Input
                name="name"
                {...InputStyle}
                placeholder="김인코스런"
                value={orderer?.name}
                onChange={onChange}
              />
            </Box>
            <Box w="full">
              <Text {...NameStyle}>핸드폰 번호</Text>
              <Input
                {...InputStyle}
                name="phone"
                placeholder="010-1234-1234"
                value={orderer?.phone}
                onChange={onChange}
              />
            </Box>
            <Box w="full">
              <Text {...NameStyle}>주소</Text>
              <Flex justify="space-between">
                <Input
                  {...InputStyle}
                  w="249px"
                  name="address"
                  placeholder="울특별시 마포구 성산동  123-3"
                  value={orderer?.address}
                  onChange={onChange}
                />
                <Button
                  colorScheme="primary"
                  w="84px"
                  h="40px"
                  borderRadius="5px"
                  py="11px"
                >
                  우편번호 검색
                </Button>
              </Flex>
              <Input
                {...InputStyle}
                w="full"
                mt="10px"
                name="addressDetail"
                placeholder="성산빌딩 B동 302호"
                value={orderer?.addressDetail}
                onChange={onChange}
              />
            </Box>
          </VStack>
        </Box>
        <Box w="full" h="1px" bg="gray.200"></Box>
        <Box w="full">
          <Flex
            w="full"
            pt="50px"
            pb="40px"
            justify="space-between"
            alignItems="center"
          >
            <Box {...SubTitleText}>배송지 정보</Box>
            <HStack spacing="10px" alignItems="center">
              <Checkbox
                size="lg"
                colorScheme="primary"
                onChange={checkboxHandler}
              />
              <Box color="gray.600">주문자 정보와 동일</Box>
            </HStack>
          </Flex>

          <VStack spacing="50px" w="full" alignItems="flex-start">
            <Box w="full">
              <Text {...NameStyle}>이름</Text>
              <Input
                {...InputStyle}
                placeholder="김인코스런"
                {...register('name', { required: true })}
              />
            </Box>
            <Box w="full">
              <Text {...NameStyle}>핸드폰 번호</Text>
              <Input
                {...InputStyle}
                placeholder="010-1234-1234"
                {...register('phone', { required: true })}
              />
            </Box>
            <Box w="full">
              <Text {...NameStyle}>주소</Text>
              <Flex justify="space-between">
                <Input
                  {...InputStyle}
                  w="249px"
                  placeholder="울특별시 마포구 성산동  123-3"
                  {...register('address', { required: true })}
                />
                <Button
                  colorScheme="primary"
                  w="84px"
                  h="40px"
                  borderRadius="5px"
                  py="11px"
                >
                  우편번호 검색
                </Button>
              </Flex>
              <Input
                {...InputStyle}
                w="full"
                mt="10px"
                placeholder="성산빌딩 B동 302호"
                {...register('addressDetail', { required: true })}
              />
            </Box>
            <Box w="full">
              <Text {...NameStyle}>배송요청사항</Text>
              <Input
                {...InputStyle}
                placeholder="문 앞에 두고 가주세요"
                {...register('shippingRequest')}
              />
            </Box>
          </VStack>
        </Box>
        <Box w="full" h="1px" bg="gray.200"></Box>
        <Box w="full">
          <Box {...SubTitleText} w="full" pt="40px" pb="10px">
            결제수단
          </Box>
          <HStack spacing="16px" w="full" h="90px" alignItems="center">
            <Checkbox
              size="lg"
              colorScheme="primary"
              {...register('payMethod')}
            />
            <Image src="/icons/svg/order/pay.svg" />
            <Box>신용카드결제</Box>
          </HStack>
        </Box>
        <Box w="full">
          <Box {...SubTitleText} w="full" pt="30px" pb="40px">
            최종 결제 금액
          </Box>
          <VStack {...PayText} spacing="10px" w="full" pb="20px">
            <Flex w="full" color="gray.600" justify="space-between">
              <Box>총 상품금액</Box>
              <Box>{priceToString(total)} 원</Box>
            </Flex>
            <Flex w="full" color="gray.600" justify="space-between">
              <Box>총 배송비</Box>
              <Box>{total >= 30000 ? '0 원' : '3,000 원'} </Box>
            </Flex>
          </VStack>
          <Box w="full" h="1px" bg="gray.200"></Box>
          <Flex py="20px" justify="space-between">
            <Box>결제금액</Box>
            <Box fontWeight={700} color="primary.500">
              {priceToString(total)}
            </Box>
          </Flex>
          <Box w="full" h="1px" bg="gray.200"></Box>
          <HStack spacing="10px" w="full" py="20px" alignItems="center">
            <Checkbox
              size="lg"
              colorScheme="primary"
              onChange={agreementHandler}
            />
            <Box color="gray.600">개인정보 수집 이용 동의(필수)</Box>
          </HStack>
        </Box>

        <Flex justify="space-between" w="100%" pt="40px">
          <Button
            {...ButtonText}
            borderRadius="25px"
            colorScheme="primary"
            w="full"
            h="50px"
            py="12px"
            type="submit"
            disabled={!isPayButtonActive}
          >
            결제하기
          </Button>
        </Flex>
      </VStack>
    </form>
  );
}

export default Pay;

const TitleText = {
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '29px',
};

const SubTitleText = {
  fontWeight: '700',
  fontSize: '16px',
  lineHeight: '28px',
};

const InputStyle = {
  variant: 'outline',
  size: 'xs',
  px: '19px',
  py: '5px',
  h: '40px',
  fontSize: '16px',
  outline: '1px solid #1A1A1A',
  borderRadius: '100px',
  lineHeight: '28px',
  _focus: { border: '2px solid #FF710B', outline: 'none' },
  _placeholder: { color: 'gray.400' },
};

const PayText = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '28px',
};

const NameStyle = {
  fontSize: '12px',
  color: 'primary.500',
  fontWeight: 700,
  lineheight: '18px',
  pb: '10px',
};

const ButtonText = {
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '28px',
};
