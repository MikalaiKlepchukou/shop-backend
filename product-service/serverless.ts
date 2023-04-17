import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
dotenv.config();

import { getProductsList, getProductsById, createProduct } from '@functions';

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
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*'],
            Resource: '*',
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
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
