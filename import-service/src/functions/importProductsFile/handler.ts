import * as dotenv from 'dotenv';
dotenv.config();

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const importProductsFile = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const fileName = event.queryStringParameters?.name;
    console.log('importProductsFile lambda triggered, file name: ', fileName);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploaded/${fileName}`,
      ContentType: 'text/csv',
    });
    const client = new S3Client({ region: 'us-east-1' });
    const response = await getSignedUrl(client, command, { expiresIn: 3600 });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: response,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: true, message: error.message }, null, 2),
    };
  }
};
