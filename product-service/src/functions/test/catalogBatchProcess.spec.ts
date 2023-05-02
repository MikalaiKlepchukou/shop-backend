import * as dotenv from 'dotenv';
dotenv.config();

import { TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

import { catalogBatchProcess } from '../catalogBatchProcess/handler';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/client-sns');
jest.mock('../utils/client.ts');

describe('catalogBatchProcess', () => {
  const firstBody = JSON.stringify(
    {
      description: 'ProductOne Description',
      count: 8,
      price: 50,
      title: 'ProductOne',
    },
    null,
    2
  );
  const secondBody = JSON.stringify(
    {
      description: 'ProductTwo Description',
      count: 2,
      price: 22,
      title: 'ProductTwo',
    },
    null,
    2
  );
  const failBody = JSON.stringify(
    {
      description: 'Product Description',
      count: 2,
      price: 22,
    },
    null,
    2
  );

  const mockEvent = { Records: [{ body: firstBody }, { body: secondBody }] };
  const badMockEvent = { Records: [{ body: failBody }] };

  it('should successfully run', async () => {
    await catalogBatchProcess(mockEvent as any);
    expect(SNSClient).toHaveBeenCalledWith({
      region: 'us-east-1',
    });
    expect(TransactWriteItemsCommand).toHaveBeenCalled();
    expect(TransactWriteItemsCommand).toHaveBeenCalledTimes(2);
    expect(PublishCommand).toHaveBeenCalled();
    expect(PublishCommand).toHaveBeenCalledTimes(1);
  });

  it('should return error if invalid ID', async () => {
    const result = await catalogBatchProcess(badMockEvent as any);
    expect(result.body).toEqual(
      JSON.stringify({ message: 'Invalid input data' }, null, 2)
    );
    expect(result.statusCode).toEqual(400);
  });

  it('should return error 500', async () => {
    const result = await catalogBatchProcess({} as any);
    console.log('result: ', result);
    expect(result.statusCode).toEqual(500);
  });
});
