
import { DynamoDB } from "aws-sdk";
import { LambdaHandler, jsonResponse } from "./helpers";

const BUILDING_TABLE_NAME = process.env.BUILDING_TABLE_NAME || "ERROR";
const dynamodbClient = new DynamoDB.DocumentClient();

const handler: LambdaHandler = async (event) => {
    const buildingId = event.pathParameters?.buildingId;
    const zoneId = event.pathParameters?.zoneId;

    const zoneGetResponse = await dynamodbClient.get({
        TableName: BUILDING_TABLE_NAME,
        Key: {
            pk: `BUILDING#${buildingId}`,
            sk: `ZONE#${zoneId}`
        }
    }).promise().catch(console.error);

    if (!zoneGetResponse?.Item) {
        return jsonResponse(404, `No zone with id: ${zoneId}`);
    }

    return jsonResponse(200, ...zoneGetResponse.Item[0]);
}

exports.handler = handler;