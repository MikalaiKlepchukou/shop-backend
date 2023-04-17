import { handlerPath } from '@libs/handler-resolver';

export const getProductsById = {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        responses: {
          200: {
            description: 'get Product by ID API response',
            bodyType: 'Product',
          },
        },
      },
    },
  ],
};
