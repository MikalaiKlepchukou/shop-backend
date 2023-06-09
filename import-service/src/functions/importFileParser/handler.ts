import * as dotenv from 'dotenv';
dotenv.config();

import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Readable } from 'stream';
import csv from 'csv-parser';

export const importFileParser = async (
  event
): Promise<APIGatewayProxyResult> => {
  try {
    const records = event.Records;
    console.log('importFileParser Lambda triggered, records:', records);
    const bucketName = process.env.S3_BUCKET_NAME;
    const client = new S3Client({ region: 'us-east-1' });
    const sqsClient = new SQSClient({ region: 'us-east-1' });

    for (const record of records) {
      const objectName = record.s3.object.key;
      const pathToObject = `${bucketName}/${objectName}`;
      const newObjectPath = objectName.replace('uploaded', 'parsed');
      const command = { Bucket: bucketName, Key: objectName };
      const copyCommand = {
        Bucket: bucketName,
        CopySource: pathToObject,
        Key: newObjectPath,
      };

      const readableStream = (await client.send(new GetObjectCommand(command)))
        .Body as Readable;
      readableStream.pipe(csv()).on('data', (data) => {
        sqsClient.send(
          new SendMessageCommand({
            MessageBody: JSON.stringify(data),
            QueueUrl: process.env.SQS_URL,
          })
        );
      });

      await client.send(new CopyObjectCommand(copyCommand));
      await client.send(new DeleteObjectCommand(command));
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(
        {
          error: true,
          message: 'incoming data parsed and moved to SQS',
        },
        null,
        2
      ),
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
