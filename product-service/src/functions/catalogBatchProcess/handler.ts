import * as dotenv from 'dotenv';
dotenv.config();

import { SQSEvent } from 'aws-lambda';
import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { v4 as uuid } from 'uuid';

import { client } from '../../utils/client';
import { productDataValidate } from '../../utils/validate';

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    const snsClient = new SNSClient({ region: 'us-east-1' });
    console.log('event.Records.length: ', event.Records.length);
    for (const record of event.Records) {
      const inputData = JSON.parse(record.body);
      console.log('inputData: ', inputData);

      const isValidInputData = productDataValidate(inputData);
      console.log('isValidInputData: ', isValidInputData);
      if (!isValidInputData)
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(
            {
              error: true,
              message: 'Invalid input data',
            },
            null,
            2
          ),
        };

      const { title, description, count, price } = inputData;
      const id = uuid();
      const newProduct = { id, title, description, price: +price };
      const newStock = { product_id: id, count: +count };

      console.log('prepare to write to DB product: ', newProduct);
      await client.send(
        new TransactWriteItemsCommand({
          TransactItems: [
            {
              Put: {
                TableName: process.env.PRODUCTS_DYNAMODB_TABLE,
                Item: marshall(newProduct),
              },
            },
            {
              Put: {
                TableName: process.env.STOCKS_DYNAMODB_TABLE,
                Item: marshall(newStock),
              },
            },
          ],
        })
      );
      const createdProduct = { ...newProduct, count };

      console.log(
        'prepare to send email with createdProducts: ',
        createdProduct
      );
      await snsClient.send(
        new PublishCommand({
          Subject: 'New product created!',
          Message: JSON.stringify(createdProduct),
          TopicArn: process.env.SNS_ARN,
        })
      );
    }
  } catch (error) {
    console.error(error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: true, message: error.message }, null, 2),
    };
  }
};
