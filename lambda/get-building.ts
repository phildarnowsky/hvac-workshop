import { DynamoDB } from 'aws-sdk'
import { LambdaHandler, jsonResponse } from './helpers'

const BUILDING_TABLE_NAME = process.env.BUILDING_TABLE_NAME || 'ERROR'
const dynamodbClient = new DynamoDB.DocumentClient()

const handler: LambdaHandler = async (event) => {
  const buildingId = event.pathParameters?.buildingId

  const buildingGetResponse = await dynamodbClient.get({
    TableName: BUILDING_TABLE_NAME,
    Key: {
      pk: `BUILDING#${buildingId}`,
      sk: 'PROFILE'
    }
  }).promise().catch((errorMessage) => {
    console.error(errorMessage)
    return null
  })

  if (!buildingGetResponse?.Item) {
    return jsonResponse(404, `No building with id: ${buildingId}`)
  }

  return jsonResponse(200, buildingGetResponse.Item)
}

exports.handler = handler
