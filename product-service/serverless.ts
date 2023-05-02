import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
dotenv.config();

import {
  getProductsList,
  getProductsById,
  createProduct,
  catalogBatchProcess,
} from '@functions';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    region: 'us-east-1',
    stage: 'dev',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_DYNAMODB_TABLE: process.env.PRODUCTS_DYNAMODB_TABLE,
      STOCKS_DYNAMODB_TABLE: process.env.STOCKS_DYNAMODB_TABLE,
      SQS_URL: { Ref: 'SQSQueue' },
      SNS_ARN: { Ref: 'SNSTopic' },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*'],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['sqs:*'],
            Resource: {
              'Fn::GetAtt': ['SQSQueue', 'Arn'],
            },
          },
          {
            Effect: 'Allow',
            Action: ['sns:*'],
            Resource: {
              Ref: 'SNSTopic',
            },
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      createProductSNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.EMAIL,
          Protocol: 'email',
          TopicArn: { Ref: 'SNSTopic' },
        },
      },
      MyNewFilteredProductsSNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: process.env.ADDITIONAL_EMAIL,
          Protocol: 'email',
          TopicArn: { Ref: 'SNSTopic' },
          FilterPolicyScope: 'MessageBody',
          FilterPolicy: { price: [{ numeric: ['>=', 105] }] },
        },
      },
    },
  },
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      host: 'j7x45oqwpa.execute-api.us-east-1.amazonaws.com',
      useStage: true,
      basePath: '/dev',
      schemes: ['https'],
    },
  },
};

module.exports = serverlessConfiguration;
