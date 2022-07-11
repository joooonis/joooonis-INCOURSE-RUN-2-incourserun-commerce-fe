import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { SERVER_URL } from '@components/elements/urls';
import { dateToString, findProduct } from '@components/hooks';

import SingleOrder from './SingleOrder';
import { OrderType, ProductType } from './types';

function Order() {
  const [orders, setOrders] = useState<OrderType[]>();
  const [products, setProducts] = useState<ProductType[]>();

  useEffect(() => {
    axios
      .get(SERVER_URL.LOCAL + '/v1/orders', {
        params: {
          user: 1, //여기에서 user id 를 수정합니다.
        },
      })
      .then((res) => setOrders(res.data));

    axios
      .get(SERVER_URL.LOCAL + '/v1/products')
      .then((res) => setProducts(res.data));
  }, []);

  return (
    <Box pt="130px" px="16px" pb="50px">
      <Box {...TitleStyle} w="full">
        주문내역
      </Box>
      <Box h="80px"></Box>
      <Tabs variant="unstyled" size="sm">
        <TabPanels>
          {orders &&
            orders.map((order) => {
              const date = dateToString(order.createdAt);
              const dateString = date.year + date.month + date.date;
              return (
                <TabPanel key={order.id} py={0}>
                  <Box {...TitleText} w="full" py="19px">
                    [{date.year} - {date.month} - {date.date}]
                  </Box>
                  {order.orderProducts &&
                    products &&
                    order.orderProducts.map((orderProduct) => {
                      const targeProduct = findProduct(
                        products,
                        orderProduct.product,
                      );
                      return (
                        <SingleOrder
                          id={orderProduct.id}
                          key={orderProduct.id}
                          createdAt={dateString}
                          product={targeProduct}
                          quantity={orderProduct.quantity}
                          hasReview={orderProduct.hasReview}
                          shippingStatus={orderProduct.shippingStatus}
                          isFreeDelivery={order.totalPrice >= 30000}
                        ></SingleOrder>
                      );
                    })}
                </TabPanel>
              );
            })}
        </TabPanels>
        <TabList
          py="30px"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          {orders &&
            orders.map((order, index) => {
              return (
                <Tab key={index} {...TabStyle} _selected={{ color: '#1A1A1A' }}>
                  {index}
                </Tab>
              );
            })}
        </TabList>
      </Tabs>
    </Box>
  );
}

export default Order;

const TitleStyle = {
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '29px',
};

const TitleText = {
  fontWeight: 700,
  fontSize: '12px',
  lineHeight: '18px',
};

const TabStyle = {
  fontWeight: 700,
  fontSize: '16px',
  lineHeight: '28px',
  color: 'gray.400',
};
