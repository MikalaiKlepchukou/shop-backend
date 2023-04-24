import { handlerPath } from '@libs';

export const importProductsFile = {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings : {
              name: true
            }
          }
        },
      },
    },
  ],
};
