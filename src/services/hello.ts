import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from 'uuid'
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context) {
    const commands = new ListBucketsCommand({})
    const listBucketsResult = (await s3Client.send(commands)).Buckets

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello I will read from ${process.env.TABLE_NAME}, and the id is: ${v4()} and here are your buckets: ${JSON.stringify(listBucketsResult)}`}),
    };
    console.log("Event: ", event);
    return response;
}

export { handler };