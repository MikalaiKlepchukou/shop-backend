import * as dotenv from 'dotenv';
dotenv.config();

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { client } from '../../utils/client';

const getProduct = async (
  dataBaseName: string,
  keyName: string,
  id: string
) => {
  const params = {
    TableName: dataBaseName,
    Key: marshall({ [keyName]: id }),
  };
  const { Item } = await client.send(new GetItemCommand(params));
  return Item ? unmarshall(Item) : null;
};

export const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { productId } = event.pathParameters;
    console.log('getProductsById load data with param: ', productId);

    const product = await getProduct(
      process.env.PRODUCTS_DYNAMODB_TABLE,
      'id',
      productId
    );
    const stock = await getProduct(
      process.env.STOCKS_DYNAMODB_TABLE,
      'product_id',
      productId
    );

    if (!product || !stock) {
      const error = {
        error: true,
        message: 'Error: product not found',
      };
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(error, null, 2),
      };
    }

    const returningProduct = {
      ...product,
      count: stock.count,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(returningProduct, null, 2),
    };
  } catch (error) {
    console.error('ERROR: on getProductsById', error.message);
    const errorMessage = {
      error: true,
      message: `Error: on get product by id, ${error.message}`,
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
