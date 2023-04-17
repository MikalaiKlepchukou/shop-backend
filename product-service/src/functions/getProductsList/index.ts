import { handlerPath } from '@libs/handler-resolver';

export const getProductsList = {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        responses: {
          200: {
            description: 'get Products API response',
            bodyType: 'Products',
          },
        },
      },
    },
  ],
};
