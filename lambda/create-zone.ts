
import { DynamoDB } from "aws-sdk";
import { v4 as uuid } from "uuid";
import { LambdaHandler, jsonResponse } from "./helpers";

const BUILDING_TABLE_NAME = process.env.BUILDING_TABLE_NAME || "ERROR";
const dynamodbClient = new DynamoDB.DocumentClient();

const handler: LambdaHandler = async (event) => {
    const buildingId = event.pathParameters?.buildingId;
    
    let body;
    try {
        body = JSON.parse(event.body!);
    } catch {
        return jsonResponse(422, "Invalid JSON body");
    }

    // Required param
    if (!body.name) {
        return jsonResponse(422, "Must provide a name: string");
    }

    // Optional param
    if (body.setpoints && body.setpoints.length !== 2) {
        return jsonResponse(422, "Setpoints must be of type [number, number]")
    }

    const zoneItem = {
        id: uuid(),
        name: body.name,
        setpoints: body.setpoints,
    }

    await dynamodbClient.put({
        TableName: BUILDING_TABLE_NAME,
        Item: {
            pk: `BUILDING#${buildingId}`,
            sk: `ZONE#${zoneItem.id}`,
            name: zoneItem.name,
            setpoints: zoneItem.setpoints, 
        }
    }).promise().catch(console.error);


    return jsonResponse(200, zoneItem);
}

exports.handler = handler;