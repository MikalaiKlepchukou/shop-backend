import { handlerPath } from '@libs/handler-resolver';

export const createProduct = {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        responses: {
          200: {
            description: 'created Product API response',
            bodyType: 'Product'
          }
        }
      },
    },
  ],
};
