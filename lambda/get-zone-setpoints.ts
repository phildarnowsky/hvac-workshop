import { DynamoDB } from 'aws-sdk'
import { LambdaHandler, jsonResponse } from './helpers'

const BUILDING_TABLE_NAME = process.env.BUILDING_TABLE_NAME || 'ERROR'
const dynamodbClient = new DynamoDB.DocumentClient()

const handler: LambdaHandler = async (event) => {
  const zoneId = event.pathParameters?.zoneId

  const zoneQueryResponse = await dynamodbClient.query({
    TableName: BUILDING_TABLE_NAME,
    IndexName: 'zone_id',
    KeyConditionExpression: 'sk = :zone_id',
    ExpressionAttributeValues: {
      ':zone_id': `ZONE#${zoneId}`
    }
  }).promise().catch((errorMessage) => {
    console.error(errorMessage)
    return null
  })

  const items = zoneQueryResponse?.Items || []
  if (items.length === 0) {
    return jsonResponse(404, `No zone with id: ${zoneId}`)
  }

  const item = items[0]
  if (item.setpoints) {
    return jsonResponse(200, item.setpoints)
  }

  const buildingId = item.pk
  const buildingGetResponse = await dynamodbClient.get({
    TableName: BUILDING_TABLE_NAME,
    Key: {
      pk: buildingId,
      sk: 'PROFILE'
    }
  }).promise().catch((errorMessage) => {
    console.error(errorMessage)
    return null
  })

  if (!buildingGetResponse?.Item) {
    return jsonResponse(404, `No building with id: ${buildingId}`)
  }

  return jsonResponse(200, buildingGetResponse.Item.setpoints)
}

exports.handler = handler
