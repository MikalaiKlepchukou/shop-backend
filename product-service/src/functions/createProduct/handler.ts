import * as dotenv from 'dotenv';
dotenv.config();

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuid } from 'uuid';

import { client } from '../../utils/client';
import { productDataValidate } from '../../utils/validate';

export const createProduct = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('createProduct create new product with body: ', event.body);
    const data = JSON.parse(event.body);
    const isValid = productDataValidate(data);

    if (!isValid) {
      const errorMessage = {
        error: true,
        message: `Error: invalid input data`,
      };

      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(errorMessage, null, 2),
      };
    }

    const { title, description, count, price } = data;
    const id = uuid();
    const newProduct = { id, title, description, price };
    const newStock = { product_id: id, count };
    await client.send(
      new TransactWriteItemsCommand({
        TransactItems: [
          {
            Put: {
              TableName: process.env.PRODUCTS_DYNAMODB_TABLE,
              Item: marshall(newProduct),
            },
          },
          {
            Put: {
              TableName: process.env.STOCKS_DYNAMODB_TABLE,
              Item: marshall(newStock),
            },
          },
        ],
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(
        {
          product: { ...newProduct, count },
        },
        null,
        2
      ),
    };
  } catch (error) {
    const errorMessage = {
      error: true,
      message: `Error: on get product list, ${error.message}`,
    };
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(errorMessage, null, 2),
    };
  }
};
