import type { Serverless } from 'serverless/aws';

const customBucket = 'auswertung-csv'
const corsConfiguration = {
  origins: ['*'],
  headers: [
    'Accept',
    'Origin',
    'DNT',
    'User-Agent',
    'Referer',
    'Content-Type',
    'Authorization',
    'x-amz-security-token',
    'x-amz-date',
    'Access-Control-Allow-Origin'
  ]
}

const serverlessConfiguration: Serverless = {
  service: {
    name: 'auswertung-service'
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-central-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${customBucket}`
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${customBucket}/*`
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    auswertung: {
      handler: './src/handler.restrict',
      events: [
        {
          http: {
            method: 'get',
            cors: corsConfiguration,
            path: 'auswertung/{file}',
            request: {
              parameters: {
                paths: {
                  file: true
                }
              }
            },
            authorizer: {
              type: 'aws_iam'
            }
          }
        }
      ]
    },
    createDownloadUrl: {
      handler: './src/handler.createDownloadUrl',
      events: [
        {
          http: {
            method: 'get',
            cors: corsConfiguration,
            path: 'downloadurl',
            authorizer: {
              type: 'aws_iam'
            }
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
