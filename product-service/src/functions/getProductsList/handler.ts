import { APIGatewayProxyResult } from 'aws-lambda';

import { products } from '../../mock/products';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(products, null, 2),
  };
};
