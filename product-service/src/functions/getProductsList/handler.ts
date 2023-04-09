import * as dotenv from 'dotenv';
dotenv.config();

import { APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { client } from '../../utils/client';

const getAll = async (dataBaseName: string) => {
  const { Items } = await client.send(
    new ScanCommand({ TableName: dataBaseName })
  );
  return Items.map((item) => unmarshall(item));
};

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  try {
    console.log('getProductsList load data');
    const products = await getAll(process.env.PRODUCTS_DYNAMODB_TABLE);
    const stocks = await getAll(process.env.STOCKS_DYNAMODB_TABLE);
    const availableProductList = products.map((product) => ({
      ...product,
      count: stocks.find((stock) => stock.product_id === product.id).count,
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(availableProductList, null, 2),
    };
  } catch (error) {
    console.error('ERROR: on getProductsList', error.message);
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
