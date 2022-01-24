
import { DynamoDB } from "aws-sdk";
import { v4 as uuid } from "uuid";
import { LambdaHandler, jsonResponse } from "./helpers";

const BUILDING_TABLE_NAME = process.env.BUILDING_TABLE_NAME || "ERROR";
const dynamodbClient = new DynamoDB.DocumentClient();

const handler: LambdaHandler = async (event) => {
    let body;
    try {
        body = JSON.parse(event.body!);
    } catch {
        return jsonResponse(422, "Invalid JSON body");
    }

    if (!body.name) {
        return jsonResponse(422, "Must provide a name: string");
    }

    if (!body.setpoints || body.setpoints.length !== 2) {
        return jsonResponse(422, "Must provide setpoints: [number, number]")
    }

    const buildingItem = {
        id: uuid(),
        name: body.name,
        setpoints: body.setpoints,
    }

    await dynamodbClient.put({
        TableName: BUILDING_TABLE_NAME,
        Item: {
            pk: `BUILDING#${buildingItem.id}`,
            sk: "PROFILE",
            name: buildingItem.name,
            setpoints: buildingItem.setpoints, 
        }
    }).promise().catch(console.error);


    return jsonResponse(200, buildingItem);
}

exports.handler = handler;