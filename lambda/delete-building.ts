
import { DynamoDB } from 'aws-sdk'
import { LambdaHandler, jsonResponse } from './helpers'

const BUILDING_TABLE_NAME = process.env.BUILDING_TABLE_NAME || 'ERROR'
const dynamodbClient = new DynamoDB.DocumentClient()

const handler: LambdaHandler = async (event) => {
  const buildingId = event.pathParameters?.buildingId

  await dynamodbClient.delete({
    TableName: BUILDING_TABLE_NAME,
    Key: {
      pk: `BUILDING#${buildingId}`,
      sk: 'PROFILE'
    }
  }).promise().catch(console.error)

  return jsonResponse(204)
}

exports.handler = handler
