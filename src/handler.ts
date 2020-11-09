import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk'
import 'source-map-support/register';
import * as csv from "csvtojson"
import { makeErrorResponse, makeSuccessResponse } from './makeResponse';

const s3 = new S3()

export const restrict: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const data = await s3.getObject({ Bucket: 'auswertung-csv', Key: `${event.pathParameters.file}.csv` }).promise()
    const jsonObject = await csv().fromString(data.Body.toString())

    return makeSuccessResponse(jsonObject)
  } catch (e) {
    return makeErrorResponse(e)
  }
}

export const createDownloadUrl: APIGatewayProxyHandler = async () => {
  const signedUrl = s3.getSignedUrl('getObject', {
    Bucket: 'auswertung-csv',
    Key: 'copdev.pdf'
  })

  return makeSuccessResponse(signedUrl, { 'Content-Type': 'text/plain', 'Content-Encoding': 'UTF-8' })
}
