import * as dotenv from 'dotenv';
dotenv.config();

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const client = new DynamoDBClient({
  region: process.env.REGION,
});
