import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent } from 'aws-lambda'

import { LambdaHandler, jsonResponse } from './helpers'

const BUILDING_TABLE_NAME = process.env.BUILDING_TABLE_NAME || 'ERROR'
const dynamodbClient = new DynamoDB.DocumentClient()

const UPDATABLE_FIELDS = ['name', 'setpoints']

interface UpdateParameters {
  UpdateExpression: string
  ExpressionAttributeValues: Record<string, any>
  ExpressionAttributeNames: Record<string, string>
}

const createUpdateParameters = (event: APIGatewayProxyEvent): ['bad_body', null] | ['bad_setpoints', null] | ['success', UpdateParameters] => {
  let body
  try {
    body = JSON.parse(event.body!)
  } catch {
    return ['bad_body', null]
  }

  if (body.setpoints && body.setpoints.length !== 2) {
    return ['bad_setpoints', null]
  }

  const { updateFragments, ExpressionAttributeValues, ExpressionAttributeNames } = Object.entries(body).reduce(
    (previous, [key, value]) => {
      const { updateFragments, ExpressionAttributeValues, ExpressionAttributeNames } = previous
      if (UPDATABLE_FIELDS.some((updatableField) => key === updatableField)) {
        const expressionAttributeValueName = `:${key}`
        const expressionAttributeName = `#${key}`
        const newUpdateFragments: string[] = [...updateFragments, `${expressionAttributeName} = ${expressionAttributeValueName}`]
        const newExpressionAttributeValues: Record<string, any> = { ...ExpressionAttributeValues, [expressionAttributeValueName]: value }
        const newExpressionAttributeNames: Record<string, string> = { ...ExpressionAttributeNames, [expressionAttributeName]: key }
        return { updateFragments: newUpdateFragments, ExpressionAttributeValues: newExpressionAttributeValues, ExpressionAttributeNames: newExpressionAttributeNames }
      } else {
        return previous
      }
    },
    { updateFragments: [] as string[], ExpressionAttributeValues: {}, ExpressionAttributeNames: {} }
  )

  if (updateFragments.length === 0) {
    return ['success', { ExpressionAttributeValues: {}, UpdateExpression: '', ExpressionAttributeNames: {} }]
  }

  const UpdateExpression = `SET ${updateFragments.join(', ')}`
  return ['success', { ExpressionAttributeValues, UpdateExpression, ExpressionAttributeNames }]
}

export const handler: LambdaHandler = async (event) => {
  const buildingId = event.pathParameters?.buildingId

  const [updateStatus, updateParameters] = createUpdateParameters(event)

  switch (updateStatus) {
    case 'bad_body':
      return jsonResponse(400, 'malformed request body')
    case 'bad_setpoints':
      return jsonResponse(400, 'setpoints must have format [number, number]')
  }

  const result = await dynamodbClient.update({
    ...updateParameters,
    TableName: BUILDING_TABLE_NAME,
    Key: {
      pk: `BUILDING#${buildingId}`,
      sk: 'PROFILE'
    },
    ConditionExpression: 'attribute_exists(pk)',
    ReturnValues: 'ALL_NEW'
  }).promise().catch((error) => {
    console.error(error)
    return null
  })

  if (result) {
    return jsonResponse(204, result.Attributes)
  } else {
    return jsonResponse(404, `No building with id: ${buildingId}`)
  }
}
