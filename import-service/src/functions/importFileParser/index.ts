import * as dotenv from 'dotenv';
dotenv.config();

import { handlerPath } from '@libs';

export const importFileParser = {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: process.env.S3_BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [{ prefix: 'uploaded/' }],
        existing: true
      },
    },
  ],
};
