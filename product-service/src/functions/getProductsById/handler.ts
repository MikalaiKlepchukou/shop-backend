import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Product } from '@types';

import { products } from '../../mock/products';

const getProduct = (id: string): Product | undefined =>
  products.find((product) => product.id === id);

export const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { productId } = event.pathParameters;
  const foundProduct = getProduct(productId);

  if (foundProduct) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(foundProduct, null, 2),
    };
  }

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
};
