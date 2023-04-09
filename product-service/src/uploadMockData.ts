import * as dotenv from 'dotenv';
dotenv.config();

import { BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';

import { products } from './mock/products';
import { client } from './utils/client';

const getAllProducts = () => {
  return products.map((product) => {
    return {
      PutRequest: {
        Item: {
          id: { S: product.id },
          title: { S: product.title },
          description: { S: product.description },
          price: { N: product.price.toString() },
        },
      },
    };
  });
};

const getAllStocks = () => {
  return products.map((product) => {
    return {
      PutRequest: {
        Item: {
          product_id: { S: product.id },
          count: { N: product.count.toString() },
        },
      },
    };
  });
};

const putItemsToDynamoDB = async () => {
  const res = await client.send(
    new BatchWriteItemCommand({
      RequestItems: {
        [process.env.PRODUCTS_DYNAMODB_TABLE]: getAllProducts(),
        [process.env.STOCKS_DYNAMODB_TABLE]: getAllStocks(),
      },
      ReturnItemCollectionMetrics: 'SIZE' || 'NONE',
    })
  );

  console.log(res);
};

putItemsToDynamoDB();
