import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export type LambdaHandler = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;

export const jsonResponse = (status: number, data?: any) => {
    return {
        statusCode: status,
        ...(data && { body: JSON.stringify(data) }),
    };
};
